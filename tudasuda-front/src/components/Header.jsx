import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const WEATHER_CODES = {
  ru: {
    0: "Ясно",
    1: "Ясно",
    2: "Облачно",
    3: "Пасмурно",
    45: "Туман",
    48: "Туман",
    51: "Морось",
    53: "Морось",
    55: "Дождь",
    61: "Дождь",
    63: "Дождь",
    65: "Ливень",
    71: "Снег",
    73: "Снег",
    75: "Снег",
    80: "Ливень",
    81: "Ливень",
    82: "Ливень",
    95: "Гроза",
  },
  uz: {
    0: "Ochiq",
    1: "Ochiq",
    2: "Bulutli",
    3: "Bulutli",
    45: "Tuman",
    48: "Tuman",
    51: "Shabada yomg‘ir",
    53: "Shabada yomg‘ir",
    55: "Yomg‘ir",
    61: "Yomg‘ir",
    63: "Yomg‘ir",
    65: "Jala",
    71: "Qor",
    73: "Qor",
    75: "Qor",
    80: "Jala",
    81: "Jala",
    82: "Kuchli jala",
    95: "Momaqaldiroq",
  },
};

const UI_TEXT = {
  ru: {
    homeLabel: "ТудаСюда — на главную",
    categories: {
      cinema: "Кино",
      afisha: "Афиша",
      concerts: "Концерты",
      theater: "Театр",
      exhibitions: "Выставки",
      kids: "Детям",
      restaurants: "Рестораны",
      places: "Места",
    },
    socialsTitle: "Мы в соцсетях",
    socialsLabel: "Социальные сети",
    searchPlaceholder: "Поиск по сайту...",
    searchButton: "Поиск",
    searchToggle: "Открыть поиск",
    navLabel: "Основная навигация",
    langGroup: "Переключение языка",
    themeLabel: "Переключить тему",
    burgerLabel: "Открыть меню",
    weatherFallback: "Погода...",
    cityLabel: "Ташкент",
  },
  uz: {
    homeLabel: "TudaSuda — bosh sahifaga",
    categories: {
      cinema: "Kino",
      afisha: "Afisha",
      concerts: "Konsertlar",
      theater: "Teatr",
      exhibitions: "Ko‘rgazmalar",
      kids: "Bolalar",
      restaurants: "Restoranlar",
      places: "Joylar",
    },
    socialsTitle: "Biz ijtimoiy tarmoqlarda",
    socialsLabel: "Ijtimoiy tarmoqlar",
    searchPlaceholder: "Sayt bo‘ylab qidirish...",
    searchButton: "Qidirish",
    searchToggle: "Qidiruvni ochish",
    navLabel: "Asosiy navigatsiya",
    langGroup: "Tilni almashtirish",
    themeLabel: "Mavzuni almashtirish",
    burgerLabel: "Menyuni ochish",
    weatherFallback: "Ob-havo...",
    cityLabel: "Toshkent",
  },
};

const TASHKENT = {
  latitude: 41.3111,
  longitude: 69.2797,
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

function getWeatherEmoji(code) {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code === 51 || code === 53 || code === 55) return "🌦️";
  if (code === 61 || code === 63 || code === 65) return "🌧️";
  if (code === 71 || code === 73 || code === 75) return "❄️";
  if (code === 80 || code === 81 || code === 82) return "⛈️";
  if (code === 95) return "🌩️";
  return "🌤️";
}

function Header() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [weather, setWeather] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const burgerBtnRef = useRef(null);
  const navRef = useRef(null);

  const t = UI_TEXT[language] || UI_TEXT.ru;

  const categoryItems = useMemo(
    () => [
      { to: `/${language}/cinema`, emoji: "🎬", label: t.categories.cinema },
      { to: `/${language}/events`, emoji: "🎟️", label: t.categories.afisha },
      {
        to: `/${language}/events?filter=concert`,
        emoji: "🎤",
        label: t.categories.concerts,
      },
      {
        to: `/${language}/events?filter=theatre`,
        emoji: "🎭",
        label: t.categories.theater,
      },
      {
        to: `/${language}/events?filter=exhibition`,
        emoji: "🖼️",
        label: t.categories.exhibitions,
      },
      {
        to: `/${language}/events?filter=kids`,
        emoji: "🧸",
        label: t.categories.kids,
      },
      {
        to: `/${language}/restaurants`,
        emoji: "🍽️",
        label: t.categories.restaurants,
      },
      { to: `/${language}/places`, emoji: "📍", label: t.categories.places },
    ],
    [language, t]
  );

  const weatherText = useMemo(() => {
    if (!weather || weather.code == null) return "";
    return (WEATHER_CODES[language] || WEATHER_CODES.ru)[weather.code] || "";
  }, [weather, language]);

  const weatherEmoji = useMemo(() => {
    if (!weather || weather.code == null) return "🌤️";
    return getWeatherEmoji(weather.code);
  }, [weather]);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkTheme);
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${TASHKENT.latitude}&longitude=${TASHKENT.longitude}&current=temperature_2m,weather_code&timezone=Asia%2FTashkent`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temp: data.current?.temperature_2m,
          code: data.current?.weather_code,
        });
      })
      .catch(() => setWeather(null));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMenuOpen || window.innerWidth > 900) return;

      const clickedInsideNav = navRef.current?.contains(event.target);
      const clickedBurger = burgerBtnRef.current?.contains(event.target);

      if (!clickedInsideNav && !clickedBurger) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = searchValue.trim();
    if (!trimmedQuery) return;

    navigate(`/${language}/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleThemeChange = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const handleLangChange = (selectedLang) => {
    if (selectedLang === language) return;

    setLanguage(selectedLang);

    const segments = location.pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      navigate(`/${selectedLang}`);
      return;
    }

    if (segments[0] === "ru" || segments[0] === "uz") {
      segments[0] = selectedLang;
      navigate(`/${segments.join("/")}${location.search}`);
      return;
    }

    navigate(`/${selectedLang}${location.pathname}${location.search}`);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getSocialIcon = (item) => {
    return isDarkTheme ? item.darkIcon : item.lightIcon;
  };

  return (
    <header className="header">
      <div className="container header-shell">
        <div className="header-top-row">
          <div className="logo">
            <Link
              to={`/${language}`}
              aria-label={t.homeLabel}
              onClick={closeMenu}
            >
              <img
                src={isDarkTheme ? "/Logo-Dark.webp" : "/Logo-Light.webp"}
                alt="TudaSuda Logo"
              />
            </Link>
          </div>

          <div className="header-search-desktop">
            <form
              className="header-inline-search"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="search"
                className="header-inline-search-input"
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <button type="submit" className="header-inline-search-btn">
                {t.searchButton}
              </button>
            </form>
          </div>

          <div
            className="header-weather"
            aria-label={`${t.cityLabel}, ${weatherText || t.weatherFallback}`}
            title={weatherText || t.weatherFallback}
          >
            {weather ? (
              <>
                <span className="header-weather-emoji" aria-hidden="true">
                  {weatherEmoji}
                </span>
                <span className="header-weather-temp">
                  {Math.round(weather.temp)}°
                </span>
                <span className="header-weather-city">{t.cityLabel}</span>
              </>
            ) : (
              <span className="header-weather-loading">
                {t.weatherFallback}
              </span>
            )}
          </div>

          <div className="header-actions">
            <button
              className={`search-toggle ${isSearchOpen ? "active" : ""}`}
              type="button"
              aria-label={t.searchToggle}
              aria-expanded={isSearchOpen}
              aria-controls="mobileSearchBar"
              onClick={toggleSearch}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
              </svg>
            </button>

            <div className="socials" aria-label={t.socialsLabel}>
              {SOCIALS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="social"
                  aria-label={item.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={getSocialIcon(item)} alt={item.name} />
                </a>
              ))}
            </div>

            <div className="lang-switch" aria-label={t.langGroup} role="group">
              <button
                className={`lang-btn ${language === "ru" ? "active" : ""}`}
                type="button"
                aria-label="Русский"
                aria-pressed={language === "ru"}
                onClick={() => handleLangChange("ru")}
              >
                <span className="lang-btn-inner">
                  <span className="lang-flag-img">
                    <img src="/Icons/Flag_RU.webp" alt="RU" />
                  </span>
                  <span className="lang-text">RU</span>
                </span>
              </button>

              <button
                className={`lang-btn ${language === "uz" ? "active" : ""}`}
                type="button"
                aria-label="O‘zbekcha"
                aria-pressed={language === "uz"}
                onClick={() => handleLangChange("uz")}
              >
                <span className="lang-btn-inner">
                  <span className="lang-flag-img">
                    <img src="/Icons/Flag_UZ.webp" alt="UZ" />
                  </span>
                  <span className="lang-text">UZ</span>
                </span>
              </button>
            </div>

            <div className="theme-switch-wrapper">
              <button
                type="button"
                className={`theme-toggle-btn ${isDarkTheme ? "dark" : "light"}`}
                aria-label={t.themeLabel}
                onClick={handleThemeChange}
                title={t.themeLabel}
              >
                <span className="theme-toggle-icon" aria-hidden="true">
                  {isDarkTheme ? "🌙" : "☀️"}
                </span>
              </button>
            </div>

            <button
              ref={burgerBtnRef}
              className={`burger ${isMenuOpen ? "active" : ""}`}
              type="button"
              aria-label={t.burgerLabel}
              aria-expanded={isMenuOpen}
              aria-controls="categoryNav"
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div
          className={`header-mobile-search ${isSearchOpen ? "active" : ""}`}
          id="mobileSearchBar"
        >
          <form
            className="mobile-search-form-visible"
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <div className="mobile-search-row">
              <input
                type="search"
                className="mobile-search-input"
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <button type="submit" className="mobile-search-btn">
                {t.searchButton}
              </button>
            </div>
          </form>
        </div>

        <nav
          ref={navRef}
          className={`category-nav ${isMenuOpen ? "active" : ""}`}
          id="categoryNav"
          aria-label={t.navLabel}
        >
          <div className="category-nav-list">
            {categoryItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="category-chip"
                onClick={closeMenu}
              >
                <span className="category-chip-emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="category-chip-text">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mobile-socials-block" aria-label={t.socialsTitle}>
            <div className="mobile-socials-title">{t.socialsTitle}</div>

            <div className="mobile-socials-grid">
              {SOCIALS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="mobile-social-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <span className="mobile-social-card-icon">
                    <img src={getSocialIcon(item)} alt={item.name} />
                  </span>
                  <span className="mobile-social-card-text">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;