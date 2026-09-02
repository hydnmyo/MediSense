import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  Info,
  Save,
  Stethoscope,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { getCurrentAssessment, saveAssessment, type Assessment } from "@/lib/assessments";
import { useAuth } from "@/lib/auth";
import { CONDITIONS, WARNING_TRANSLATIONS, symptomLabel, type MatchLevel } from "@/lib/knowledge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Results — MediSense" },
      {
        name: "description",
        content:
          "Possible health conditions ranked by symptom-match score, with basic health suggestions and warning signs.",
      },
      { property: "og:title", content: "Your Results — MediSense" },
      {
        property: "og:description",
        content:
          "Possible health conditions ranked by symptom-match score, with basic health suggestions and warning signs.",
      },
    ],
  }),
  component: ResultsPage,
});

const LEVEL_STYLES: Record<MatchLevel, string> = {
  High: "bg-emergency-soft text-emergency-foreground",
  Moderate: "bg-warning-soft text-warning-foreground",
  Low: "bg-secondary text-secondary-foreground",
};

function ResultsPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setAssessment(getCurrentAssessment());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <p className="text-center text-muted-foreground">{t("loadingResults")}</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <Stethoscope className="size-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">{t("noAssessment")}</h1>
        <p className="mt-3 text-muted-foreground">
          {t("noAssessmentText")}
        </p>
        <Link to="/health-check" className="mt-8 inline-block">
          <Button size="lg">{t("startHealthCheck")}</Button>
        </Link>
      </div>
    );
  }

  const severe = assessment.input.severity === "Severe";
  const severityLabel = t(
    assessment.input.severity === "Mild"
      ? "severityMild"
      : assessment.input.severity === "Moderate"
        ? "severityModerate"
        : "severitySevere",
  );
  const levelLabel = (level: string) =>
    t(level === "High" ? "levelHigh" : level === "Moderate" ? "levelModerate" : "levelLow");
  const localizedSuggestions = assessment.results.slice(0, 2).flatMap((result) => {
    const condition = CONDITIONS.find((item) => item.id === result.conditionId);
    return language === "mm"
      ? (condition?.recommendations_mm ?? result.suggestions)
      : (condition?.suggestions ?? result.suggestions);
  });

  const handleSave = async () => {
    if (saving || saved) return;
    setSaveError("");

    if (authLoading) {
      setSaveError(t("checkingLogin"));
      return;
    }

    if (!user) {
      setSaveError(t("loginToSave"));
      return;
    }

    setSaving(true);
    try {
      const savedAssessment = await saveAssessment(assessment);
      setAssessment(savedAssessment);
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : t("cannotSave"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="animate-fade-up">
        <Link
          to="/health-check"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {t("editSymptoms")}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">
          {t("possibleConditions")}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {t("basedOnSymptoms", {
            count: assessment.input.symptoms.length,
            symptom: assessment.input.symptoms.length === 1 ? t("symptom") : t("symptoms"),
            duration: assessment.input.duration,
            severity: severityLabel,
          })}
        </p>
      </header>

      {/* Warning signs — prominent for severe */}
      <section
        className={cn(
          "mt-8 rounded-3xl border p-6 animate-fade-up sm:p-7",
          severe ? "border-emergency/40 bg-emergency-soft" : "border-warning/30 bg-warning-soft",
        )}
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className={cn(
              "mt-0.5 size-6 shrink-0",
              severe ? "text-emergency-foreground" : "text-warning-foreground",
            )}
            aria-hidden
          />
          <div>
            <h2
              className={cn(
                "text-lg font-bold",
                severe ? "text-emergency-foreground" : "text-warning-foreground",
              )}
            >
              {severe
                ? (language === "mm" ? t("emergencyWarningTitle") : t("severeWarning"))
                : t("emergencyWarningTitle")}
            </h2>
            {severe && (
              <p className="mt-1 text-sm font-medium text-emergency-foreground">
                {t("severeWarningText")}
              </p>
            )}
            <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {assessment.warnings.map((w) => (
                <li
                  key={w}
                  className={cn(
                    "flex gap-2",
                    severe ? "text-emergency-foreground" : "text-warning-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      severe ? "bg-emergency" : "bg-warning",
                    )}
                    aria-hidden
                  />
                  {language === "mm" ? (WARNING_TRANSLATIONS[w] ?? w) : w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ranked conditions */}
      <section className="mt-8 space-y-4">
        {assessment.results.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <p className="text-muted-foreground">
              {t("noResults")}
            </p>
          </div>
        )}
        {assessment.results.map((r, i) => (
          <article
            key={r.conditionId}
            className="rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up sm:p-7"
            style={{ animationDelay: `${120 + i * 80}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary font-heading text-sm font-extrabold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <h2 className="text-xl font-bold text-foreground">
                    {language === "mm"
                      ? (CONDITIONS.find((item) => item.id === r.conditionId)?.title_mm ?? r.name)
                      : r.name}
                  </h2>
                </div>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold",
                    LEVEL_STYLES[r.level as MatchLevel] ?? LEVEL_STYLES.Low,
                  )}
                >
                  {t("match", { level: levelLabel(r.level) })}
                </span>
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-extrabold text-primary">{r.score}%</p>
                <p className="text-xs font-medium text-muted-foreground">{t("symptomMatch")}</p>
              </div>
            </div>

            <div
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={r.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("scoreAria", {
                name: language === "mm"
                  ? (CONDITIONS.find((item) => item.id === r.conditionId)?.title_mm ?? r.name)
                  : r.name,
                score: r.score,
              })}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${r.score}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {(() => {
                const condition = CONDITIONS.find((item) => item.id === r.conditionId);
                return language === "mm"
                  ? (condition?.description_mm ?? r.why)
                  : (condition?.description_en ?? r.why);
              })()}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.matchedSymptoms.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                >
                  {symptomLabel(id, language)}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Suggestions */}
      {localizedSuggestions.length > 0 && (
        <section
          className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up sm:p-8"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-2.5">
            <HeartPulse className="size-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-foreground">{t("whatYouCanDo")}</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {localizedSuggestions.map((s) => (
              <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Actions + disclaimer */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={handleSave} disabled={saved || saving}>
          <Save className="size-4" />
          {saving ? t("saving") : saved ? t("savedToHistory") : t("saveAssessment")}
        </Button>
        {saved && (
          <Button variant="outline" size="lg" onClick={() => navigate({ to: "/history" })}>
            {t("viewHistory")}
          </Button>
        )}
        <Button variant="ghost" size="lg" onClick={() => navigate({ to: "/health-check" })}>
          {t("newCheck")}
        </Button>
      </div>
      {saveError && (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {saveError}
        </p>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-muted/60 p-5">
        <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-xs leading-relaxed text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
