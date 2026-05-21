import { lazy, Suspense, useEffect, useRef, useState } from "react";
import FeaturedEvents from "../components/FeaturedEvents";
import YandexAdBlock from "../components/YandexAdBlock";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import UpcomingCalendar from "../components/UpcomingCalendar";
import CinemaSection from "../components/CinemaSection";

const TheatreSection = lazy(() => import("../components/TheatreSection"));
const ReelsSection = lazy(() => import("../components/ReelsSection"));
const PlacesSection = lazy(() => import("../components/PlacesSection"));
const TudaStories = lazy(() => import("../components/TudaStories"));

function HomeSectionLoader() {
  return <div className="home-section-loader" aria-hidden="true" />;
}

function LazyHomeBlock({ children, minHeight = 320 }) {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "500px 0px",
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref} style={{ minHeight: shouldRender ? undefined : minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
}

function HomePage({ onOpenReel }) {
  const { language } = useLanguage();

  const seoContent = {
    ru: {
      title: "ТудаСюда — афиша Ташкента: концерты, кино, места и события",
      description:
        "ТудаСюда — афиша Ташкента и Узбекистана. Концерты, кино, рестораны, интересные места, развлечения и главные события города.",
    },
    uz: {
      title:
        "TudaSuda — Toshkent afishasi: konsertlar, kino, joylar va tadbirlar",
      description:
        "TudaSuda — Toshkent va O‘zbekiston afishasi. Konsertlar, kino, restoranlar, qiziqarli joylar va tadbirlar.",
    },
  };

  const t = seoContent[language] || seoContent.ru;
  const canonical = `https://tudasuda.uz/${language}`;

  return (
    <main className="main">
      <Seo title={t.title} description={t.description} canonical={canonical} />

      <div className="container">
        <FeaturedEvents />

        <UpcomingCalendar />

        <LazyHomeBlock minHeight={120}>
          <YandexAdBlock />
        </LazyHomeBlock>

        <CinemaSection />

        <LazyHomeBlock minHeight={360}>
          <Suspense fallback={<HomeSectionLoader />}>
            <TheatreSection />
          </Suspense>
        </LazyHomeBlock>

        <LazyHomeBlock minHeight={120}>
          <YandexAdBlock />
        </LazyHomeBlock>

        <LazyHomeBlock minHeight={420}>
          <Suspense fallback={<HomeSectionLoader />}>
            <ReelsSection onOpenReel={onOpenReel} />
          </Suspense>
        </LazyHomeBlock>

        <LazyHomeBlock minHeight={360}>
          <Suspense fallback={<HomeSectionLoader />}>
            <PlacesSection />
          </Suspense>
        </LazyHomeBlock>

        <LazyHomeBlock minHeight={120}>
          <YandexAdBlock />
        </LazyHomeBlock>

        <LazyHomeBlock minHeight={360}>
          <Suspense fallback={<HomeSectionLoader />}>
            <TudaStories />
          </Suspense>
        </LazyHomeBlock>
      </div>
    </main>
  );
}

export default HomePage;