import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminHeroSlides,
  updateHeroSlideById,
} from "../api/heroSlides";
import HeroSlideEditor from "../components/HeroSlideEditor";

function buildEmptyForm() {
  return {
    id: null,
    previewImage: "",
    hoverMediaType: "image",
    hoverMediaUrl: "",
    linkType: "custom",
    linkUrl: "",
    isActive: true,
    sortOrder: 0,
    translations: {
      ru: {
        title: "",
        subtitle: "",
      },
      uz: {
        title: "",
        subtitle: "",
      },
    },
  };
}

function mapHeroLinkTypeToForm(value) {
  switch (value) {
    case "movie":
      return "movie";
    case "event":
      return "event";
    case "place":
      return "place";
    case "restaurant":
      return "restaurant";
    case "story":
      return "story";
    case "custom":
    default:
      return "custom";
  }
}

function mapHeroLinkType(value) {
  switch (value) {
    case "movie":
      return "movie";
    case "event":
      return "event";
    case "place":
      return "place";
    case "restaurant":
      return "restaurant";
    case "story":
      return "story";
    case "custom":
    default:
      return "custom";
  }
}

function mapSlideToForm(slide) {
  const ru = slide?.translations?.find((item) => item.locale === "ru") || null;
  const uz = slide?.translations?.find((item) => item.locale === "uz") || null;

  return {
    id: slide.id,
    previewImage: slide.previewImage || "",
    hoverMediaType: slide.hoverMediaType || "image",
    hoverMediaUrl: slide.hoverMediaUrl || "",
    linkType: mapHeroLinkTypeToForm(slide.linkType),
    linkUrl: slide.linkUrl || "",
    isActive: Boolean(slide.isActive),
    sortOrder:
      slide.sortOrder !== null && slide.sortOrder !== undefined
        ? String(slide.sortOrder)
        : "0",
    translations: {
      ru: {
        title: ru?.title || "",
        subtitle: ru?.subtitle || "",
      },
      uz: {
        title: uz?.title || "",
        subtitle: uz?.subtitle || "",
      },
    },
  };
}

function buildPayload(form) {
  return {
    previewImage: form.previewImage.trim(),
    hoverMediaType: form.hoverMediaType || "image",
    hoverMediaUrl: form.hoverMediaUrl.trim() || null,
    linkType: mapHeroLinkType(form.linkType),
    linkUrl: form.linkUrl.trim() || null,
    isActive: Boolean(form.isActive),
    sortOrder:
      form.sortOrder !== "" && form.sortOrder !== null
        ? Number(form.sortOrder)
        : 0,
    translations: [
      {
        locale: "ru",
        title: form.translations.ru.title.trim(),
        subtitle: form.translations.ru.subtitle.trim() || null,
      },
      {
        locale: "uz",
        title: form.translations.uz.title.trim() || "",
        subtitle: form.translations.uz.subtitle.trim() || null,
      },
    ].filter((item) => item.title),
  };
}

function EditHeroSlidePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(buildEmptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSlide() {
      try {
        setIsLoading(true);
        setLoadError("");

        const slides = await fetchAdminHeroSlides();
        const target = slides.find((item) => String(item.id) === String(id));

        if (!target) {
          throw new Error("Слайд не найден");
        }

        if (!isMounted) return;

        setForm(mapSlideToForm(target));
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить слайд");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSlide();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : name === "sortOrder"
          ? value
          : value,
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = buildPayload(form);
      await updateHeroSlideById(form.id, payload);

      navigate("/hero-slides");
    } catch (error) {
      console.error("EDIT HERO SLIDE PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось обновить слайд");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-section">
        <div className="admin-card">
          <p>Загрузка слайда...</p>
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
          <h1>Редактировать слайд</h1>
          <p>Изменение верхнего слайда главной страницы.</p>
        </div>
      </div>

      {submitError ? (
        <div className="admin-alert admin-alert--error">{submitError}</div>
      ) : null}

      <HeroSlideEditor
        form={{ ...form, onSubmit: handleSubmit }}
        onChange={handleChange}
        onTranslationChange={handleTranslationChange}
        isSubmitting={isSubmitting}
        submitLabel="Сохранить изменения"
      />
    </section>
  );
}

export default EditHeroSlidePage;