import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReel } from "../api/reels";
import ReelEditor from "../components/ReelEditor";

function buildInitialForm() {
  return {
    coverImage: "",
    videoUrl: "",
    sourceType: "instagram",
    isActive: true,
    sortOrder: 0,
    translations: {
      ru: {
        title: "",
      },
      uz: {
        title: "",
      },
    },
  };
}

function buildPayload(form) {
  return {
    coverImage: form.coverImage.trim(),
    videoUrl: form.videoUrl.trim(),
    sourceType: form.sourceType || "instagram",
    isActive: Boolean(form.isActive),
    sortOrder:
      form.sortOrder !== "" && form.sortOrder !== null
        ? Number(form.sortOrder)
        : 0,
    translations: [
      {
        locale: "ru",
        title: form.translations.ru.title.trim(),
      },
      {
        locale: "uz",
        title: form.translations.uz.title.trim() || "",
      },
    ].filter((item) => item.title),
  };
}

function CreateReelPage() {
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
      await createReel(payload);

      navigate("/reels");
    } catch (error) {
      console.error("CREATE REEL PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать рилс");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Создать рилс</h1>
          <p>Новый элемент для блока reels на главной странице.</p>
        </div>
      </div>

      {submitError ? (
        <div className="admin-alert admin-alert--error">{submitError}</div>
      ) : null}

      <ReelEditor
        form={{ ...form, onSubmit: handleSubmit }}
        onChange={handleChange}
        onTranslationChange={handleTranslationChange}
        isSubmitting={isSubmitting}
        submitLabel="Создать рилс"
      />
    </section>
  );
}

export default CreateReelPage;