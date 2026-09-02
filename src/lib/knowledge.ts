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
  name_mm?: string;
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

export const symptomLabel = (id: string, language: "en" | "mm" = "en") => {
  const symptom = SYMPTOMS.find((item) => item.id === id);
  return language === "mm" ? (symptom?.name_mm ?? symptom?.label ?? id) : (symptom?.label ?? id);
};

export const SYMPTOM_CATEGORY_TRANSLATIONS: Record<string, string> = {
  General: "အထွေထွေ",
  "Head & Body": "ဦးခေါင်းနှင့် ခန္ဓာကိုယ်",
  Respiratory: "အသက်ရှူလမ်းကြောင်း",
  Digestive: "အစာခြေစနစ်",
  Skin: "အရေပြား",
  Other: "အခြား",
};

export const SYMPTOM_TRANSLATIONS: Record<string, string> = {
  fever: "ဖျားခြင်း",
  fatigue: "မောပန်းနွမ်းနယ်ခြင်း",
  weakness: "အားနည်းခြင်း",
  chills: "ချမ်းစိမ့်စိမ့်ဖြစ်ခြင်း",
  loss_of_appetite: "အစားအသောက်ပျက်ခြင်း",
  headache: "ခေါင်းကိုက်ခြင်း",
  dizziness: "ခေါင်းမူးခြင်း",
  body_aches: "တစ်ကိုယ်လုံးကိုက်ခဲခြင်း",
  joint_pain: "အဆစ်အမြစ်ကိုက်ခဲခြင်း",
  muscle_pain: "ကြွက်သားကိုက်ခဲခြင်း",
  cough: "ချောင်းဆိုးခြင်း",
  sore_throat: "လည်ချောင်းနာခြင်း",
  runny_nose: "နှာစေးခြင်း",
  shortness_of_breath: "အသက်ရှူရခက်ခဲခြင်း",
  chest_discomfort: "ရင်ဘတ်မအီမသာဖြစ်ခြင်း",
  nausea: "ပျို့အန်ချင်ခြင်း",
  vomiting: "အန်ခြင်း",
  diarrhea: "ဝမ်းလျှောခြင်း",
  abdominal_pain: "ဝမ်းဗိုက်နာကျင်ခြင်း",
  rash: "အဖုအပိမ့်ထွက်ခြင်း",
  itching: "ယားယံခြင်း",
  eye_pain: "မျက်စိနာခြင်း / မျက်လုံးကိုက်ခြင်း",
  dehydration: "ရေဓာတ်ခမ်းခြောက်ခြင်း",
};

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
  title_mm?: string;
  description_en?: string;
  description_mm?: string;
  recommendations_mm?: string[];
  group: "Common" | "Rainy-season relevant";
  /** Symptom id -> importance weight within this condition's pattern. */
  weights: Record<string, number>;
  suggestions: string[];
}

export const CONDITION_TRANSLATIONS: Record<string, string> = {
  flu: "တုပ်ကွေးရောဂါ",
  common_cold: "အအေးမိခြင်း",
  allergy: "ဓာတ်မတည့်ခြင်း",
  gastritis: "အစာအိမ်ရောင်ခြင်း",
  migraine: "ခေါင်းတစ်ခြမ်းကိုက်ရောဂါ",
  food_poisoning: "အစားအသောက်မှဆိပ်သင့်ခြင်း",
  respiratory_infection: "အသက်ရှူလမ်းကြောင်း ပိုးဝင်ခြင်း",
  dengue: "သွေးလွန်တုပ်ကွေး",
  chikungunya: "ချီကွန်ဂွန်ယာ တုပ်ကွေး",
  malaria: "ငှက်ဖျားရောဂါ",
  acute_diarrheal: "ပြင်းထန်ဝမ်းလျှောရောဂါ / ရေမှတစ်ဆင့်ကူးစက်သောရောဂါ",
};

export const CONDITION_MEDICAL_COPY: Record<
  string,
  { description_en: string; description_mm: string; recommendations_mm: string[] }
> = {
  flu: { description_en: "Your reported symptoms commonly overlap with influenza.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် တုပ်ကွေးရောဂါနှင့် ကိုက်ညီနိုင်ပါသည်။", recommendations_mm: ["ကောင်းစွာ အနားယူပြီး ပင်ပန်းသော လှုပ်ရှားမှုများကို ရှောင်ပါ။", "နွေးထွေးသော အရည်များ သောက်ပြီး ကိုယ်အပူချိန်ကို စောင့်ကြည့်ပါ။"] },
  common_cold: { description_en: "Your reported symptoms commonly overlap with a common cold.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် အအေးမိခြင်းနှင့် ကိုက်ညီနိုင်ပါသည်။", recommendations_mm: ["ကောင်းစွာ အနားယူပြီး နွေးထွေးသော အရည်များဖြင့် ရေဓာတ်ဖြည့်ပါ။", "ဆားရည်နွေးနွေးဖြင့် ပလုတ်ကျင်းခြင်းက လည်ချောင်းနာခြင်းကို သက်သာစေနိုင်သည်။"] },
  allergy: { description_en: "Your reported symptoms may be related to an allergy.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် ဓာတ်မတည့်ခြင်းနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["ဖုန်မှုန့်၊ ပန်းဝတ်မှုန် သို့မဟုတ် အစားအစာကဲ့သို့ ဖြစ်စေနိုင်သော အကြောင်းရင်းကို ရှောင်ပါ။", "ထိခိုက်သော အရေပြားကို သန့်ရှင်းစွာထားပြီး မကုတ်ပါနှင့်။"] },
  gastritis: { description_en: "Your reported symptoms may be related to stomach irritation.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် အစာအိမ်ရောင်ခြင်းနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["အနည်းငယ်စီ စားပြီး စပ်သော သို့မဟုတ် အချဉ်ဓာတ်များသော အစားအစာများကို ရှောင်ပါ။", "အရက်ကို ရှောင်ပြီး အစာစားပြီးနောက် နာကျင်မှု ဆက်ရှိမရှိ စောင့်ကြည့်ပါ။"] },
  migraine: { description_en: "Your reported symptoms may be related to migraine.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် ခေါင်းတစ်ခြမ်းကိုက်ရောဂါနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["တိတ်ဆိတ်မှောင်မိုက်သော နေရာတွင် အနားယူပြီး ဖန်သားပြင်ကြည့်ချိန်ကို လျှော့ပါ။", "စိတ်ဖိစီးမှု၊ အလင်းရောင် သို့မဟုတ် အစာမစားခြင်းကဲ့သို့ အစပျိုးအကြောင်းရင်းများကို မှတ်သားပါ။"] },
  food_poisoning: { description_en: "Your reported symptoms may be related to food poisoning.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် အစားအသောက်မှဆိပ်သင့်ခြင်းနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["ရေဓာတ်ခမ်းခြောက်မှု မဖြစ်စေရန် ဓာတ်ဆားရည်ကို အနည်းငယ်စီ မကြာခဏ သောက်ပါ။", "လက္ခဏာများ သက်သာသည်အထိ အဆီများသော သို့မဟုတ် နို့ထွက်အစားအစာများကို ရှောင်ပါ။"] },
  respiratory_infection: { description_en: "Your reported symptoms may be related to a respiratory infection.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် အသက်ရှူလမ်းကြောင်း ပိုးဝင်ခြင်းနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["အနားယူပြီး နွေးထွေးစွာနေကာ အသက်ရှူခြင်းနှင့် ကိုယ်အပူချိန်ကို စောင့်ကြည့်ပါ။", "အသက်ရှူရခက်လာပါက အမြန် ဆေးကုသမှု ရယူပါ။"] },
  dengue: { description_en: "Your reported symptoms may be related to dengue.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် သွေးလွန်တုပ်ကွေးနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["ရေဓာတ်လုံလောက်စွာ ဖြည့်ပြီး ကိုယ်အပူချိန်ကို ပုံမှန် စောင့်ကြည့်ပါ။", "သွေးယိုခြင်း သို့မဟုတ် ဗိုက်နာခြင်းကဲ့သို့ အန္တရာယ်လက္ခဏာများကို သတိပြုပါ။"] },
  chikungunya: { description_en: "Your reported symptoms may be related to chikungunya.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် ချီကွန်ဂွန်ယာ တုပ်ကွေးနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["နာကျင်သော အဆစ်များကို အနားပေးပြီး ရေဓာတ်ဖြည့်ပါ။", "ခြင်ကာကွယ်မှုကို အသုံးပြုပြီး လက္ခဏာများကို စောင့်ကြည့်ပါ။"] },
  malaria: { description_en: "Your reported symptoms may be related to malaria.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် ငှက်ဖျားရောဂါနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["ငှက်ဖျားရောဂါကို အတည်ပြုရန် သွေးစစ်ဆေးမှု ပြုလုပ်ရန် စဉ်းစားပါ။", "အဖျားပြန်တက်ခြင်း ရှိမရှိ စောင့်ကြည့်ပြီး ဆေးကုသမှု ရယူပါ။"] },
  acute_diarrheal: { description_en: "Your reported symptoms may be related to acute diarrheal illness.", description_mm: "သင်ဖော်ပြထားသော လက္ခဏာများသည် ပြင်းထန်ဝမ်းလျှောရောဂါနှင့် ဆက်စပ်နိုင်ပါသည်။", recommendations_mm: ["ဓာတ်ဆားရည်ကို ပုံမှန် သောက်ပါ။", "သန့်ရှင်းစွာ စီမံထားသော သောက်သုံးရေကိုသာ သုံးပြီး လက်ဆေးပါ။"] },
};

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

for (const symptom of SYMPTOMS) {
  symptom.name_mm = SYMPTOM_TRANSLATIONS[symptom.id];
}

for (const condition of CONDITIONS) {
  const copy = CONDITION_MEDICAL_COPY[condition.id];
  condition.title_mm = CONDITION_TRANSLATIONS[condition.id];
  condition.description_en = copy?.description_en;
  condition.description_mm = copy?.description_mm;
  condition.recommendations_mm = copy?.recommendations_mm;
}

export const WARNING_TRANSLATIONS: Record<string, string> = {
  "Severe difficulty breathing": "အသက်ရှူရန် အလွန်ခက်ခဲခြင်း",
  "Severe chest pain": "ရင်ဘတ် အလွန်နာကျင်ခြင်း",
  Fainting: "သတိလစ်ခြင်း",
  Confusion: "စိတ်ရှုပ်ထွေးခြင်း",
  "Severe dehydration": "ရေဓာတ် အလွန်ခမ်းခြောက်ခြင်း",
  "Severe or rapidly worsening symptoms": "ပြင်းထန်သော သို့မဟုတ် လျင်မြန်စွာ ပိုဆိုးလာသော လက္ခဏာများ",
};

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
