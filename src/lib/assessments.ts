import {
  analyze,
  GENERAL_SUGGESTIONS,
  WARNING_SIGNS,
  type AssessmentInput,
  type ConditionResult,
} from "./knowledge";
import { getCurrentUser } from "./auth";
import { requireSupabaseConfig, supabase } from "./supabase";

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
}

interface AssessmentRow {
  id: string;
  user_id: string;
  created_at: string;
  input: AssessmentInput;
  results: SavedCondition[];
  suggestions: string[];
  warnings: string[];
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

function rowToAssessment(row: Partial<AssessmentRow>): Assessment {
  const input = row.input ?? {
    symptoms: [],
    duration: "Less than 1 day",
    severity: "Mild",
    rainySeason: "Not sure",
  };

  return {
    id: row.id ?? `assessment-${row.created_at ?? Date.now()}`,
    date: row.created_at ?? new Date().toISOString(),
    input,
    results: Array.isArray(row.results) ? row.results : [],
    suggestions: Array.isArray(row.suggestions) ? row.suggestions : [],
    warnings: Array.isArray(row.warnings) ? row.warnings : [],
  };
}

export async function listAssessments(): Promise<Assessment[]> {
  requireSupabaseConfig();
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as Partial<AssessmentRow>[]).map(rowToAssessment);
}

export async function saveAssessment(a: Assessment): Promise<Assessment> {
  requireSupabaseConfig();
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Please log in to save assessments.");
  }

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      input: a.input,
      results: a.results,
      suggestions: a.suggestions,
      warnings: a.warnings,
    })
    .select("id,user_id,created_at,input,results,suggestions,warnings")
    .single();

  if (error) throw new Error(error.message);
  return rowToAssessment(data as AssessmentRow);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
