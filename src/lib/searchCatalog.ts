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

export type CatalogCourse = Omit<CourseWithEmbedding, "embedding"> & {
  skillsList: string[];
};

let cachedEmbeddings: CourseWithEmbedding[] | null = null;
let cachedCatalog: CatalogCourse[] | null = null;


function parseSkillsField(raw: string): string[] {
  if (!raw) return [];
  return raw
    .replace(/^{|}$/g, "")
    .split(/","|",|,"/)
    .map((s) => s.replace(/^"|"$/g, "").trim().toLowerCase())
    .filter(Boolean);
}

export function loadEmbeddings(): CourseWithEmbedding[] {
  if (cachedEmbeddings) return cachedEmbeddings;
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(process.cwd(), "src", "data", "catalog_embeddings.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedEmbeddings = JSON.parse(raw);
  return cachedEmbeddings!;
}

function loadCatalog(): CatalogCourse[] {
  if (cachedCatalog) return cachedCatalog;
  const raw = loadEmbeddings();
  cachedCatalog = raw.map(({ embedding, ...course }) => ({
    ...course,
    skillsList: parseSkillsField(course.skills),
  }));
  return cachedCatalog;
}

)
function normalize(skill: string): string {
  return skill.toLowerCase().trim().replace(/[^a-z0-9\s+#.]/g, "");
}


function scoreCourse(courseSkills: string[], missingSkills: string[]): number {
  let score = 0;
  const normCourseSkills = courseSkills.map(normalize);

  for (const missing of missingSkills) {
    const normMissing = normalize(missing);
    if (!normMissing) continue;

    let matched = false;
    for (const cs of normCourseSkills) {
      if (!cs) continue;
      if (cs === normMissing) {
        score += 3; // exact match
        matched = true;
        break;
      }
      if (cs.includes(normMissing) || normMissing.includes(cs)) {
        score += 1.5; // partial/substring match
        matched = true;
        break;
      }
      // token overlap fallback (e.g. "machine learning" vs "ml machine learning basics")
      const missingTokens = normMissing.split(/\s+/).filter((t) => t.length > 2);
      const csTokens = new Set(cs.split(/\s+/));
      const overlap = missingTokens.filter((t) => csTokens.has(t)).length;
      if (overlap > 0 && overlap === missingTokens.length) {
        score += 1;
        matched = true;
        break;
      }
    }
    if (!matched) continue;
  }

  return score;
}


export async function searchCatalog(
  missingSkills: string[],
  topN = 15
): Promise<(Omit<CatalogCourse, "skillsList"> & { score: number })[]> {
  const catalog = loadCatalog();

  const scored = catalog.map((course) => ({
    ...course,
    score: scoreCourse(course.skillsList, missingSkills),
  }));

  const ranked = scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  // If nothing matched directly, fall back to returning the top-rated
  // courses so the LLM still has candidates to reason over.
  const pool = ranked.length > 0 ? ranked : scored;

  return pool.slice(0, topN).map(({ skillsList, ...course }) => course);
}
