import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminPlaces, updatePlaceById } from "../api/places";
import PlaceEditor from "../components/PlaceEditor";

function buildEmptyForm() {
  return {
    id: null,
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

function mapPlaceToForm(place) {
  const ru = place?.translations?.find((item) => item.locale === "ru") || null;
  const uz = place?.translations?.find((item) => item.locale === "uz") || null;

  return {
    id: place.id,
    slug: place.slug || "",
    status: place.status || "draft",
    isFeatured: Boolean(place.isFeatured),
    coverImage: place.coverImage || "",
    mapEmbed: place.mapEmbed || "",
    phone: place.phone || "",
    instagram: place.instagram || "",
    telegram: place.telegram || "",
    website: place.website || "",
    parking: Boolean(place.parking),
    wifi: Boolean(place.wifi),
    booking: Boolean(place.booking),
    family: Boolean(place.family),
    terrace: Boolean(place.terrace),
    photoZone: Boolean(place.photoZone),
    translations: {
      ru: {
        title: ru?.title || "",
        subtitle: ru?.subtitle || "",
        type: ru?.type || "",
        category: ru?.category || "",
        address: ru?.address || "",
        workingHours: ru?.workingHours || "",
        priceLabel: ru?.priceLabel || "",
        description: ru?.description || "",
        features: ru?.features || "",
        mustVisit: ru?.mustVisit || "",
        seoTitle: ru?.seoTitle || "",
        seoDescription: ru?.seoDescription || "",
      },
      uz: {
        title: uz?.title || "",
        subtitle: uz?.subtitle || "",
        type: uz?.type || "",
        category: uz?.category || "",
        address: uz?.address || "",
        workingHours: uz?.workingHours || "",
        priceLabel: uz?.priceLabel || "",
        description: uz?.description || "",
        features: uz?.features || "",
        mustVisit: uz?.mustVisit || "",
        seoTitle: uz?.seoTitle || "",
        seoDescription: uz?.seoDescription || "",
      },
    },
    prices: Array.isArray(place.prices)
      ? place.prices.map((item, index) => ({
          locale: item.locale || "ru",
          value: item.value || "",
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
    highlights: Array.isArray(place.highlights)
      ? place.highlights.map((item, index) => ({
          locale: item.locale || "ru",
          title: item.title || "",
          description: item.description || "",
          image: item.image || "",
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
    suitableFor: Array.isArray(place.suitableFor)
      ? place.suitableFor.map((item, index) => ({
          locale: item.locale || "ru",
          value: item.value || "",
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

function EditPlacePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(buildEmptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlace() {
      try {
        setIsLoading(true);
        setLoadError("");

        const places = await fetchAdminPlaces();
        const target = places.find((item) => String(item.id) === String(id));

        if (!target) {
          throw new Error("Место не найдено");
        }

        if (!isMounted) return;

        setForm(mapPlaceToForm(target));
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить место");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlace();

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
      await updatePlaceById(form.id, payload);

      navigate("/places");
    } catch (error) {
      console.error("EDIT PLACE PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось обновить место");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-section">
        <div className="admin-card">
          <p>Загрузка места...</p>
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
          <h1>Редактировать место</h1>
          <p>Изменение карточки места, карты, контактов и контентных блоков.</p>
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
        submitLabel="Сохранить изменения"
      />
    </section>
  );
}

export default EditPlacePage;