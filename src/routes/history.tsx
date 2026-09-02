import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Eye, FileSearch, History as HistoryIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { listAssessments, type Assessment } from "@/lib/assessments";
import { useAuth } from "@/lib/auth";
import { CONDITION_TRANSLATIONS, symptomLabel } from "@/lib/knowledge";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Assessment History — MediSense" },
      {
        name: "description",
        content:
          "Review your past MediSense symptom assessments, possible conditions, and symptom-match scores.",
      },
      { property: "og:title", content: "Assessment History — MediSense" },
      {
        property: "og:description",
        content:
          "Review your past MediSense symptom assessments, possible conditions, and symptom-match scores.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const [items, setItems] = useState<Assessment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState<Assessment | null>(null);
  const formatHistoryDate = (date: string) =>
    new Intl.DateTimeFormat(language === "mm" ? "my-MM" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  const conditionTitle = (id: string, fallback: string) =>
    language === "mm" ? (CONDITION_TRANSLATIONS[id] ?? fallback) : fallback;
  const optionLabel = (value: string) => {
    if (language === "en") return value;
    return {
      "Less than 1 day": "၁ ရက်အောက်",
      "1–3 days": "၁–၃ ရက်",
      "4–7 days": "၄–၇ ရက်",
      "More than 7 days": "၇ ရက်အထက်",
      Mild: "အနည်းငယ်",
      Moderate: "အသင့်အတင့်",
      Severe: "ပြင်းထန်",
      Yes: "ဟုတ်ပါသည်",
      No: "မဟုတ်ပါ",
      "Not sure": "မသေချာပါ",
    }[value] ?? value;
  };
  const levelLabel = (level: string) =>
    t(level === "High" ? "levelHigh" : level === "Moderate" ? "levelModerate" : "levelLow");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      setError("");
      setLoaded(true);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoaded(false);
      setError("");
      try {
        const assessments = await listAssessments();
        if (!cancelled) setItems(assessments);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load assessments.");
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    void load();

    const channel = supabase
      .channel(`assessment-history:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "assessments",
          filter: `user_id=eq.${user.id}`,
        },
        () => void load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [authLoading, user]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <HistoryIcon className="size-3.5" />
            {t("history")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("assessmentHistory")}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {t("savedChecks")}
          </p>
        </div>
        <Link to="/health-check">
          <Button>
            <Plus className="size-4" />
            {t("newCheck")}
          </Button>
        </Link>
      </header>

      {authLoading || !loaded ? (
        <p className="mt-12 text-center text-muted-foreground">{t("loading")}</p>
      ) : !user ? (
        <div className="mt-12 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <HistoryIcon className="size-7" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-foreground">
            {t("loginToSee")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("historyConnected")}
          </p>
          <Link to="/login" className="mt-6 inline-block">
            <Button>{t("logIn")}</Button>
          </Link>
        </div>
      ) : error ? (
        <div className="mt-12 rounded-3xl border border-destructive/30 bg-card p-10 text-center shadow-card">
          <h2 className="text-lg font-bold text-foreground">{t("unableToLoad")}</h2>
          <p role="alert" className="mt-2 text-sm font-medium text-destructive">
            {error}
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            {t("tryAgain")}
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <FileSearch className="size-7" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-foreground">{t("noHealthChecksYet")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noHealthChecksDescription")}
          </p>
          <Link to="/health-check" className="mt-6 inline-block">
            <Button>
              <Plus className="size-4" />
              {t("newCheck")}
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {items.map((a, i) => {
            const top = a.results[0];
            return (
              <li
                key={a.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CalendarDays className="size-4" aria-hidden />
                      {formatHistoryDate(a.date)}
                    </p>
                    <h2 className="mt-2 text-lg font-bold text-foreground">
                      {top ? conditionTitle(top.conditionId, top.name) : t("noMatchingCondition")}
                      {top && (
                        <span className="ml-2 font-heading text-base font-extrabold text-primary">
                          {top.score}%
                        </span>
                      )}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {a.input.symptoms.slice(0, 5).map((id) => (
                        <span
                          key={id}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {symptomLabel(id, language)}
                        </span>
                      ))}
                      {a.input.symptoms.length > 5 && (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          {t("more", { count: a.input.symptoms.length - 5 })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActive(a)}>
                    <Eye className="size-4" />
                    {t("view")}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={active !== null}
        onOpenChange={(open) => !open && setActive(null)}
        title={active ? `${t("assessmentResult")} — ${formatHistoryDate(active.date)}` : ""}
      >
        {active && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("reportedSymptoms")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {active.input.symptoms.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {symptomLabel(id, language)}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("duration")}: {optionLabel(active.input.duration)} · {t("severity")}: {optionLabel(active.input.severity)} · {t("rainySeason")}: {optionLabel(active.input.rainySeason)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("possibleConditionsLabel")}
              </p>
              <ul className="mt-3 space-y-3">
                {active.results.map((r) => (
                  <li
                    key={r.conditionId}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{conditionTitle(r.conditionId, r.name)}</p>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          r.level === "High"
                            ? "bg-emergency-soft text-emergency-foreground"
                            : r.level === "Moderate"
                              ? "bg-warning-soft text-warning-foreground"
                              : "bg-secondary text-secondary-foreground",
                        )}
                      >
                        {r.score}% · {levelLabel(r.level)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
