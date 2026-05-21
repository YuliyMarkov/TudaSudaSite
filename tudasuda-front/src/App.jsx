import { Suspense, lazy, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const ReelsModal = lazy(() => import("./components/ReelsModal"));

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

const AllCinemaPage = lazy(() => import("./pages/AllCinemaPage"));
const AllRestaurantsPage = lazy(() => import("./pages/AllRestaurantsPage"));
const AllPlacesPage = lazy(() => import("./pages/AllPlacesPage"));
const AllStoriesPage = lazy(() => import("./pages/AllStoriesPage"));
const StoryPage = lazy(() => import("./pages/StoryPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"));
const PlacePage = lazy(() => import("./pages/PlacePage"));
const EventPage = lazy(() => import("./pages/EventPage"));
const AllEventsPage = lazy(() => import("./pages/AllEventsPage"));
const MoviePage = lazy(() => import("./pages/MoviePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));

function PageLoader() {
  return <div className="page-loader" aria-label="Загрузка страницы" />;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  const open = (reel) => {
    if (!reel) return;
    setSelectedReel(reel);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedReel(null);
  };

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/ru" replace />} />

          <Route path="/:lang" element={<HomePage onOpenReel={open} />} />

          <Route path="/:lang/cinema" element={<AllCinemaPage />} />
          <Route path="/:lang/restaurants" element={<AllRestaurantsPage />} />
          <Route path="/:lang/restaurants/:slug" element={<RestaurantPage />} />

          <Route path="/:lang/places" element={<AllPlacesPage />} />
          <Route path="/:lang/places/:slug" element={<PlacePage />} />

          <Route path="/:lang/stories" element={<AllStoriesPage />} />
          <Route path="/:lang/stories/:slug" element={<StoryPage />} />
          <Route path="/:lang/movies/:slug" element={<MoviePage />} />

          <Route path="/:lang/events" element={<AllEventsPage />} />
          <Route path="/:lang/events/:slug" element={<EventPage />} />

          <Route path="/:lang/search" element={<SearchPage />} />

          <Route path="/:lang/about" element={<AboutPage />} />
          <Route path="/:lang/contacts" element={<ContactsPage />} />
          <Route path="/:lang/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {isOpen ? (
        <Suspense fallback={null}>
          <ReelsModal isOpen={isOpen} reel={selectedReel} onClose={close} />
        </Suspense>
      ) : null}
    </>
  );
}

export default App;