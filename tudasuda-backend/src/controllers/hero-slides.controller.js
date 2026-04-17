import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    subtitle: item.subtitle || null,
  };
}

const heroSlideInclude = {
  translations: true,
};

export async function createHeroSlide(req, res) {
  try {
    const {
      sortOrder,
      isActive,
      previewImage,
      hoverMediaType,
      hoverMediaUrl,
      linkType,
      linkUrl,
      translations,
    } = req.body;

    if (!previewImage) {
      return res.status(400).json({
        message: "previewImage обязателен",
      });
    }

    if (!Array.isArray(translations) || !translations.length) {
      return res.status(400).json({
        message: "Нужен хотя бы один перевод",
      });
    }

    const heroSlide = await prisma.heroSlide.create({
      data: {
        sortOrder: Number(sortOrder ?? 0),
        isActive: typeof isActive === "boolean" ? isActive : true,
        previewImage,
        hoverMediaType: hoverMediaType || "image",
        hoverMediaUrl: hoverMediaUrl || null,
        linkType: linkType || "custom",
        linkUrl: linkUrl || null,
        translations: {
          create: translations.map(mapTranslationCreate),
        },
      },
      include: heroSlideInclude,
    });

    return res.status(201).json(heroSlide);
  } catch (error) {
    console.error("CREATE HERO SLIDE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании слайда",
    });
  }
}

export async function getHeroSlides(req, res) {
  try {
    const { lang, activeOnly } = req.query;

    const where = {};

    if (activeOnly === "true") {
      where.isActive = true;
    }

    const heroSlides = await prisma.heroSlide.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
      },
    });

    return res.json(heroSlides);
  } catch (error) {
    console.error("GET HERO SLIDES ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении слайдов",
    });
  }
}

export async function getHeroSlideById(req, res) {
  try {
    const heroSlideId = Number(req.params.id);
    const { lang } = req.query;

    if (!heroSlideId) {
      return res.status(400).json({
        message: "Некорректный id слайда",
      });
    }

    const heroSlide = await prisma.heroSlide.findUnique({
      where: { id: heroSlideId },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
      },
    });

    if (!heroSlide) {
      return res.status(404).json({
        message: "Слайд не найден",
      });
    }

    return res.json(heroSlide);
  } catch (error) {
    console.error("GET HERO SLIDE BY ID ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении слайда",
    });
  }
}

export async function updateHeroSlide(req, res) {
  try {
    const heroSlideId = Number(req.params.id);

    if (!heroSlideId) {
      return res.status(400).json({
        message: "Некорректный id слайда",
      });
    }

    const {
      sortOrder,
      isActive,
      previewImage,
      hoverMediaType,
      hoverMediaUrl,
      linkType,
      linkUrl,
      translations,
    } = req.body;

    const existingHeroSlide = await prisma.heroSlide.findUnique({
      where: { id: heroSlideId },
    });

    if (!existingHeroSlide) {
      return res.status(404).json({
        message: "Слайд не найден",
      });
    }

    await prisma.heroSlideTranslation.deleteMany({
      where: { heroSlideId },
    });

    const updatedHeroSlide = await prisma.heroSlide.update({
      where: { id: heroSlideId },
      data: {
        sortOrder:
          sortOrder !== undefined
            ? Number(sortOrder)
            : existingHeroSlide.sortOrder,
        isActive:
          typeof isActive === "boolean"
            ? isActive
            : existingHeroSlide.isActive,
        previewImage: previewImage ?? existingHeroSlide.previewImage,
        hoverMediaType: hoverMediaType ?? existingHeroSlide.hoverMediaType,
        hoverMediaUrl: hoverMediaUrl ?? existingHeroSlide.hoverMediaUrl,
        linkType: linkType ?? existingHeroSlide.linkType,
        linkUrl: linkUrl ?? existingHeroSlide.linkUrl,
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
      },
      include: heroSlideInclude,
    });

    return res.json(updatedHeroSlide);
  } catch (error) {
    console.error("UPDATE HERO SLIDE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении слайда",
    });
  }
}

export async function deleteHeroSlide(req, res) {
  try {
    const heroSlideId = Number(req.params.id);

    if (!heroSlideId) {
      return res.status(400).json({
        message: "Некорректный id слайда",
      });
    }

    const existingHeroSlide = await prisma.heroSlide.findUnique({
      where: { id: heroSlideId },
    });

    if (!existingHeroSlide) {
      return res.status(404).json({
        message: "Слайд не найден",
      });
    }

    await prisma.heroSlide.delete({
      where: { id: heroSlideId },
    });

    return res.json({
      message: "Слайд удалён",
    });
  } catch (error) {
    console.error("DELETE HERO SLIDE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении слайда",
    });
  }
}