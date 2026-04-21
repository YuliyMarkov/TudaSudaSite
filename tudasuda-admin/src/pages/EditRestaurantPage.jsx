import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminRestaurants,
  updateRestaurantById,
} from "../api/restaurants";
import RestaurantEditor from "../components/RestaurantEditor";

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
    delivery: false,
    smoking: false,
    terrace: false,
    music: false,
    translations: {
      ru: {
        title: "",
        type: "",
        cuisine: "",
        address: "",
        workingHours: "",
        averageCheck: "",
        description: "",
        atmosphere: "",
        mustVisit: "",
        seoTitle: "",
        seoDescription: "",
      },
      uz: {
        title: "",
        type: "",
        cuisine: "",
        address: "",
        workingHours: "",
        averageCheck: "",
        description: "",
        atmosphere: "",
        mustVisit: "",
        seoTitle: "",
        seoDescription: "",
      },
    },
    prices: [],
    dishes: [],
    formats: [],
  };
}

function mapRestaurantToForm(restaurant) {
  const ru =
    restaurant?.translations?.find((item) => item.locale === "ru") || null;
  const uz =
    restaurant?.translations?.find((item) => item.locale === "uz") || null;

  return {
    id: restaurant.id,
    slug: restaurant.slug || "",
    status: restaurant.status || "draft",
    isFeatured: Boolean(restaurant.isFeatured),
    coverImage: restaurant.coverImage || "",
    mapEmbed: restaurant.mapEmbed || "",
    phone: restaurant.phone || "",
    instagram: restaurant.instagram || "",
    telegram: restaurant.telegram || "",
    website: restaurant.website || "",
    parking: Boolean(restaurant.parking),
    wifi: Boolean(restaurant.wifi),
    booking: Boolean(restaurant.booking),
    delivery: Boolean(restaurant.delivery),
    smoking: Boolean(restaurant.smoking),
    terrace: Boolean(restaurant.terrace),
    music: Boolean(restaurant.music),
    translations: {
      ru: {
        title: ru?.title || "",
        type: ru?.type || "",
        cuisine: ru?.cuisine || "",
        address: ru?.address || "",
        workingHours: ru?.workingHours || "",
        averageCheck: ru?.averageCheck || "",
        description: ru?.description || "",
        atmosphere: ru?.atmosphere || "",
        mustVisit: ru?.mustVisit || "",
        seoTitle: ru?.seoTitle || "",
        seoDescription: ru?.seoDescription || "",
      },
      uz: {
        title: uz?.title || "",
        type: uz?.type || "",
        cuisine: uz?.cuisine || "",
        address: uz?.address || "",
        workingHours: uz?.workingHours || "",
        averageCheck: uz?.averageCheck || "",
        description: uz?.description || "",
        atmosphere: uz?.atmosphere || "",
        mustVisit: uz?.mustVisit || "",
        seoTitle: uz?.seoTitle || "",
        seoDescription: uz?.seoDescription || "",
      },
    },
    prices: Array.isArray(restaurant.prices)
      ? restaurant.prices.map((item, index) => ({
          locale: item.locale || "ru",
          value: item.value || "",
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
    dishes: Array.isArray(restaurant.dishes)
      ? restaurant.dishes.map((item, index) => ({
          locale: item.locale || "ru",
          title: item.title || "",
          image: item.image || "",
          sortOrder:
            item.sortOrder !== null && item.sortOrder !== undefined
              ? String(item.sortOrder)
              : String(index),
        }))
      : [],
    formats: Array.isArray(restaurant.formats)
      ? restaurant.formats.map((item, index) => ({
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
    delivery: Boolean(form.delivery),
    smoking: Boolean(form.smoking),
    terrace: Boolean(form.terrace),
    music: Boolean(form.music),
    translations: [
      {
        locale: "ru",
        title: form.translations.ru.title.trim(),
        type: form.translations.ru.type.trim() || null,
        cuisine: form.translations.ru.cuisine.trim() || null,
        address: form.translations.ru.address.trim() || null,
        workingHours: form.translations.ru.workingHours.trim() || null,
        averageCheck: form.translations.ru.averageCheck.trim() || null,
        description: form.translations.ru.description.trim() || null,
        atmosphere: form.translations.ru.atmosphere.trim() || null,
        mustVisit: form.translations.ru.mustVisit.trim() || null,
        seoTitle: form.translations.ru.seoTitle.trim() || null,
        seoDescription: form.translations.ru.seoDescription.trim() || null,
      },
      {
        locale: "uz",
        title: form.translations.uz.title.trim() || "",
        type: form.translations.uz.type.trim() || null,
        cuisine: form.translations.uz.cuisine.trim() || null,
        address: form.translations.uz.address.trim() || null,
        workingHours: form.translations.uz.workingHours.trim() || null,
        averageCheck: form.translations.uz.averageCheck.trim() || null,
        description: form.translations.uz.description.trim() || null,
        atmosphere: form.translations.uz.atmosphere.trim() || null,
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
    dishes: form.dishes
      .filter((item) => item.title.trim())
      .map((item, index) => ({
        locale: item.locale || "ru",
        title: item.title.trim(),
        image: item.image.trim() || null,
        sortOrder:
          item.sortOrder !== "" && item.sortOrder !== null
            ? Number(item.sortOrder)
            : index,
      })),
    formats: form.formats
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

function EditRestaurantPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(buildEmptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRestaurant() {
      try {
        setIsLoading(true);
        setLoadError("");

        const restaurants = await fetchAdminRestaurants();
        const target = restaurants.find((item) => String(item.id) === String(id));

        if (!target) {
          throw new Error("Ресторан не найден");
        }

        if (!isMounted) return;

        setForm(mapRestaurantToForm(target));
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить ресторан");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRestaurant();

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

  function handleDishChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      dishes: prev.dishes.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addDishItem() {
    setForm((prev) => ({
      ...prev,
      dishes: [
        ...prev.dishes,
        {
          locale: "ru",
          title: "",
          image: "",
          sortOrder: prev.dishes.length,
        },
      ],
    }));
  }

  function removeDishItem(index) {
    setForm((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleFormatChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      formats: prev.formats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addFormatItem() {
    setForm((prev) => ({
      ...prev,
      formats: [
        ...prev.formats,
        {
          locale: "ru",
          value: "",
          sortOrder: prev.formats.length,
        },
      ],
    }));
  }

  function removeFormatItem(index) {
    setForm((prev) => ({
      ...prev,
      formats: prev.formats.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = buildPayload(form);
      await updateRestaurantById(form.id, payload);

      navigate("/restaurants");
    } catch (error) {
      console.error("EDIT RESTAURANT PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось обновить ресторан");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-section">
        <div className="admin-card">
          <p>Загрузка ресторана...</p>
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
          <h1>Редактировать ресторан</h1>
          <p>Изменение карточки ресторана, цен, блюд, тегов и контактов.</p>
        </div>
      </div>

      {submitError ? (
        <div className="admin-alert admin-alert--error">{submitError}</div>
      ) : null}

      <RestaurantEditor
        form={{ ...form, onSubmit: handleSubmit }}
        onChange={handleChange}
        onTranslationChange={handleTranslationChange}
        onPriceChange={handlePriceChange}
        addPriceItem={addPriceItem}
        removePriceItem={removePriceItem}
        onDishChange={handleDishChange}
        addDishItem={addDishItem}
        removeDishItem={removeDishItem}
        onFormatChange={handleFormatChange}
        addFormatItem={addFormatItem}
        removeFormatItem={removeFormatItem}
        isSubmitting={isSubmitting}
        submitLabel="Сохранить изменения"
      />
    </section>
  );
}

export default EditRestaurantPage;