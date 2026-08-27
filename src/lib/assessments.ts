import {
  analyze,
  GENERAL_SUGGESTIONS,
  WARNING_SIGNS,
  type AssessmentInput,
  type ConditionResult,
} from "./knowledge";
import { supabase } from "@/integrations/supabase/client";

/*
 * Assessments are stored in Supabase, scoped to the signed-in user by RLS.
 * The in-progress ("current") assessment stays in sessionStorage.
 */

export interface SavedCondition {
  conditionId: string;
  name: string;
  score: number;
  level: string;
  matchedSymptoms: string[];
  why: string;
  suggestions: string[];
}

export interface Assessment {
  id: string;
  date: string; // ISO
  input: AssessmentInput;
  results: SavedCondition[];
  suggestions: string[];
  warnings: string[];
  demo?: boolean;
}

export function buildAssessment(input: AssessmentInput): Assessment {
  const results: ConditionResult[] = analyze(input);
  const topSuggestions = new Set<string>();
  for (const r of results.slice(0, 2)) {
    for (const s of r.condition.suggestions) topSuggestions.add(s);
  }
  return {
    id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    input,
    results: results.map((r) => ({
      conditionId: r.condition.id,
      name: r.condition.name,
      score: r.score,
      level: r.level,
      matchedSymptoms: r.matchedSymptoms,
      why: r.why,
      suggestions: r.condition.suggestions,
    })),
    suggestions: [...topSuggestions, ...GENERAL_SUGGESTIONS],
    warnings: WARNING_SIGNS,
  };
}

const CURRENT_KEY = "medisense:current";

export function setCurrentAssessment(a: Assessment) {
  sessionStorage.setItem(CURRENT_KEY, JSON.stringify(a));
}

export function getCurrentAssessment(): Assessment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as Assessment) : null;
  } catch {
    return null;
  }
}

/* ---------- Supabase-backed history ---------- */

export async function listAssessments(): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.created_at,
    input: {
      symptoms: row.symptoms ?? [],
      duration: row.duration,
      severity: row.severity,
      rainySeason: row.rainy_season,
    } as AssessmentInput,
    results: (row.results ?? []) as unknown as SavedCondition[],
    suggestions: row.suggestions ?? [],
    warnings: row.warnings ?? [],
  }));
}

export async function saveAssessment(a: Assessment): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error("You need to be logged in to save an assessment.");

  const { error } = await supabase.from("assessments").insert({
    user_id: userId,
    symptoms: a.input.symptoms,
    duration: a.input.duration,
    severity: a.input.severity,
    rainy_season: a.input.rainySeason,
    results: a.results as unknown as never,
    suggestions: a.suggestions,
    warnings: a.warnings,
  });

  if (error) throw error;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
