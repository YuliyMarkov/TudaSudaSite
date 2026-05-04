import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPlace } from "../api/places";
import PlaceEditor from "../components/PlaceEditor";

function generateSlug(text = "") {
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

  return text
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
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);

  const emptyUzCount = useMemo(() => {
    const fields = [
      "title",
      "subtitle",
      "type",
      "category",
      "address",
      "workingHours",
      "priceLabel",
      "description",
      "features",
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

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "slug") {
        setIsSlugEdited(true);
        next.slug = generateSlug(value);
      }

      return next;
    });
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

  function regenerateSlug() {
    setForm((prev) => ({
      ...prev,
      slug: generateSlug(
        prev.translations.ru.title || prev.translations.uz.title,
      ),
    }));

    setIsSlugEdited(false);
  }

  function copyRuToUz() {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        uz: {
          ...prev.translations.uz,
          title: prev.translations.uz.title || prev.translations.ru.title,
          subtitle:
            prev.translations.uz.subtitle || prev.translations.ru.subtitle,
          type: prev.translations.uz.type || prev.translations.ru.type,
          category:
            prev.translations.uz.category || prev.translations.ru.category,
          address: prev.translations.uz.address || prev.translations.ru.address,
          workingHours:
            prev.translations.uz.workingHours ||
            prev.translations.ru.workingHours,
          priceLabel:
            prev.translations.uz.priceLabel || prev.translations.ru.priceLabel,
          description:
            prev.translations.uz.description ||
            prev.translations.ru.description,
          features:
            prev.translations.uz.features || prev.translations.ru.features,
          mustVisit:
            prev.translations.uz.mustVisit || prev.translations.ru.mustVisit,
          seoTitle:
            prev.translations.uz.seoTitle || prev.translations.ru.seoTitle,
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
        itemIndex === index ? { ...item, [field]: value } : item,
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
          {
            locale: "ru",
            value: "",
            sortOrder: nextSortOrder,
          },
          {
            locale: "uz",
            value: "",
            sortOrder: nextSortOrder,
          },
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

  function handleHighlightChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addHighlightItem() {
    setForm((prev) => {
      const nextSortOrder = Math.floor(prev.highlights.length / 2);

      return {
        ...prev,
        highlights: [
          ...prev.highlights,
          {
            locale: "ru",
            title: "",
            description: "",
            image: "",
            sortOrder: nextSortOrder,
          },
          {
            locale: "uz",
            title: "",
            description: "",
            image: "",
            sortOrder: nextSortOrder,
          },
        ],
      };
    });
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
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addSuitableForItem() {
    setForm((prev) => {
      const nextSortOrder = Math.floor(prev.suitableFor.length / 2);

      return {
        ...prev,
        suitableFor: [
          ...prev.suitableFor,
          {
            locale: "ru",
            value: "",
            sortOrder: nextSortOrder,
          },
          {
            locale: "uz",
            value: "",
            sortOrder: nextSortOrder,
          },
        ],
      };
    });
  }

  function removeSuitableForItem(index) {
    setForm((prev) => ({
      ...prev,
      suitableFor: prev.suitableFor.filter(
        (_, itemIndex) => itemIndex !== index,
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
        onRegenerateSlug={regenerateSlug}
        onCopyRuToUz={copyRuToUz}
        emptyUzCount={emptyUzCount}
        isSeoOpen={isSeoOpen}
        setIsSeoOpen={setIsSeoOpen}
        isExtraOpen={isExtraOpen}
        setIsExtraOpen={setIsExtraOpen}
        onCancel={() => navigate("/places")}
      />
    </section>
  );
}

export default CreatePlacePage;
