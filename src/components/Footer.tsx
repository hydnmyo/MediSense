import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="size-4" strokeWidth={2.5} />
              </span>
              <span className="font-heading text-lg font-extrabold text-foreground">
                Medi<span className="text-primary">Sense</span>
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{t("tagline")}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("disclaimer")}</p>
          </div>
          <nav aria-label={t("footer")}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("pages")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-foreground/80 hover:text-primary">{t("home")}</Link></li>
              <li><Link to="/about" className="text-foreground/80 hover:text-primary">{t("about")}</Link></li>
              <li><Link to="/health-check" className="text-foreground/80 hover:text-primary">{t("healthCheck")}</Link></li>
              <li><Link to="/history" className="text-foreground/80 hover:text-primary">{t("history")}</Link></li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-border/70 pt-5 text-xs text-muted-foreground">
          {t("courseProject")}
        </p>
      </div>
    </footer>
  );
}
