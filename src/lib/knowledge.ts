/*
 * MediSense prototype knowledge base.
 *
 * The same symptom–condition relationships are mirrored by the project team
 * in a separate SWI-Prolog knowledge base for the AI course presentation.
 * The website never exposes Prolog; this is plain structured prototype data.
 */

export interface Symptom {
  id: string;
  label: string;
  category: string;
}

export const SYMPTOM_CATEGORIES = [
  "General",
  "Head & Body",
  "Respiratory",
  "Digestive",
  "Skin",
  "Other",
] as const;

export const SYMPTOMS: Symptom[] = [
  { id: "fever", label: "Fever", category: "General" },
  { id: "fatigue", label: "Fatigue", category: "General" },
  { id: "weakness", label: "Weakness", category: "General" },
  { id: "chills", label: "Chills", category: "General" },
  { id: "loss_of_appetite", label: "Loss of appetite", category: "General" },
  { id: "headache", label: "Headache", category: "Head & Body" },
  { id: "dizziness", label: "Dizziness", category: "Head & Body" },
  { id: "body_aches", label: "Body aches", category: "Head & Body" },
  { id: "joint_pain", label: "Joint pain", category: "Head & Body" },
  { id: "muscle_pain", label: "Muscle pain", category: "Head & Body" },
  { id: "cough", label: "Cough", category: "Respiratory" },
  { id: "sore_throat", label: "Sore throat", category: "Respiratory" },
  { id: "runny_nose", label: "Runny nose", category: "Respiratory" },
  { id: "shortness_of_breath", label: "Shortness of breath", category: "Respiratory" },
  { id: "chest_discomfort", label: "Chest discomfort", category: "Respiratory" },
  { id: "nausea", label: "Nausea", category: "Digestive" },
  { id: "vomiting", label: "Vomiting", category: "Digestive" },
  { id: "diarrhea", label: "Diarrhea", category: "Digestive" },
  { id: "abdominal_pain", label: "Abdominal pain", category: "Digestive" },
  { id: "rash", label: "Rash", category: "Skin" },
  { id: "itching", label: "Itching", category: "Skin" },
  { id: "eye_pain", label: "Eye pain", category: "Other" },
  { id: "dehydration", label: "Dehydration", category: "Other" },
];

export const symptomLabel = (id: string) =>
  SYMPTOMS.find((s) => s.id === id)?.label ?? id;

export const DURATION_OPTIONS = [
  "Less than 1 day",
  "1–3 days",
  "4–7 days",
  "More than 7 days",
] as const;

export const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe"] as const;

export const RAINY_OPTIONS = ["Yes", "No", "Not sure"] as const;

export type Duration = (typeof DURATION_OPTIONS)[number];
export type Severity = (typeof SEVERITY_OPTIONS)[number];
export type RainySeason = (typeof RAINY_OPTIONS)[number];

export interface Condition {
  id: string;
  name: string;
  group: "Common" | "Rainy-season relevant";
  /** Symptom id -> importance weight within this condition's pattern. */
  weights: Record<string, number>;
  suggestions: string[];
}

export const CONDITIONS: Condition[] = [
  {
    id: "flu",
    name: "Flu / Influenza",
    group: "Common",
    weights: {
      fever: 2, cough: 2, sore_throat: 2, fatigue: 1,
      headache: 1, body_aches: 1, chills: 1, runny_nose: 1,
    },
    suggestions: [
      "Get plenty of rest and avoid strenuous activity.",
      "Drink warm fluids and monitor your temperature.",
    ],
  },
  {
    id: "common_cold",
    name: "Common Cold",
    group: "Common",
    weights: {
      runny_nose: 2, sore_throat: 2, cough: 1, headache: 1, fatigue: 1,
    },
    suggestions: [
      "Rest well and stay hydrated with warm drinks.",
      "Gargling with warm salt water may ease a sore throat.",
    ],
  },
  {
    id: "allergy",
    name: "Allergy",
    group: "Common",
    weights: { itching: 2, runny_nose: 2, rash: 1, cough: 1, sore_throat: 1 },
    suggestions: [
      "Try to identify and avoid the possible trigger (dust, pollen, food).",
      "Keep the affected skin clean and avoid scratching.",
    ],
  },
  {
    id: "gastritis",
    name: "Gastritis",
    group: "Common",
    weights: {
      abdominal_pain: 2, nausea: 2, loss_of_appetite: 2, vomiting: 1,
    },
    suggestions: [
      "Eat small, bland meals and avoid spicy or acidic food.",
      "Avoid alcohol and monitor whether pain persists after meals.",
    ],
  },
  {
    id: "migraine",
    name: "Migraine",
    group: "Common",
    weights: {
      headache: 3, nausea: 1, dizziness: 1, eye_pain: 1, fatigue: 1,
    },
    suggestions: [
      "Rest in a quiet, dark room and limit screen time.",
      "Note possible triggers such as stress, light, or missed meals.",
    ],
  },
  {
    id: "food_poisoning",
    name: "Food Poisoning",
    group: "Common",
    weights: {
      vomiting: 2, diarrhea: 2, abdominal_pain: 2, nausea: 1, weakness: 1,
    },
    suggestions: [
      "Sip oral rehydration fluids frequently to prevent dehydration.",
      "Avoid solid, greasy, or dairy food until symptoms settle.",
    ],
  },
  {
    id: "respiratory_infection",
    name: "Respiratory Infection",
    group: "Common",
    weights: {
      cough: 2, shortness_of_breath: 2, chest_discomfort: 2,
      fever: 1, fatigue: 1, sore_throat: 1,
    },
    suggestions: [
      "Rest, keep warm, and monitor your breathing and temperature.",
      "Seek care promptly if breathing becomes difficult.",
    ],
  },
  {
    id: "dengue",
    name: "Dengue",
    group: "Rainy-season relevant",
    weights: {
      fever: 2, headache: 2, body_aches: 2, eye_pain: 2,
      joint_pain: 1, muscle_pain: 1, rash: 1, fatigue: 1, nausea: 1,
    },
    suggestions: [
      "Stay well hydrated and monitor your temperature regularly.",
      "Watch for warning signs such as bleeding gums or severe abdominal pain.",
      "Prevent mosquito bites while unwell to avoid spreading infection.",
    ],
  },
  {
    id: "chikungunya",
    name: "Chikungunya",
    group: "Rainy-season relevant",
    weights: {
      joint_pain: 3, fever: 2, muscle_pain: 1, headache: 1, rash: 1, fatigue: 1,
    },
    suggestions: [
      "Rest the affected joints and stay hydrated.",
      "Use mosquito protection; joint pain can persist, so monitor it.",
    ],
  },
  {
    id: "malaria",
    name: "Malaria",
    group: "Rainy-season relevant",
    weights: {
      fever: 2, chills: 2, headache: 1, fatigue: 1, nausea: 1, weakness: 1,
    },
    suggestions: [
      "A blood test is the only reliable way to confirm malaria — consider testing.",
      "Track fever cycles and seek care if fever returns in waves.",
    ],
  },
  {
    id: "acute_diarrheal",
    name: "Acute Diarrheal / Water-borne Illness",
    group: "Rainy-season relevant",
    weights: {
      diarrhea: 3, dehydration: 2, vomiting: 1, abdominal_pain: 1,
      weakness: 1, nausea: 1,
    },
    suggestions: [
      "Use oral rehydration solution regularly, even in small sips.",
      "Drink only safe, treated water and wash hands frequently.",
    ],
  },
];

export type MatchLevel = "High" | "Moderate" | "Low";

export interface ConditionResult {
  condition: Condition;
  score: number;
  level: MatchLevel;
  matchedSymptoms: string[];
  why: string;
}

export interface AssessmentInput {
  symptoms: string[];
  duration: Duration;
  severity: Severity;
  rainySeason: RainySeason;
}

const RAINY_BOOST_IDS = new Set([
  "dengue",
  "chikungunya",
  "malaria",
  "acute_diarrheal",
]);

export const matchLevel = (score: number): MatchLevel =>
  score >= 65 ? "High" : score >= 40 ? "Moderate" : "Low";

/*
 * Symptom-match score: share of the condition's weighted pattern covered by
 * the reported symptoms, scaled so partial but solid overlap lands in the
 * moderate range. Rainy-season context adds a small contextual boost only —
 * it never produces a rainy-season result on its own.
 */
export function analyze(input: AssessmentInput): ConditionResult[] {
  const selected = new Set(input.symptoms);
  const results: ConditionResult[] = [];

  for (const condition of CONDITIONS) {
    const entries = Object.entries(condition.weights);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let matched = 0;
    const matchedSymptoms: string[] = [];
    for (const [symptomId, weight] of entries) {
      if (selected.has(symptomId)) {
        matched += weight;
        matchedSymptoms.push(symptomId);
      }
    }
    if (matchedSymptoms.length < 2) continue;

    let score = Math.round((matched / total) * 100 * 1.35);
    if (input.rainySeason === "Yes" && RAINY_BOOST_IDS.has(condition.id)) {
      score += 5;
    }
    score = Math.min(95, score);
    if (score < 25) continue;

    results.push({
      condition,
      score,
      level: matchLevel(score),
      matchedSymptoms,
      why:
        matchedSymptoms.length >= 4
          ? "Several of your reported symptoms match patterns associated with this condition."
          : "Some of your reported symptoms overlap with this condition's pattern.",
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 4);
}

export const GENERAL_SUGGESTIONS = [
  "Get enough rest and avoid overexertion.",
  "Stay hydrated throughout the day.",
  "Monitor your symptoms and note any changes.",
  "Monitor your temperature if you have a fever.",
  "Seek professional medical advice if symptoms persist or worsen.",
];

export const WARNING_SIGNS = [
  "Severe difficulty breathing",
  "Severe chest pain",
  "Fainting",
  "Confusion",
  "Severe dehydration",
  "Severe or rapidly worsening symptoms",
];

export const DISCLAIMER =
  "MediSense provides preliminary health information based on user-provided symptoms. It is not a medical diagnosis and does not replace professional medical advice.";
