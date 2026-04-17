import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "./languageContext";

export function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getLanguageFromPath = (pathname) => {
    const firstSegment = pathname.split("/")[1];

    if (firstSegment === "ru" || firstSegment === "uz") {
      return firstSegment;
    }

    return null;
  };

  const [storedLanguage, setStoredLanguage] = useState(() => {
    return localStorage.getItem("site-language") || "ru";
  });

  const pathLanguage = getLanguageFromPath(location.pathname);
  const language = pathLanguage || storedLanguage;

  // 🔥 ВАЖНО: редирект, если язык отсутствует или некорректный
  useEffect(() => {
    const firstSegment = location.pathname.split("/")[1];

    if (!firstSegment || (firstSegment !== "ru" && firstSegment !== "uz")) {
      navigate(`/ru`, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    localStorage.setItem("site-language", language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: setStoredLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}