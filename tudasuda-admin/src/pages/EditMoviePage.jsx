import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminMovies, updateMovieById } from "../api/movies";
import MovieEditor from "../components/MovieEditor";

function buildEmptyForm() {
  return {
    id: null,
    slug: "",
    status: "draft",
    isFeatured: false,
    posterImage: "",
    coverImage: "",
    trailerUrl: "",
    buyTicketsUrl: "",
    releaseDate: "",
    durationMinutes: "",
    ageRating: "",
    imdbRating: "",
    kpRating: "",
    translations: {
      ru: {
        title: "",
        excerpt: "",
        description: "",
        genre: "",
        country: "",
        director: "",
        seoTitle: "",
        seoDescription: "",
      },
      uz: {
        title: "",
        excerpt: "",
        description: "",
        genre: "",
        country: "",
        director: "",
        seoTitle: "",
        seoDescription: "",
      },
    },
    calendarDates: [],
    galleryItems: [],
    castItems: [],
  };
}

function toDateInputValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mapMovieToForm(movie) {
  const ru =
    movie?.translations?.find((item) => item.locale === "ru") || null;
  const uz =
    movie?.translations?.find((item) => item.locale === "uz") || null;

  return {
    id: movie.id,
    slug: movie.slug || "",
    status: movie.status || "draft",
    isFeatured: Boolean(movie.isFeatured),
    posterImage: movie.posterImage || "",
    coverImage: movie.coverImage || "",
    trailerUrl: movie.trailerUrl || "",
    buyTicketsUrl:
      movie.buyTicketsUrl ||
      movie.ticketUrl ||
      (Array.isArray(movie.sessions)
        ? movie.sessions.find((item) => item.ticketUrl)?.ticketUrl || ""
        : ""),
    releaseDate: toDateInputValue(movie.releaseDate),
    durationMinutes:
      movie.durationMinutes !== null && movie.durationMinutes !== undefined
        ? String(movie.durationMinutes)
        : "",
    ageRating: movie.ageRating || "",
    imdbRating: movie.imdbRating || "",
    kpRating: movie.kpRating || "",
    translations: {
      ru: {
        title: ru?.title || "",
        excerpt: ru?.excerpt || "",
        description: ru?.description || "",
        genre: ru?.genre || "",
        country: ru?.country || "",
        director: ru?.director || "",
        seoTitle: ru?.seoTitle || "",
        seoDescription: ru?.seoDescription || "",
      },
      uz: {
        title: uz?.title || "",
        excerpt: uz?.excerpt || "",
        description: uz?.description || "",
        genre: uz?.genre || "",
        country: uz?.country || "",
        director: uz?.director || "",
        seoTitle: uz?.seoTitle || "",
        seoDescription: uz?.seoDescription || "",
      },
    },
    calendarDates: Array.isArray(movie.calendarDates)
      ? movie.calendarDates.map((item, index) => ({
          date: toDateInputValue(item.date),
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
    galleryItems: Array.isArray(movie.galleryItems)
      ? movie.galleryItems.map((item, index) => ({
          image: item.image || "",
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
    castItems: Array.isArray(movie.castItems)
      ? movie.castItems.map((item, index) => ({
          locale: item.locale || "ru",
          name: item.name || "",
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
  };
}

function buildPayload(form) {
  return {
    slug: form.slug.trim(),
    status: form.status,
    isFeatured: Boolean(form.isFeatured),
    posterImage: form.posterImage.trim() || null,
    coverImage: form.coverImage.trim() || null,
    trailerUrl: form.trailerUrl.trim() || null,
    buyTicketsUrl: form.buyTicketsUrl.trim() || null,
    releaseDate: form.releaseDate || null,
    durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
    ageRating: form.ageRating.trim() || null,
    imdbRating: form.imdbRating.trim() || null,
    kpRating: form.kpRating.trim() || null,
    translations: [
      {
        locale: "ru",
        title: form.translations.ru.title.trim(),
        excerpt: form.translations.ru.excerpt.trim() || null,
        description: form.translations.ru.description.trim() || null,
        genre: form.translations.ru.genre.trim() || null,
        country: form.translations.ru.country.trim() || null,
        director: form.translations.ru.director.trim() || null,
        seoTitle: form.translations.ru.seoTitle.trim() || null,
        seoDescription: form.translations.ru.seoDescription.trim() || null,
      },
      {
        locale: "uz",
        title: form.translations.uz.title.trim() || "",
        excerpt: form.translations.uz.excerpt.trim() || null,
        description: form.translations.uz.description.trim() || null,
        genre: form.translations.uz.genre.trim() || null,
        country: form.translations.uz.country.trim() || null,
        director: form.translations.uz.director.trim() || null,
        seoTitle: form.translations.uz.seoTitle.trim() || null,
        seoDescription: form.translations.uz.seoDescription.trim() || null,
      },
    ].filter((item) => item.title),
    calendarDates: form.calendarDates
      .filter((item) => item.date.trim())
      .map((item, index) => ({
        date: item.date,
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
    galleryItems: form.galleryItems
      .filter((item) => item.image.trim())
      .map((item, index) => ({
        image: item.image.trim(),
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
    castItems: form.castItems
      .filter((item) => item.name.trim())
      .map((item, index) => ({
        locale: item.locale || "ru",
        name: item.name.trim(),
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
  };
}

function EditMoviePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(buildEmptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMovie() {
      try {
        setIsLoading(true);
        setLoadError("");

        const movies = await fetchAdminMovies();
        const target = movies.find((item) => String(item.id) === String(id));

        if (!target) {
          throw new Error("Фильм не найден");
        }

        if (!isMounted) return;

        setForm(mapMovieToForm(target));
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить фильм");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTranslationChange(locale, field, value) {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [locale]: {
          ...prev.translations[locale],
          [field]: value,
        },
      },
    }));
  }

  function handleCalendarDateChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      calendarDates: prev.calendarDates.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addCalendarDate() {
    setForm((prev) => ({
      ...prev,
      calendarDates: [
        ...prev.calendarDates,
        {
          date: "",
          sortOrder: prev.calendarDates.length,
        },
      ],
    }));
  }

  function removeCalendarDate(index) {
    setForm((prev) => ({
      ...prev,
      calendarDates: prev.calendarDates.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function handleGalleryChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addGalleryItem() {
    setForm((prev) => ({
      ...prev,
      galleryItems: [
        ...prev.galleryItems,
        {
          image: "",
          sortOrder: prev.galleryItems.length,
        },
      ],
    }));
  }

  function removeGalleryItem(index) {
    setForm((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function handleCastChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      castItems: prev.castItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addCastItem() {
    setForm((prev) => ({
      ...prev,
      castItems: [
        ...prev.castItems,
        {
          locale: "ru",
          name: "",
          sortOrder: prev.castItems.length,
        },
      ],
    }));
  }

  function removeCastItem(index) {
    setForm((prev) => ({
      ...prev,
      castItems: prev.castItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = buildPayload(form);
      await updateMovieById(form.id, payload);

      navigate("/movies");
    } catch (error) {
      console.error("EDIT MOVIE PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось обновить фильм");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-section">
        <div className="admin-card">
          <p>Загрузка фильма...</p>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="admin-section">
        <div className="admin-alert admin-alert--error">{loadError}</div>
      </section>
    );
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Редактировать фильм</h1>
          <p>
            Изменение карточки фильма, календарных дат, галереи и актёрского
            состава.
          </p>
        </div>
      </div>

      {submitError ? (
        <div className="admin-alert admin-alert--error">{submitError}</div>
      ) : null}

      <MovieEditor
        form={{ ...form, onSubmit: handleSubmit }}
        onChange={handleChange}
        onTranslationChange={handleTranslationChange}
        onCalendarDateChange={handleCalendarDateChange}
        addCalendarDate={addCalendarDate}
        removeCalendarDate={removeCalendarDate}
        onGalleryChange={handleGalleryChange}
        addGalleryItem={addGalleryItem}
        removeGalleryItem={removeGalleryItem}
        onCastChange={handleCastChange}
        addCastItem={addCastItem}
        removeCastItem={removeCastItem}
        isSubmitting={isSubmitting}
        submitLabel="Сохранить изменения"
      />
    </section>
  );
}

export default EditMoviePage;