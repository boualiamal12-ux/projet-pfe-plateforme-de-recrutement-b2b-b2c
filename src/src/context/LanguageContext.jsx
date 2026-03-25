import React, { createContext, useContext, useState, useEffect } from "react";
import { detectBrowserLang, LANGUAGES, t as translate } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("recruitpro_lang");
    if (saved && LANGUAGES.find((l) => l.code === saved)) return saved;
    return detectBrowserLang();
  });

  useEffect(() => {
    const currentLang = LANGUAGES.find((l) => l.code === lang);
    document.documentElement.dir = currentLang?.dir || "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem("recruitpro_lang", code);
  };

  const t = (keyPath) => translate(keyPath, lang);

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}