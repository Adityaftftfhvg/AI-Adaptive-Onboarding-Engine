import { pipeline } from "@xenova/transformers";

interface CourseWithEmbedding {
  course: string;
  skills: string;
  level: string;
  duration: string;
  rating: string;
  certificate_type?: string;
  prerequisites: string;
  skill_level_required: string;
  embedding: number[];
}

let cachedEmbeddings: CourseWithEmbedding[] | null = null;
let embedder: any = null;

export function loadEmbeddings(): CourseWithEmbedding[] {
  if (cachedEmbeddings) return cachedEmbeddings;
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(process.cwd(), "src", "data", "catalog_embeddings.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedEmbeddings = JSON.parse(raw);
  return cachedEmbeddings!;
}

async function getEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/nomic-embed-text-v1");
  }
  const output = await embedder(`search_query: ${text}`, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data as Float32Array);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function searchCatalog(
  missingSkills: string[],
  topN = 15
): Promise<(Omit<CourseWithEmbedding, "embedding"> & { score: number })[]> {
  const query = `Skills needed: ${missingSkills.join(", ")}`;
  const queryEmbedding = await getEmbedding(query);
  const catalog = loadEmbeddings();

  const scored = catalog.map((course) => ({
    ...course,
    score: cosineSimilarity(queryEmbedding, course.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ embedding, ...course }) => course);
}
