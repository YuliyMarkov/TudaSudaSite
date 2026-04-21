import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlace } from "../api/places";
import PlaceEditor from "../components/PlaceEditor";

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
      suitableFor: prev.suitableFor.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = buildPayload(form);
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
      <div className="admin-section-header">
        <div>
          <h1>Создать место</h1>
          <p>Новая карточка места для каталога и отдельной страницы.</p>
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