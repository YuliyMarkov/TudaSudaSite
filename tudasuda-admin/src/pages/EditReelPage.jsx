import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminReels, updateReelById } from "../api/reels";
import ReelEditor from "../components/ReelEditor";

function buildEmptyForm() {
  return {
    id: null,
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

function mapReelToForm(reel) {
  const ru = reel?.translations?.find((item) => item.locale === "ru") || null;
  const uz = reel?.translations?.find((item) => item.locale === "uz") || null;

  return {
    id: reel.id,
    coverImage: reel.coverImage || "",
    videoUrl: reel.videoUrl || "",
    sourceType: reel.sourceType || "instagram",
    isActive: Boolean(reel.isActive),
    sortOrder:
      reel.sortOrder !== null && reel.sortOrder !== undefined
        ? String(reel.sortOrder)
        : "0",
    translations: {
      ru: {
        title: ru?.title || "",
      },
      uz: {
        title: uz?.title || "",
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

function EditReelPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(buildEmptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReel() {
      try {
        setIsLoading(true);
        setLoadError("");

        const reels = await fetchAdminReels();
        const target = reels.find((item) => String(item.id) === String(id));

        if (!target) {
          throw new Error("Рилс не найден");
        }

        if (!isMounted) return;

        setForm(mapReelToForm(target));
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить рилс");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReel();

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
      await updateReelById(form.id, payload);

      navigate("/reels");
    } catch (error) {
      console.error("EDIT REEL PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось обновить рилс");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-section">
        <div className="admin-card">
          <p>Загрузка рилса...</p>
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
          <h1>Редактировать рилс</h1>
          <p>Изменение элемента reels-блока на главной странице.</p>
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
        submitLabel="Сохранить изменения"
      />
    </section>
  );
}

export default EditReelPage;