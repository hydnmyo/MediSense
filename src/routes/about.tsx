import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, ClipboardCheck, ListChecks } from "lucide-react";
import { Button } from "@/components/Button";
import { CONDITIONS, CONDITION_TRANSLATIONS } from "@/lib/knowledge";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MediSense — AI Health Reasoning Assistant" },
      {
        name: "description",
        content:
          "MediSense is an AI health reasoning assistant created as an undergraduate Artificial Intelligence project, analyzing symptoms against a structured knowledge base.",
      },
      { property: "og:title", content: "About MediSense — AI Health Reasoning Assistant" },
      {
        property: "og:description",
        content:
          "MediSense analyzes user-provided symptoms and identifies possible health conditions using a structured knowledge base.",
      },
    ],
  }),
  component: AboutPage,
});

const DOES = ["analyzesSymptoms", "identifiesConditions", "providesScores", "givesGuidance"] as const;

function AboutPage() {
  const { language, t } = useLanguage();
  const common = CONDITIONS.filter((c) => c.group === "Common");
  const rainy = CONDITIONS.filter((c) => c.group === "Rainy-season relevant");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
          <BrainCircuit className="size-3.5" />
          {t("aiAssistant")}
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
          {t("aboutTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t("aboutDescription")}
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ClipboardCheck className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">{t("whatMediSenseDoes")}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {DOES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {t(item)}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <BrainCircuit className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">{t("aiApproach")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("aiApproachText")}
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ListChecks className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">{t("conditions")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("conditionsText")}
          </p>
        </article>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-bold text-foreground">{t("conditionsInMediSense")}</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("commonConditions")}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {common.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full bg-muted px-3.5 py-1.5 text-sm font-medium text-foreground"
                >
                  {language === "mm" ? (CONDITION_TRANSLATIONS[c.id] ?? c.name) : c.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("rainyRelevant")}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rainy.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground"
                >
                  {language === "mm" ? (CONDITION_TRANSLATIONS[c.id] ?? c.name) : c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-secondary p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-lg font-bold text-secondary-foreground">{t("readyToTry")}</h2>
          <p className="mt-1 text-sm text-secondary-foreground/80">
            {t("readyToTryText")}
          </p>
        </div>
        <Link to="/health-check">
          <Button>
            {t("checkMySymptoms")}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{t("disclaimer")}</p>
    </div>
  );
}
