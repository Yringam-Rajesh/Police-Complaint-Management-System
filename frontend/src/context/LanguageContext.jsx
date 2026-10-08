import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import en from "../locales/en.js";
import te from "../locales/te.js";
import hi from "../locales/hi.js";
import api from "../api.js";

const dictionaries = { English: en, Telugu: te, Hindi: hi };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState(() => localStorage.getItem("janraksha_language") || "English");

  useEffect(() => {
    if (user?.preferredLanguage && !localStorage.getItem("janraksha_language")) setLanguageState(user.preferredLanguage);
  }, [user]);

  const setLanguage = async value => {
    setLanguageState(value);
    localStorage.setItem("janraksha_language", value);
    if (user) {
      try { await api.patch("/auth/language", { language: value }); } catch { /* UI preference still works locally */ }
    }
  };

  const dictionary = dictionaries[language] || en;
  const t = (path, fallback) => path.split(".").reduce((obj, key) => obj?.[key], dictionary) ?? fallback ?? path;
  const value = useMemo(() => ({ language, setLanguage, t }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
