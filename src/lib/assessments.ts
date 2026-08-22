import {
  analyze,
  GENERAL_SUGGESTIONS,
  WARNING_SIGNS,
  type AssessmentInput,
  type ConditionResult,
} from "./knowledge";
import { getCurrentUser } from "./auth";

/*
 * Browser-local assessment storage for the prototype.
 * History is kept per signed-in email (or a guest bucket when logged out).
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

function historyKey(): string {
  const user = getCurrentUser();
  return `medisense:history:${user ? user.email : "guest"}`;
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

export function listAssessments(): Assessment[] {
  try {
    const raw = localStorage.getItem(historyKey());
    const items: Assessment[] = raw ? JSON.parse(raw) : [];
    return items.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function saveAssessment(a: Assessment) {
  const items = listAssessments();
  if (items.some((x) => x.id === a.id)) return;
  localStorage.setItem(historyKey(), JSON.stringify([a, ...items]));
  window.dispatchEvent(new Event("medisense-history"));
}

/* ---------- Demo data (seeded once per history bucket) ---------- */

function demoEntry(
  id: string,
  date: string,
  input: AssessmentInput,
  results: Array<[conditionId: string, name: string, score: number, matched: string[]]>,
): Assessment {
  const levelOf = (s: number) => (s >= 65 ? "High" : s >= 40 ? "Moderate" : "Low");
  return {
    id,
    date,
    input,
    demo: true,
    results: results.map(([conditionId, name, score, matched]) => ({
      conditionId,
      name,
      score,
      level: levelOf(score),
      matchedSymptoms: matched,
      why: "Several of your reported symptoms match patterns associated with this condition.",
      suggestions: [],
    })),
    suggestions: [],
    warnings: WARNING_SIGNS,
  };
}

const DEMO_ASSESSMENTS: Assessment[] = [
  demoEntry(
    "demo_1",
    "2026-08-22T09:30:00.000Z",
    {
      symptoms: ["fever", "headache", "body_aches", "fatigue"],
      duration: "1–3 days",
      severity: "Moderate",
      rainySeason: "Yes",
    },
    [
      ["dengue", "Dengue", 72, ["fever", "headache", "body_aches", "fatigue"]],
      ["flu", "Flu / Influenza", 58, ["fever", "headache", "fatigue", "body_aches"]],
      ["chikungunya", "Chikungunya", 43, ["fever", "headache", "fatigue"]],
    ],
  ),
  demoEntry(
    "demo_2",
    "2026-08-15T14:10:00.000Z",
    {
      symptoms: ["cough", "sore_throat", "runny_nose", "fatigue"],
      duration: "1–3 days",
      severity: "Mild",
      rainySeason: "Not sure",
    },
    [
      ["flu", "Flu / Influenza", 78, ["cough", "sore_throat", "fatigue", "runny_nose"]],
      ["respiratory_infection", "Respiratory Infection", 69, ["cough", "sore_throat", "fatigue"]],
      ["common_cold", "Common Cold", 63, ["runny_nose", "sore_throat", "cough", "fatigue"]],
    ],
  ),
  demoEntry(
    "demo_3",
    "2026-08-03T18:45:00.000Z",
    {
      symptoms: ["diarrhea", "vomiting", "abdominal_pain", "weakness"],
      duration: "Less than 1 day",
      severity: "Moderate",
      rainySeason: "No",
    },
    [
      ["food_poisoning", "Food Poisoning", 81, ["vomiting", "diarrhea", "abdominal_pain", "weakness"]],
      ["acute_diarrheal", "Acute Diarrheal / Water-borne Illness", 73, ["diarrhea", "vomiting", "abdominal_pain", "weakness"]],
    ],
  ),
];

export function seedDemoAssessments() {
  const key = historyKey();
  const seededFlag = `${key}:seeded`;
  if (localStorage.getItem(seededFlag)) return;
  const existing = listAssessments();
  localStorage.setItem(key, JSON.stringify([...existing, ...DEMO_ASSESSMENTS]));
  localStorage.setItem(seededFlag, "1");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
