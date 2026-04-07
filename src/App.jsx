import { useState } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ReelsModal from "./components/ReelsModal";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AllNewsPage from "./pages/AllNewsPage"
import AllPlacesPage from "./pages/AllPlacesPage";
import AllCinemaPage from "./pages/AllCinemaPage";
import AllTheatrePage from "./pages/AllTheatrePage";
import MoviePage from "./pages/MoviePage";

function CategoryPageWrapper() {
  const { slug } = useParams();
  return <CategoryPage key={slug} />;
}

function NewsPageWrapper() {
  const { slug } = useParams();
  return <NewsPage key={slug} />;
}

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
      <Header />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Navigate to="/ru" replace />} />

        <Route path="/:lang" element={<HomePage onOpenReel={open} />} />
        <Route path="/:lang/category/:slug" element={<CategoryPageWrapper />} />
        <Route path="/:lang/news/:slug" element={<NewsPageWrapper />} />

        <Route path="/:lang/about" element={<AboutPage />} />
        <Route path="/:lang/contacts" element={<ContactsPage />} />
        <Route path="/:lang/privacy" element={<PrivacyPage />} />
        <Route path="/:language/news" element={<AllNewsPage />} />
        <Route path="/:language/places" element={<AllPlacesPage />} />
        <Route path="/:language/cinema" element={<AllCinemaPage />} />
        <Route path="/:language/theatre" element={<AllTheatrePage />} />
        <Route path="/:language/movies/:slug" element={<MoviePage />} />
      </Routes>

      <Footer />

      <ReelsModal isOpen={isOpen} videoUrl={videoUrl} onClose={close} />
    </>
  );
}

export default App;