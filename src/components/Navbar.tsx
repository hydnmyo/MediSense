import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { logOut, useUser } from "@/lib/auth";
import { Button } from "@/components/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";

const NAV_LINKS = [
  { to: "/", label: "home" },
  { to: "/about", label: "about" },
  { to: "/health-check", label: "healthCheck" },
  { to: "/history", label: "history" },
] as const;

export function Navbar() {
  const user = useUser();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  const handleLogout = async () => {
    await logOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`MediSense ${t("home")}`}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <Activity className="size-5" strokeWidth={2.5} />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
            Medi<span className="text-primary">Sense</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === link.to && "bg-secondary font-semibold text-secondary-foreground",
              )}
            >
              {t(link.label)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          {user ? (
            <>
              <span className="mr-1 flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name.split(" ")[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
                {t("logOut")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/login" })}>
                {t("logIn")}
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/signup" })}>
                {t("signUp")}
              </Button>
            </>
          )}
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-muted md:hidden cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/70 bg-background px-4 pb-5 pt-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted",
                  pathname === link.to && "bg-secondary font-semibold text-secondary-foreground",
                )}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-border/70 pt-3">
            <LanguageSwitcher className="shrink-0" />
            <ThemeToggle theme={theme} onToggle={toggleTheme} className="shrink-0" />
            {user ? (
              <>
                <span className="flex-1 text-sm font-semibold text-foreground">{user.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="size-4" />
                {t("logOut")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate({ to: "/login" })}
                >
                  {t("logIn")}
                </Button>
                <Button size="sm" className="flex-1" onClick={() => navigate({ to: "/signup" })}>
                  {t("signUp")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({
  theme,
  onToggle,
  className,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}) {
  const isDark = theme === "dark";
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer",
        className,
      )}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("switchToLight") : t("switchToDark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
