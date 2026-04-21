import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../api/movies";
import MovieEditor from "../components/MovieEditor";

function buildInitialForm() {
  return {
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

function CreateMoviePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(buildInitialForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
      await createMovie(payload);

      navigate("/movies");
    } catch (error) {
      console.error("CREATE MOVIE PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать фильм");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Создать фильм</h1>
          <p>
            Новая карточка фильма для афиши, страницы фильма и календаря.
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
        submitLabel="Создать фильм"
      />
    </section>
  );
}

export default CreateMoviePage;