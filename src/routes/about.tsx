import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, ClipboardCheck, ListChecks } from "lucide-react";
import { Button } from "@/components/Button";
import { CONDITIONS, DISCLAIMER } from "@/lib/knowledge";

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

const DOES = [
  "Analyzes the symptoms you report",
  "Identifies possible health conditions",
  "Provides symptom-match scores for each result",
  "Gives basic health suggestions and warning signs",
];

function AboutPage() {
  const common = CONDITIONS.filter((c) => c.group === "Common");
  const rainy = CONDITIONS.filter((c) => c.group === "Rainy-season relevant");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
          <BrainCircuit className="size-3.5" />
          AI Health Reasoning Assistant
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
          About MediSense
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          MediSense is an AI health reasoning assistant created as an undergraduate
          Artificial Intelligence project. It analyzes user-provided symptoms and
          identifies possible health conditions using a structured knowledge base.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ClipboardCheck className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">What MediSense Does</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {DOES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <BrainCircuit className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">AI Approach</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            MediSense uses structured facts and rules to represent relationships between
            symptoms and health conditions. The logical reasoning component is separately
            tested using SWI-Prolog as part of the AI coursework.
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ListChecks className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">Health Conditions</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This prototype covers a limited, controlled set of conditions rather than
            every disease.
          </p>
        </article>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-bold text-foreground">Conditions in the Prototype</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Common conditions
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {common.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full bg-muted px-3.5 py-1.5 text-sm font-medium text-foreground"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rainy-season relevant
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rainy.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-secondary p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-lg font-bold text-secondary-foreground">Ready to try it?</h2>
          <p className="mt-1 text-sm text-secondary-foreground/80">
            Run a quick symptom check and see how the reasoning works.
          </p>
        </div>
        <Link to="/health-check">
          <Button>
            Check My Symptoms
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}
