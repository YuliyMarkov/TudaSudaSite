import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function Footer() {
  const { language } = useLanguage();

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkTheme(document.body.classList.contains("dark-theme"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const uiText = {
    ru: {
      copyright: "© 2026 ТудаСюда. Все права защищены.",
      navLabel: "Навигация в подвале",
      about: "О нас",
      privacy: "Политика конфиденциальности",
      contacts: "Контакты",
    },
    uz: {
      copyright: "© 2026 TudaSuda. Barcha huquqlar himoyalangan.",
      navLabel: "Footer navigatsiyasi",
      about: "Biz haqimizda",
      privacy: "Maxfiylik siyosati",
      contacts: "Kontaktlar",
    },
  };

  const t = uiText[language] || uiText.ru;

  return (
    <footer className="footer">
      <div className="container footer-container">
        <p>{t.copyright}</p>

        <nav className="footer-nav" aria-label={t.navLabel}>
          <Link to={`/${language}/about`}>{t.about}</Link>
          <Link to={`/${language}/privacy`}>{t.privacy}</Link>
          <Link to={`/${language}/contacts`}>{t.contacts}</Link>
        </nav>

        <div className="footer-socials">
          <a
            href="https://t.me/+zBdfoNGygiw3MzYy"
            className="footer-social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <img
              src={
                isDarkTheme
                  ? "/Icons/TG_Logo_Dark.svg"
                  : "/Icons/TG_Logo_Light.svg"
              }
              alt="Telegram"
            />
          </a>

          <a
            href="https://www.instagram.com/tudasudauz/"
            className="footer-social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src={
                isDarkTheme
                  ? "/Icons/IG_Logo_Dark.svg"
                  : "/Icons/IG_Logo_Light.svg"
              }
              alt="Instagram"
            />
          </a>

          <a
            href="https://www.youtube.com/@tudasudauz"
            className="footer-social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <img
              src={
                isDarkTheme
                  ? "/Icons/YT_Logo_Dark.webp"
                  : "/Icons/YT_Logo_Light.webp"
              }
              alt="YouTube"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;