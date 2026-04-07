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
import AllConcertsPage from "./pages/AllConcertsPage";
import AllTheatrePage from "./pages/AllTheatrePage";
import AllExhibitionsPage from "./pages/AllExhibitionsPage";
import AllKidsPage from "./pages/AllKidsPage";
import AllRestaurantsPage from "./pages/AllRestaurantsPage";
import AllPlacesPage from "./pages/AllPlacesPage";
import AllStoriesPage from "./pages/AllStoriesPage";

import MoviePage from "./pages/MoviePage";

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

        <Route path="/:lang/cinema" element={<AllCinemaPage />} />
        <Route path="/:lang/concerts" element={<AllConcertsPage />} />
        <Route path="/:lang/theatre" element={<AllTheatrePage />} />
        <Route path="/:lang/exhibitions" element={<AllExhibitionsPage />} />
        <Route path="/:lang/kids" element={<AllKidsPage />} />
        <Route path="/:lang/restaurants" element={<AllRestaurantsPage />} />
        <Route path="/:lang/places" element={<AllPlacesPage />} />
        <Route path="/:lang/stories" element={<AllStoriesPage />} />

        <Route path="/:lang/movies/:slug" element={<MoviePage />} />

        <Route path="/:lang/about" element={<AboutPage />} />
        <Route path="/:lang/contacts" element={<ContactsPage />} />
        <Route path="/:lang/privacy" element={<PrivacyPage />} />

        <Route path="*" element={<Navigate to="/ru" replace />} />
      </Routes>

      <Footer />

      <ReelsModal isOpen={isOpen} videoUrl={videoUrl} onClose={close} />
    </>
  );
}

export default App;