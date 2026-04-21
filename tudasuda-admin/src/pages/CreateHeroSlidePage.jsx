import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHeroSlide } from "../api/heroSlides";
import HeroSlideEditor from "../components/HeroSlideEditor";

function buildInitialForm() {
  return {
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

function CreateHeroSlidePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(buildInitialForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
      await createHeroSlide(payload);

      navigate("/hero-slides");
    } catch (error) {
      console.error("CREATE HERO SLIDE PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать слайд");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Создать слайд</h1>
          <p>Новый элемент верхнего слайдера на главной странице.</p>
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
        submitLabel="Создать слайд"
      />
    </section>
  );
}

export default CreateHeroSlidePage;