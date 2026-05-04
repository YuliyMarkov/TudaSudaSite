import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../api/restaurants";
import RestaurantEditor from "../components/RestaurantEditor";

function makeSlug(value = "") {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    қ: "q",
    ғ: "g",
    ҳ: "h",
    ў: "o",
  };

  return value
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
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

function CreateRestaurantPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(buildInitialForm());
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);

  const emptyUzCount = useMemo(() => {
    const fields = [
      "title",
      "type",
      "cuisine",
      "address",
      "workingHours",
      "averageCheck",
      "description",
      "atmosphere",
      "mustVisit",
    ];

    return fields.reduce((count, field) => {
      if (
        form.translations.ru[field]?.trim() &&
        !form.translations.uz[field]?.trim()
      ) {
        return count + 1;
      }

      return count;
    }, 0);
  }, [form.translations]);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "slug") {
        setIsSlugTouched(true);
        next.slug = makeSlug(value);
      }

      return next;
    });
  }

  function handleTranslationChange(locale, field, value) {
    setForm((prev) => {
      const next = {
        ...prev,
        translations: {
          ...prev.translations,
          [locale]: {
            ...prev.translations[locale],
            [field]: value,
          },
        },
      };

      if (locale === "ru" && field === "title" && !isSlugTouched) {
        next.slug = makeSlug(value);
      }

      return next;
    });
  }

  function regenerateSlug() {
    setForm((prev) => ({
      ...prev,
      slug: makeSlug(prev.translations.ru.title || prev.translations.uz.title),
    }));

    setIsSlugTouched(false);
  }

  function copyRuToUz() {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        uz: {
          ...prev.translations.uz,
          title: prev.translations.uz.title || prev.translations.ru.title,
          type: prev.translations.uz.type || prev.translations.ru.type,
          cuisine: prev.translations.uz.cuisine || prev.translations.ru.cuisine,
          address: prev.translations.uz.address || prev.translations.ru.address,
          workingHours:
            prev.translations.uz.workingHours ||
            prev.translations.ru.workingHours,
          averageCheck:
            prev.translations.uz.averageCheck ||
            prev.translations.ru.averageCheck,
          description:
            prev.translations.uz.description || prev.translations.ru.description,
          atmosphere:
            prev.translations.uz.atmosphere || prev.translations.ru.atmosphere,
          mustVisit:
            prev.translations.uz.mustVisit || prev.translations.ru.mustVisit,
          seoTitle: prev.translations.uz.seoTitle || prev.translations.ru.seoTitle,
          seoDescription:
            prev.translations.uz.seoDescription ||
            prev.translations.ru.seoDescription,
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
    setForm((prev) => {
      const nextSortOrder = Math.floor(prev.prices.length / 2);

      return {
        ...prev,
        prices: [
          ...prev.prices,
          { locale: "ru", value: "", sortOrder: nextSortOrder },
          { locale: "uz", value: "", sortOrder: nextSortOrder },
        ],
      };
    });
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
    setForm((prev) => {
      const nextSortOrder = Math.floor(prev.dishes.length / 2);

      return {
        ...prev,
        dishes: [
          ...prev.dishes,
          { locale: "ru", title: "", image: "", sortOrder: nextSortOrder },
          { locale: "uz", title: "", image: "", sortOrder: nextSortOrder },
        ],
      };
    });
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
    setForm((prev) => {
      const nextSortOrder = Math.floor(prev.formats.length / 2);

      return {
        ...prev,
        formats: [
          ...prev.formats,
          { locale: "ru", value: "", sortOrder: nextSortOrder },
          { locale: "uz", value: "", sortOrder: nextSortOrder },
        ],
      };
    });
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

      if (!payload.slug) {
        throw new Error("Укажите slug или заполните русский заголовок");
      }

      if (!payload.translations.some((item) => item.locale === "ru")) {
        throw new Error("Заполните русский заголовок ресторана");
      }

      await createRestaurant(payload);
      navigate("/restaurants");
    } catch (error) {
      console.error("CREATE RESTAURANT PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать ресторан");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Создать ресторан</h1>
          <p>Новая карточка ресторана для каталога и отдельной страницы.</p>
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
        submitLabel="Создать ресторан"
        onRegenerateSlug={regenerateSlug}
        onCopyRuToUz={copyRuToUz}
        emptyUzCount={emptyUzCount}
        isSeoOpen={isSeoOpen}
        setIsSeoOpen={setIsSeoOpen}
        isExtraOpen={isExtraOpen}
        setIsExtraOpen={setIsExtraOpen}
        onCancel={() => navigate("/restaurants")}
      />
    </section>
  );
}

export default CreateRestaurantPage;