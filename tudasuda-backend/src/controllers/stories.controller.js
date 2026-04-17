import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    excerpt: item.excerpt || null,
    content: item.content || null,
    seoTitle: item.seoTitle || null,
    seoDescription: item.seoDescription || null,
  };
}

const storyInclude = {
  translations: true,
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

    if (!slug) {
      return res.status(400).json({
        message: "slug обязателен",
      });
    }

    if (!Array.isArray(translations) || !translations.length) {
      return res.status(400).json({
        message: "Нужен хотя бы один перевод",
      });
    }

    const existingStory = await prisma.story.findUnique({
      where: { slug },
    });

    if (existingStory) {
      return res.status(409).json({
        message: "Материал с таким slug уже существует",
      });
    }

    const story = await prisma.story.create({
      data: {
        slug,
        status: status || "draft",
        type: type || "news",
        isFeatured: Boolean(isFeatured),
        coverImage: coverImage || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        translations: {
          create: translations.map(mapTranslationCreate),
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
    const { status, type, lang, featured } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const stories = await prisma.story.findMany({
      where,
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
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
    const { lang } = req.query;

    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
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

export async function updateStory(req, res) {
  try {
    const storyId = Number(req.params.id);

    if (!storyId) {
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
    });

    if (!existingStory) {
      return res.status(404).json({
        message: "Материал не найден",
      });
    }

    if (slug && slug !== existingStory.slug) {
      const slugTaken = await prisma.story.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return res.status(409).json({
          message: "Материал с таким slug уже существует",
        });
      }
    }

    await prisma.storyTranslation.deleteMany({
      where: { storyId },
    });

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: {
        slug: slug ?? existingStory.slug,
        status: status ?? existingStory.status,
        type: type ?? existingStory.type,
        isFeatured:
          typeof isFeatured === "boolean"
            ? isFeatured
            : existingStory.isFeatured,
        coverImage: coverImage ?? existingStory.coverImage,
        publishedAt:
          publishedAt !== undefined
            ? publishedAt
              ? new Date(publishedAt)
              : null
            : existingStory.publishedAt,
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
      },
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

    if (!storyId) {
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