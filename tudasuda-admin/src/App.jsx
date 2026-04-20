import { Navigate, Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import StoriesPage from "./pages/StoriesPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import EditStoryPage from "./pages/EditStoryPage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import LoginPage from "./pages/LoginPage";
import { clearStoredToken, getStoredToken } from "./api/auth";

function DashboardPage() {
  return (
    <div className="admin-page">
      <h1>Админка TudaSuda</h1>
      <p>Добро пожаловать. Разделы материалов и событий подключены.</p>
    </div>
  );
}

function MoviesPage() {
  return (
    <div className="admin-page">
      <h1>Фильмы</h1>
      <p>Этот раздел подключим следующим этапом.</p>
    </div>
  );
}

function PlacesPage() {
  return (
    <div className="admin-page">
      <h1>Места</h1>
      <p>Этот раздел подключим следующим этапом.</p>
    </div>
  );
}

function RestaurantsPage() {
  return (
    <div className="admin-page">
      <h1>Рестораны</h1>
      <p>Этот раздел подключим следующим этапом.</p>
    </div>
  );
}

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
            const isActive = location.pathname === item.to;

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

          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/create" element={<CreateStoryPage />} />
          <Route path="/stories/:id/edit" element={<EditStoryPage />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />

          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />

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
          isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;