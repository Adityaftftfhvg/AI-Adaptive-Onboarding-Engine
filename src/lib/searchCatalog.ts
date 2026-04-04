import fs from "fs";
import path from "path";
import Papa from "papaparse";

interface Course {
  course: string;
  skills: string;
  level: string;
  duration: string;
  rating: string;
  certificate_type: string;
  prerequisites: string;
  skill_level_required: string;
}

let cachedCourses: Course[] | null = null;

export function loadEmbeddings(): Course[] {
  if (cachedCourses) return cachedCourses;
  const filePath = path.join(process.cwd(), "src", "data", "coursera_enriched.csv");
  const raw = fs.readFileSync(filePath, "utf-8");
  const result = Papa.parse<Course>(raw, { header: true, skipEmptyLines: true });
  cachedCourses = result.data;
  return cachedCourses;
}

export async function searchCatalog(missingSkills: string[], topN = 15): Promise<Course[]> {
  const courses = loadEmbeddings();
  const skillsLower = missingSkills.map((s) => s.toLowerCase());

  const scored = courses.map((course) => {
    const haystack = `${course.course} ${course.skills}`.toLowerCase();
    const score = skillsLower.reduce(
      (sum, skill) => sum + (haystack.includes(skill) ? 1 : 0),
      0
    );
    return { ...course, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ score, ...course }) => course);
}