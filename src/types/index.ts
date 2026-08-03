export interface SkillGap {
  resume_skills: string[];
  jd_skills: string[];
  missing_skills: string[];
  priority: string[];
}

export interface Course {
  course: string;
  skills_covered: string[];
  level: string;
  duration: string;
  rating: string;
  certificate_type: string;
  prerequisites: string[];
  reason: string;
}

export interface TraceStep {
  step: string;
  input: string | string[];
  output: string | string[];
  reasoning: string;
}

export interface GroundingStats {
  total_recommended: number;
  total_grounded: number;
  hallucinations_removed: number;
}

export interface ImpactMetrics {
  total_training_hours: number;
  personalized_training_hours: number;
  hours_saved: number;
  efficiency_gain_percent: number;
  skills_already_known: number;
  skills_to_learn: number;
  estimated_completion_weeks: number;
}

export interface AnalysisResult {
  skill_gap: SkillGap;
  pathway: Course[];
  trace: TraceStep[];
  grounding: GroundingStats;
  impact: ImpactMetrics; 
  uncoveredSkills: string[];
}

export type Tab = "gap" | "roadmap" | "trace";
export type InputMode = "text" | "pdf";

// ── Resume Builder types ────────────────────────────────────────────────

export interface ResumeExperience {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  bullets: string[];
  tech: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: string[];
  certifications?: string[];
  ats_score: number;
  ats_notes: string[];
}

export type ResumeBuilderMode = "create" | "improve";
export type ResumeTemplate = "classic" | "modern" | "minimal";

export interface ResumeBuilderInput {
  mode: ResumeBuilderMode;
  targetRole?: string;      
  rawText: string;          
}