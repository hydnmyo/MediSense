import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { signUp } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — MediSense" },
      {
        name: "description",
        content:
          "Create a MediSense account to save your symptom assessments and track your history.",
      },
      { property: "og:title", content: "Sign Up — MediSense" },
      {
        property: "og:description",
        content:
          "Create a MediSense account to save your symptom assessments and track your history.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(t("passwordLength"));
      return;
    }
    setBusy(true);
    const result = await signUp(name.trim(), email.trim(), password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate({ to: "/health-check" });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-card animate-fade-up">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card">
          <Activity className="size-6" strokeWidth={2.5} />
        </span>
        <h1 className="mt-5 text-center text-2xl font-extrabold text-foreground">
          {t("createYourAccount")}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t("signupDescription")}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              {t("fullName")}
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-2 focus:outline-ring"
              placeholder="Aung Khant"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-2 focus:outline-ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-foreground">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-2 focus:outline-ring"
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            <UserPlus className="size-4" />
            {busy ? t("creatingAccount") : t("signUp")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")} {" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
