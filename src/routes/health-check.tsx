import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";
import {
  DURATION_OPTIONS,
  RAINY_OPTIONS,
  SEVERITY_OPTIONS,
  SYMPTOM_CATEGORIES,
  SYMPTOM_CATEGORY_TRANSLATIONS,
  SYMPTOMS,
  type AssessmentInput,
  type Duration,
  type RainySeason,
  type Severity,
} from "@/lib/knowledge";
import { buildAssessment, setCurrentAssessment } from "@/lib/assessments";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/health-check")({
  head: () => ({
    meta: [
      { title: "Health Check — MediSense" },
      {
        name: "description",
        content:
          "Select your symptoms, duration, and severity to explore possible health conditions with symptom-match scores.",
      },
      { property: "og:title", content: "Health Check — MediSense" },
      {
        property: "og:description",
        content:
          "Select your symptoms, duration, and severity to explore possible health conditions with symptom-match scores.",
      },
    ],
  }),
  component: HealthCheckPage,
});

function HealthCheckPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const optionLabel = (value: string) => {
    if (language === "en") return value;
    return {
      "Less than 1 day": "၁ ရက်အောက်",
      "1–3 days": "၁–၃ ရက်",
      "4–7 days": "၄–၇ ရက်",
      "More than 7 days": "၇ ရက်အထက်",
      Mild: "အနည်းငယ်",
      Moderate: "အလယ်အလတ်",
      Severe: "ပြင်းထန်",
      Yes: "ဟုတ်သည်",
      No: "မဟုတ်ပါ",
      "Not sure": "မသေချာပါ",
    }[value] ?? value;
  };
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState<Duration | "">("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [rainySeason, setRainySeason] = useState<RainySeason | "">("");
  const [error, setError] = useState("");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setError("");
  };

  const reset = () => {
    setSelected(new Set());
    setDuration("");
    setSeverity("");
    setRainySeason("");
    setError("");
  };

  const submit = () => {
    if (selected.size === 0) {
      setError(t("selectSymptomError"));
      return;
    }
    if (!duration || !severity || !rainySeason) {
      setError(t("answerQuestionsError"));
      return;
    }
    const input: AssessmentInput = {
      symptoms: [...selected],
      duration,
      severity,
      rainySeason,
    };
    setCurrentAssessment(buildAssessment(input));
    navigate({ to: "/results" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
          <ClipboardList className="size-3.5" />
          {t("healthCheckBadge")}
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
          {t("healthCheckTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t("healthCheckDescription")}
        </p>
      </header>

      {/* Symptoms */}
      <section className="mt-10 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-foreground">{t("yourSymptoms")}</h2>
          <span className="text-sm font-medium text-muted-foreground">
            {t("selected", { count: selected.size })}
          </span>
        </div>
        <div className="mt-5 space-y-6">
          {SYMPTOM_CATEGORIES.map((category) => {
            const items = SYMPTOMS.filter((s) => s.category === category);
            if (items.length === 0) return null;
            return (
              <fieldset
                key={category}
                className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6"
              >
                <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {language === "mm" ? (SYMPTOM_CATEGORY_TRANSLATIONS[category] ?? category) : category}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {items.map((symptom) => {
                    const active = selected.has(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => toggle(symptom.id)}
                        aria-pressed={active}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer active:scale-[0.97]",
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-card"
                            : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary-soft",
                        )}
                      >
                        {language === "mm" ? (symptom.name_mm ?? symptom.label) : symptom.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      </section>

      {/* Context questions */}
      <section
        className="mt-8 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up sm:items-start sm:grid-cols-3 sm:p-8"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="duration"
            className="min-h-10 text-sm font-semibold leading-5 text-foreground"
          >
            {t("durationQuestion")}
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value as Duration);
              setError("");
            }}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-2 focus:outline-ring"
          >
            <option value="">{t("select")}</option>
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {optionLabel(d)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="severity" className="min-h-10 text-sm font-semibold leading-5 text-foreground">
            {t("severityQuestion")}
          </label>
          <select
            id="severity"
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value as Severity);
              setError("");
            }}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-2 focus:outline-ring"
          >
            <option value="">{t("select")}</option>
            {SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {optionLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="rainy" className="min-h-10 text-sm font-semibold leading-5 text-foreground">
            {t("rainyQuestion")}
          </label>
          <select
            id="rainy"
            value={rainySeason}
            onChange={(e) => {
              setRainySeason(e.target.value as RainySeason);
              setError("");
            }}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-2 focus:outline-ring"
          >
            <option value="">{t("select")}</option>
            {RAINY_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {optionLabel(r)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={submit}>
          {t("analyzeMySymptoms")}
          <ArrowRight className="size-4" />
        </Button>
        <Button variant="ghost" size="lg" onClick={reset}>
          <RotateCcw className="size-4" />
          {t("reset")}
        </Button>
      </div>
    </div>
  );
}
