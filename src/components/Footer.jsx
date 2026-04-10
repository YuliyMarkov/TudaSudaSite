import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const UI_TEXT = {
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

const SOCIALS = [
  {
    name: "Telegram",
    href: "https://t.me/+zBdfoNGygiw3MzYy",
    lightIcon: "/Icons/TG_Logo_Light.svg",
    darkIcon: "/Icons/TG_Logo_Dark.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/tudasudauz/",
    lightIcon: "/Icons/IG_Logo_Light.svg",
    darkIcon: "/Icons/IG_Logo_Dark.svg",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@tudasudauz",
    lightIcon: "/Icons/YT_Logo_Light.webp",
    darkIcon: "/Icons/YT_Logo_Dark.webp",
  },
];

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

  const t = UI_TEXT[language] || UI_TEXT.ru;

  const getSocialIcon = (item) => {
    return isDarkTheme ? item.darkIcon : item.lightIcon;
  };

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
          {SOCIALS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="footer-social"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
            >
              <img src={getSocialIcon(item)} alt={item.name} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;