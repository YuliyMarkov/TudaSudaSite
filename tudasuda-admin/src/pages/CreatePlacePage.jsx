import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPlace } from "../api/places";
import PlaceEditor from "../components/PlaceEditor";

function generateSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/а/g, "a")
    .replace(/б/g, "b")
    .replace(/в/g, "v")
    .replace(/г/g, "g")
    .replace(/д/g, "d")
    .replace(/е/g, "e")
    .replace(/ё/g, "e")
    .replace(/ж/g, "zh")
    .replace(/з/g, "z")
    .replace(/и/g, "i")
    .replace(/й/g, "y")
    .replace(/к/g, "k")
    .replace(/л/g, "l")
    .replace(/м/g, "m")
    .replace(/н/g, "n")
    .replace(/о/g, "o")
    .replace(/п/g, "p")
    .replace(/р/g, "r")
    .replace(/с/g, "s")
    .replace(/т/g, "t")
    .replace(/у/g, "u")
    .replace(/ф/g, "f")
    .replace(/х/g, "h")
    .replace(/ц/g, "ts")
    .replace(/ч/g, "ch")
    .replace(/ш/g, "sh")
    .replace(/щ/g, "sch")
    .replace(/ы/g, "y")
    .replace(/э/g, "e")
    .replace(/ю/g, "yu")
    .replace(/я/g, "ya")
    .replace(/ъ|ь/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildInitialForm() {
  return {
    slug: "",
    status: "draft",
    isFeatured: false,
    coverImage: "",
    mapEmbed: "",
    phone: "",
    instagram: "",
    telegram: "",
    website: "",
    parking: false,
    wifi: false,
    booking: false,
    family: false,
    terrace: false,
    photoZone: false,
    translations: {
      ru: {
        title: "",
        subtitle: "",
        type: "",
        category: "",
        address: "",
        workingHours: "",
        priceLabel: "",
        description: "",
        features: "",
        mustVisit: "",
        seoTitle: "",
        seoDescription: "",
      },
      uz: {
        title: "",
        subtitle: "",
        type: "",
        category: "",
        address: "",
        workingHours: "",
        priceLabel: "",
        description: "",
        features: "",
        mustVisit: "",
        seoTitle: "",
        seoDescription: "",
      },
    },
    prices: [],
    highlights: [],
    suitableFor: [],
  };
}

function buildPayload(form) {
  return {
    slug: form.slug.trim(),
    status: form.status,
    isFeatured: Boolean(form.isFeatured),
    coverImage: form.coverImage.trim() || null,
    mapEmbed: form.mapEmbed.trim() || null,
    phone: form.phone.trim() || null,
    instagram: form.instagram.trim() || null,
    telegram: form.telegram.trim() || null,
    website: form.website.trim() || null,
    parking: Boolean(form.parking),
    wifi: Boolean(form.wifi),
    booking: Boolean(form.booking),
    family: Boolean(form.family),
    terrace: Boolean(form.terrace),
    photoZone: Boolean(form.photoZone),
    translations: [
      {
        locale: "ru",
        title: form.translations.ru.title.trim(),
        subtitle: form.translations.ru.subtitle.trim() || null,
        type: form.translations.ru.type.trim() || null,
        category: form.translations.ru.category.trim() || null,
        address: form.translations.ru.address.trim() || null,
        workingHours: form.translations.ru.workingHours.trim() || null,
        priceLabel: form.translations.ru.priceLabel.trim() || null,
        description: form.translations.ru.description.trim() || null,
        features: form.translations.ru.features.trim() || null,
        mustVisit: form.translations.ru.mustVisit.trim() || null,
        seoTitle: form.translations.ru.seoTitle.trim() || null,
        seoDescription: form.translations.ru.seoDescription.trim() || null,
      },
      {
        locale: "uz",
        title: form.translations.uz.title.trim() || "",
        subtitle: form.translations.uz.subtitle.trim() || null,
        type: form.translations.uz.type.trim() || null,
        category: form.translations.uz.category.trim() || null,
        address: form.translations.uz.address.trim() || null,
        workingHours: form.translations.uz.workingHours.trim() || null,
        priceLabel: form.translations.uz.priceLabel.trim() || null,
        description: form.translations.uz.description.trim() || null,
        features: form.translations.uz.features.trim() || null,
        mustVisit: form.translations.uz.mustVisit.trim() || null,
        seoTitle: form.translations.uz.seoTitle.trim() || null,
        seoDescription: form.translations.uz.seoDescription.trim() || null,
      },
    ].filter((item) => item.title),
    prices: form.prices
      .filter((item) => item.value.trim())
      .map((item, index) => ({
        locale: item.locale || "ru",
        value: item.value.trim(),
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
    highlights: form.highlights
      .filter((item) => item.title.trim())
      .map((item, index) => ({
        locale: item.locale || "ru",
        title: item.title.trim(),
        description: item.description.trim() || null,
        image: item.image.trim() || null,
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
    suitableFor: form.suitableFor
      .filter((item) => item.value.trim())
      .map((item, index) => ({
        locale: item.locale || "ru",
        value: item.value.trim(),
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
  };
}

function CreatePlacePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(buildInitialForm());
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formProgress = useMemo(() => {
    const checks = [
      Boolean(form.slug.trim()),
      Boolean(form.coverImage.trim()),
      Boolean(form.translations.ru.title.trim()),
      Boolean(form.translations.ru.subtitle.trim()),
      Boolean(form.translations.ru.address.trim()),
      Boolean(form.translations.ru.description.trim()),
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [form]);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    if (name === "slug") {
      setIsSlugEdited(true);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTranslationChange(locale, field, value) {
    setForm((prev) => {
      const nextForm = {
        ...prev,
        translations: {
          ...prev.translations,
          [locale]: {
            ...prev.translations[locale],
            [field]: value,
          },
        },
      };

      if (locale === "ru" && field === "title" && !isSlugEdited) {
        nextForm.slug = generateSlug(value);
      }

      return nextForm;
    });
  }

  function handlePriceChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addPriceItem() {
    setForm((prev) => ({
      ...prev,
      prices: [
        ...prev.prices,
        {
          locale: "ru",
          value: "",
          sortOrder: prev.prices.length,
        },
      ],
    }));
  }

  function removePriceItem(index) {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleHighlightChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addHighlightItem() {
    setForm((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        {
          locale: "ru",
          title: "",
          description: "",
          image: "",
          sortOrder: prev.highlights.length,
        },
      ],
    }));
  }

  function removeHighlightItem(index) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleSuitableForChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      suitableFor: prev.suitableFor.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addSuitableForItem() {
    setForm((prev) => ({
      ...prev,
      suitableFor: [
        ...prev.suitableFor,
        {
          locale: "ru",
          value: "",
          sortOrder: prev.suitableFor.length,
        },
      ],
    }));
  }

  function removeSuitableForItem(index) {
    setForm((prev) => ({
      ...prev,
      suitableFor: prev.suitableFor.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = buildPayload(form);

      if (!payload.slug) {
        throw new Error("Укажите slug или заполните русский заголовок");
      }

      if (!payload.translations.some((item) => item.locale === "ru")) {
        throw new Error("Заполните русский заголовок места");
      }

      await createPlace(payload);

      navigate("/places");
    } catch (error) {
      console.error("CREATE PLACE PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать место");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header admin-section-header--with-actions">
        <div>
          <div className="admin-kicker">Места</div>
          <h1>Создать место</h1>
          <p>
            Заполните карточку места для каталога и отдельной страницы. Сначала
            добавьте базовую информацию, затем — детали, цены и подборки.
          </p>
        </div>

        <Link to="/places" className="secondary-btn">
          Назад к местам
        </Link>
      </div>

      <div className="admin-form-progress">
        <div className="admin-form-progress__top">
          <span>Заполненность карточки</span>
          <strong>{formProgress}%</strong>
        </div>

        <div className="admin-form-progress__track">
          <div
            className="admin-form-progress__bar"
            style={{ width: `${formProgress}%` }}
          />
        </div>
      </div>

      {submitError ? (
        <div className="admin-alert admin-alert--error">{submitError}</div>
      ) : null}

      <PlaceEditor
        form={{ ...form, onSubmit: handleSubmit }}
        onChange={handleChange}
        onTranslationChange={handleTranslationChange}
        onPriceChange={handlePriceChange}
        addPriceItem={addPriceItem}
        removePriceItem={removePriceItem}
        onHighlightChange={handleHighlightChange}
        addHighlightItem={addHighlightItem}
        removeHighlightItem={removeHighlightItem}
        onSuitableForChange={handleSuitableForChange}
        addSuitableForItem={addSuitableForItem}
        removeSuitableForItem={removeSuitableForItem}
        isSubmitting={isSubmitting}
        submitLabel="Создать место"
      />
    </section>
  );
}

export default CreatePlacePage;