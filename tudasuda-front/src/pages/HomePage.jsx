import FeaturedEvents from "../components/FeaturedEvents";
import ReelsSection from "../components/ReelsSection";
import TudaStories from "../components/TudaStories";
import AdBlock from "../components/AdBlock";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import UpcomingCalendar from "../components/UpcomingCalendar";
import CinemaSection from "../components/CinemaSection";
import TheatreSection from "../components/TheatreSection";
import PlacesSection from "../components/PlacesSection";

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

        <AdBlock />

        <CinemaSection />
        <TheatreSection />

        <AdBlock />

        <ReelsSection onOpenReel={onOpenReel} />

        <PlacesSection />

        <AdBlock />

        <TudaStories />
      </div>
    </main>
  );
}

export default HomePage;