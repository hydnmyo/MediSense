import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type TranslationKey } from "./translations";

export type Language = "en" | "mm";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() =>
    typeof window !== "undefined" && localStorage.getItem("medisense:language") === "mm"
      ? "mm"
      : "en",
  );

  useEffect(() => {
    document.documentElement.lang = language === "mm" ? "my" : "en";
    localStorage.setItem("medisense:language", language);
  }, [language]);

  const t = (key: TranslationKey, values?: Record<string, string | number>) =>
    translate(language, key, values);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}
