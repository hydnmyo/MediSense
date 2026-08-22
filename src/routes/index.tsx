import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ClipboardList,
  HeartPulse,
  Info,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/Button";
import { DISCLAIMER } from "@/lib/knowledge";
import heroImage from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediSense — Understand Your Symptoms. Get Informed." },
      {
        name: "description",
        content:
          "Enter your symptoms and explore possible health conditions with clear explanations and basic health guidance. An AI health reasoning assistant.",
      },
      { property: "og:title", content: "MediSense — Understand Your Symptoms. Get Informed." },
      {
        property: "og:description",
        content:
          "Enter your symptoms and explore possible health conditions with clear explanations and basic health guidance.",
      },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Symptom Analysis",
    text: "Enter the symptoms you are currently experiencing.",
  },
  {
    icon: Stethoscope,
    title: "Possible Conditions",
    text: "Explore health conditions that may match your symptoms.",
  },
  {
    icon: HeartPulse,
    title: "Health Guidance",
    text: "Receive basic suggestions and warning signs to consider.",
  },
];

const STEPS = [
  { n: "01", label: "Enter Symptoms" },
  { n: "02", label: "Analyze" },
  { n: "03", label: "See Possible Conditions" },
  { n: "04", label: "Get Suggestions" },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <HeartPulse className="size-3.5" />
            AI Health Reasoning Assistant
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Understand Your Symptoms.{" "}
            <span className="text-primary">Get Informed.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Enter your symptoms and explore possible health conditions with clear
            explanations and basic health guidance.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/health-check">
              <Button size="lg">
                Check My Symptoms
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="overflow-hidden rounded-4xl border border-border bg-secondary shadow-card">
            <img
              src={heroImage}
              alt="Abstract illustration of a medical cross connected to AI network nodes"
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/70 bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            What MediSense Helps You Do
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <article
                key={f.title}
                className="rounded-3xl border border-border bg-background p-7 shadow-card transition-shadow hover:shadow-card-hover animate-fade-up"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <f.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          How It Works
        </h2>
        <ol className="mx-auto mt-10 flex max-w-4xl flex-col items-stretch gap-2 sm:flex-row sm:items-start sm:gap-0">
          {STEPS.map((step, i) => (
            <li key={step.n} className="flex flex-1 flex-col items-center sm:flex-row">
              <div className="flex flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary font-heading text-lg font-extrabold text-primary-foreground shadow-card">
                  {step.n}
                </span>
                <p className="mt-3 max-w-36 text-sm font-semibold text-foreground">{step.label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <>
                  <ArrowDown className="my-1 size-5 text-primary/50 sm:hidden" aria-hidden />
                  <ArrowRight
                    className="mx-3 mt-4 hidden size-5 shrink-0 text-primary/50 sm:block"
                    aria-hidden
                  />
                </>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link to="/health-check">
            <Button size="lg">
              Start a Health Check
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-warning-foreground" aria-hidden />
          <p className="text-sm leading-relaxed text-warning-foreground">{DISCLAIMER}</p>
        </div>
      </section>
    </div>
  );
}
