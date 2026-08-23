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
import {
  getCurrentAssessment,
  saveAssessment,
  type Assessment,
} from "@/lib/assessments";
import { DISCLAIMER, symptomLabel, type MatchLevel } from "@/lib/knowledge";
import { cn } from "@/lib/utils";

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
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAssessment(getCurrentAssessment());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <p className="text-center text-muted-foreground">Loading your results…</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <Stethoscope className="size-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">No assessment yet</h1>
        <p className="mt-3 text-muted-foreground">
          Start a health check first — your possible conditions will appear here.
        </p>
        <Link to="/health-check" className="mt-8 inline-block">
          <Button size="lg">Start a Health Check</Button>
        </Link>
      </div>
    );
  }

  const severe = assessment.input.severity === "Severe";

  const handleSave = () => {
    saveAssessment(assessment);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="animate-fade-up">
        <Link
          to="/health-check"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Edit my symptoms
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">
          Possible Conditions
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Based on {assessment.input.symptoms.length} reported symptom
          {assessment.input.symptoms.length === 1 ? "" : "s"} over{" "}
          {assessment.input.duration.toLowerCase()} ({assessment.input.severity.toLowerCase()}{" "}
          severity). Ranked by symptom-match score.
        </p>
      </header>

      {/* Warning signs — prominent for severe */}
      <section
        className={cn(
          "mt-8 rounded-3xl border p-6 animate-fade-up sm:p-7",
          severe
            ? "border-emergency/40 bg-emergency-soft"
            : "border-warning/30 bg-warning-soft",
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
                ? "You reported severe symptoms — please read this first"
                : "Seek medical care immediately if you experience"}
            </h2>
            {severe && (
              <p className="mt-1 text-sm font-medium text-emergency-foreground">
                Because your symptoms are severe, consider contacting a healthcare
                professional promptly rather than waiting.
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
                  {w}
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
              No condition in our prototype knowledge base matched these symptoms
              strongly enough. Try adding more symptoms, or consult a professional
              if you feel unwell.
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
                  <h2 className="text-xl font-bold text-foreground">{r.name}</h2>
                </div>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold",
                    LEVEL_STYLES[r.level as MatchLevel] ?? LEVEL_STYLES.Low,
                  )}
                >
                  {r.level} match
                </span>
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-extrabold text-primary">
                  {r.score}%
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  symptom match
                </p>
              </div>
            </div>

            <div
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={r.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${r.name} symptom-match score ${r.score} percent`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${r.score}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.why}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.matchedSymptoms.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                >
                  {symptomLabel(id)}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Suggestions */}
      {assessment.suggestions.length > 0 && (
        <section
          className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up sm:p-8"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-2.5">
            <HeartPulse className="size-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-foreground">What You Can Do</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {assessment.suggestions.map((s) => (
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
        <Button size="lg" onClick={handleSave} disabled={saved}>
          <Save className="size-4" />
          {saved ? "Saved to History" : "Save Assessment"}
        </Button>
        {saved && (
          <Button variant="outline" size="lg" onClick={() => navigate({ to: "/history" })}>
            View History
          </Button>
        )}
        <Button variant="ghost" size="lg" onClick={() => navigate({ to: "/health-check" })}>
          New Check
        </Button>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-muted/60 p-5">
        <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
