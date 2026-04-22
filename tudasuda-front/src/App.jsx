import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ReelsModal from "./components/ReelsModal";
import ScrollToTop from "./components/ScrollToTop";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import PrivacyPage from "./pages/PrivacyPage";

import AllCinemaPage from "./pages/AllCinemaPage";
import AllRestaurantsPage from "./pages/AllRestaurantsPage";
import AllPlacesPage from "./pages/AllPlacesPage";
import AllStoriesPage from "./pages/AllStoriesPage";
import StoryPage from "./pages/StoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import RestaurantPage from "./pages/RestaurantPage";
import PlacePage from "./pages/PlacePage";
import EventPage from "./pages/EventPage";
import AllEventsPage from "./pages/AllEventsPage";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const open = (url) => {
    setVideoUrl(url);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setVideoUrl("");
  };

  return (
    <>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/ru" replace />} />

        <Route path="/:lang" element={<HomePage onOpenReel={open} />} />

        <Route path="/:lang/search" element={<SearchPage />} />

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

        <Route path="/:lang/about" element={<AboutPage />} />
        <Route path="/:lang/contacts" element={<ContactsPage />} />
        <Route path="/:lang/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />

      <ReelsModal isOpen={isOpen} videoUrl={videoUrl} onClose={close} />
    </>
  );
}

export default App;