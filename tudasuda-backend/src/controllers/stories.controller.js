import prisma from "../lib/prisma.js";

function normalizeLocale(locale) {
  return locale === "uz" ? "uz" : "ru";
}

function normalizeStatus(status) {
  if (status === "published") return "published";
  if (status === "archived") return "archived";
  return "draft";
}

function normalizeTranslation(item = {}) {
  return {
    locale: normalizeLocale(item.locale),
    title: item.title?.trim() || "",
    excerpt: item.excerpt?.trim() || null,
    content: item.content?.trim() || null,
    contentJson: item.contentJson ?? null,
    seoTitle: item.seoTitle?.trim() || null,
    seoDescription: item.seoDescription?.trim() || null,
  };
}

const storyInclude = {
  translations: {
    orderBy: {
      locale: "asc",
    },
  },
};

export async function createStory(req, res) {
  try {
    const {
      slug,
      status,
      type,
      isFeatured,
      coverImage,
      publishedAt,
      translations,
    } = req.body;

    if (!slug?.trim()) {
      return res.status(400).json({
        message: "slug обязателен",
      });
    }

    if (!Array.isArray(translations) || !translations.length) {
      return res.status(400).json({
        message: "Нужен хотя бы один перевод",
      });
    }

    const normalizedTranslations = translations.map(normalizeTranslation);

    const hasRuTitle = normalizedTranslations.some(
      (item) => item.locale === "ru" && item.title
    );

    if (!hasRuTitle) {
      return res.status(400).json({
        message: "Нужен хотя бы русский перевод с title",
      });
    }

    const existingStory = await prisma.story.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingStory) {
      return res.status(409).json({
        message: "Материал с таким slug уже существует",
      });
    }

    const story = await prisma.story.create({
      data: {
        slug: slug.trim(),
        status: normalizeStatus(status),
        type: type?.trim() || "news",
        isFeatured: Boolean(isFeatured),
        coverImage: coverImage?.trim() || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        translations: {
          create: normalizedTranslations,
        },
      },
      include: storyInclude,
    });

    return res.status(201).json(story);
  } catch (error) {
    console.error("CREATE STORY ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании материала",
    });
  }
}

export async function getStories(req, res) {
  try {
    const { status, type, lang, featured, admin } = req.query;

    const where = {};

    if (admin === "true") {
      if (status) {
        where.status = normalizeStatus(status);
      }
    } else {
      where.status = "published";
    }

    if (type) {
      where.type = type;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const stories = await prisma.story.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        translations: lang
          ? {
              where: { locale: normalizeLocale(lang) },
            }
          : {
              orderBy: { locale: "asc" },
            },
      },
    });

    return res.json(stories);
  } catch (error) {
    console.error("GET STORIES ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении материалов",
    });
  }
}

export async function getStoryBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang, admin } = req.query;

    const story = await prisma.story.findFirst({
      where: {
        slug,
        ...(admin === "true" ? {} : { status: "published" }),
      },
      include: {
        translations: lang
          ? {
              where: { locale: normalizeLocale(lang) },
            }
          : {
              orderBy: { locale: "asc" },
            },
      },
    });

    if (!story) {
      return res.status(404).json({
        message: "Материал не найден",
      });
    }

    return res.json(story);
  } catch (error) {
    console.error("GET STORY BY SLUG ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении материала",
    });
  }
}

export async function getStoryById(req, res) {
  try {
    const storyId = Number(req.params.id);

    if (!storyId || Number.isNaN(storyId)) {
      return res.status(400).json({
        message: "Некорректный id материала",
      });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: storyInclude,
    });

    if (!story) {
      return res.status(404).json({
        message: "Материал не найден",
      });
    }

    return res.json(story);
  } catch (error) {
    console.error("GET STORY BY ID ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении материала",
    });
  }
}

export async function updateStory(req, res) {
  try {
    const storyId = Number(req.params.id);

    if (!storyId || Number.isNaN(storyId)) {
      return res.status(400).json({
        message: "Некорректный id материала",
      });
    }

    const {
      slug,
      status,
      type,
      isFeatured,
      coverImage,
      publishedAt,
      translations,
    } = req.body;

    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
      include: { translations: true },
    });

    if (!existingStory) {
      return res.status(404).json({
        message: "Материал не найден",
      });
    }

    if (slug && slug.trim() !== existingStory.slug) {
      const slugTaken = await prisma.story.findUnique({
        where: { slug: slug.trim() },
      });

      if (slugTaken) {
        return res.status(409).json({
          message: "Материал с таким slug уже существует",
        });
      }
    }

    await prisma.story.update({
      where: { id: storyId },
      data: {
        slug: slug !== undefined ? slug.trim() : existingStory.slug,
        status: status !== undefined ? normalizeStatus(status) : existingStory.status,
        type: type !== undefined ? type?.trim() || "news" : existingStory.type,
        isFeatured:
          typeof isFeatured === "boolean" ? isFeatured : existingStory.isFeatured,
        coverImage:
          coverImage !== undefined
            ? coverImage?.trim() || null
            : existingStory.coverImage,
        publishedAt:
          publishedAt !== undefined
            ? publishedAt
              ? new Date(publishedAt)
              : null
            : existingStory.publishedAt,
      },
    });

    if (Array.isArray(translations) && translations.length) {
      for (const rawItem of translations) {
        const item = normalizeTranslation(rawItem);

        await prisma.storyTranslation.upsert({
          where: {
            storyId_locale: {
              storyId,
              locale: item.locale,
            },
          },
          update: {
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            contentJson: item.contentJson,
            seoTitle: item.seoTitle,
            seoDescription: item.seoDescription,
          },
          create: {
            storyId,
            locale: item.locale,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            contentJson: item.contentJson,
            seoTitle: item.seoTitle,
            seoDescription: item.seoDescription,
          },
        });
      }
    }

    const updatedStory = await prisma.story.findUnique({
      where: { id: storyId },
      include: storyInclude,
    });

    return res.json(updatedStory);
  } catch (error) {
    console.error("UPDATE STORY ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении материала",
    });
  }
}

export async function deleteStory(req, res) {
  try {
    const storyId = Number(req.params.id);

    if (!storyId || Number.isNaN(storyId)) {
      return res.status(400).json({
        message: "Некорректный id материала",
      });
    }

    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!existingStory) {
      return res.status(404).json({
        message: "Материал не найден",
      });
    }

    await prisma.story.delete({
      where: { id: storyId },
    });

    return res.json({
      message: "Материал удалён",
    });
  } catch (error) {
    console.error("DELETE STORY ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении материала",
    });
  }
}