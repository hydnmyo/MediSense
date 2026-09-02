import { useLanguage, type Language } from "@/lib/language";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "mm", label: "MM" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border bg-card p-1 shadow-card",
        className,
      )}
      role="group"
      aria-label={t("languageSelection")}
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const active = language === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
