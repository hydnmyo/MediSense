import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Eye, History as HistoryIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import {
  formatDate,
  listAssessments,
  type Assessment,
} from "@/lib/assessments";
import { useAuth } from "@/lib/auth";
import { symptomLabel } from "@/lib/knowledge";
import { cn } from "@/lib/utils";

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
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Assessment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState<Assessment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setItems([]);
      setLoaded(true);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    listAssessments()
      .then((rows) => {
        if (!cancelled) setItems(rows);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load history.");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <HistoryIcon className="size-3.5" />
            History
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
            Assessment History
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Your saved health checks, stored privately in this browser.
          </p>
        </div>
        <Link to="/health-check">
          <Button>
            <Plus className="size-4" />
            New Check
          </Button>
        </Link>
      </header>

      {!loaded ? (
        <p className="mt-12 text-center text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <HistoryIcon className="size-7" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-foreground">No assessments yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Run a health check and save it to build your history.
          </p>
          <Link to="/health-check" className="mt-6 inline-block">
            <Button>Start a Health Check</Button>
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
                      {formatDate(a.date)}
                      {a.demo && (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          Demo
                        </span>
                      )}
                    </p>
                    <h2 className="mt-2 text-lg font-bold text-foreground">
                      {top ? top.name : "No matching condition"}
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
                          {symptomLabel(id)}
                        </span>
                      ))}
                      {a.input.symptoms.length > 5 && (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          +{a.input.symptoms.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActive(a)}>
                    <Eye className="size-4" />
                    View
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
        title={active ? `Assessment — ${formatDate(active.date)}` : ""}
      >
        {active && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reported symptoms
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {active.input.symptoms.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {symptomLabel(id)}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Duration: {active.input.duration} · Severity: {active.input.severity} ·
                Rainy season: {active.input.rainySeason}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Possible conditions
              </p>
              <ul className="mt-3 space-y-3">
                {active.results.map((r) => (
                  <li
                    key={r.conditionId}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{r.name}</p>
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
                        {r.score}% · {r.level}
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
