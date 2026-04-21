import {
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";

import StoriesPage from "./pages/StoriesPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import EditStoryPage from "./pages/EditStoryPage";

import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";

import MoviesPage from "./pages/MoviesPage";
import CreateMoviePage from "./pages/CreateMoviePage";
import EditMoviePage from "./pages/EditMoviePage";

import PlacesPage from "./pages/PlacesPage";
import CreatePlacePage from "./pages/CreatePlacePage";
import EditPlacePage from "./pages/EditPlacePage";

import RestaurantsPage from "./pages/RestaurantsPage";
import CreateRestaurantPage from "./pages/CreateRestaurantPage";
import EditRestaurantPage from "./pages/EditRestaurantPage";

import HeroSlidesPage from "./pages/HeroSlidesPage";
import CreateHeroSlidePage from "./pages/CreateHeroSlidePage";
import EditHeroSlidePage from "./pages/EditHeroSlidePage";

import ReelsPage from "./pages/ReelsPage";
import CreateReelPage from "./pages/CreateReelPage";
import EditReelPage from "./pages/EditReelPage";

import LoginPage from "./pages/LoginPage";

import { clearStoredToken, getStoredToken } from "./api/auth";

function NotFoundPage() {
  return (
    <div className="admin-page">
      <h1>404</h1>
      <p>Страница не найдена.</p>
    </div>
  );
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", label: "Главная" },
    { to: "/hero-slides", label: "Слайдер главной" },
    { to: "/reels", label: "Рилсы" },
    { to: "/stories", label: "Материалы" },
    { to: "/events", label: "События" },
    { to: "/movies", label: "Фильмы" },
    { to: "/places", label: "Места" },
    { to: "/restaurants", label: "Рестораны" },
  ];

  function handleLogout() {
    clearStoredToken();
    navigate("/login", { replace: true });
    window.location.reload();
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-sidebar-brand">TudaSuda Admin</div>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* HERO SLIDES */}
          <Route path="/hero-slides" element={<HeroSlidesPage />} />
          <Route
            path="/hero-slides/create"
            element={<CreateHeroSlidePage />}
          />
          <Route
            path="/hero-slides/:id/edit"
            element={<EditHeroSlidePage />}
          />

          {/* REELS */}
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/reels/create" element={<CreateReelPage />} />
          <Route path="/reels/:id/edit" element={<EditReelPage />} />

          {/* STORIES */}
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/create" element={<CreateStoryPage />} />
          <Route path="/stories/:id/edit" element={<EditStoryPage />} />

          {/* EVENTS */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />

          {/* MOVIES */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/create" element={<CreateMoviePage />} />
          <Route path="/movies/:id/edit" element={<EditMoviePage />} />

          {/* PLACES */}
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/create" element={<CreatePlacePage />} />
          <Route path="/places/:id/edit" element={<EditPlacePage />} />

          {/* RESTAURANTS */}
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route
            path="/restaurants/create"
            element={<CreateRestaurantPage />}
          />
          <Route
            path="/restaurants/:id/edit"
            element={<EditRestaurantPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const isAuthenticated = Boolean(getStoredToken());

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AdminLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;