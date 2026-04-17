import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title || null,
  };
}

const reelInclude = {
  translations: true,
};

export async function createReel(req, res) {
  try {
    const {
      sortOrder,
      isActive,
      coverImage,
      videoUrl,
      sourceType,
      translations,
    } = req.body;

    if (!coverImage) {
      return res.status(400).json({
        message: "coverImage обязателен",
      });
    }

    if (!videoUrl) {
      return res.status(400).json({
        message: "videoUrl обязателен",
      });
    }

    const reel = await prisma.reel.create({
      data: {
        sortOrder: Number(sortOrder ?? 0),
        isActive: typeof isActive === "boolean" ? isActive : true,
        coverImage,
        videoUrl,
        sourceType: sourceType || "instagram",
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
      },
      include: reelInclude,
    });

    return res.status(201).json(reel);
  } catch (error) {
    console.error("CREATE REEL ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании reel",
    });
  }
}

export async function getReels(req, res) {
  try {
    const { lang, activeOnly } = req.query;

    const where = {};

    if (activeOnly === "true") {
      where.isActive = true;
    }

    const reels = await prisma.reel.findMany({
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

    return res.json(reels);
  } catch (error) {
    console.error("GET REELS ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении reels",
    });
  }
}

export async function getReelById(req, res) {
  try {
    const reelId = Number(req.params.id);
    const { lang } = req.query;

    if (!reelId) {
      return res.status(400).json({
        message: "Некорректный id reel",
      });
    }

    const reel = await prisma.reel.findUnique({
      where: { id: reelId },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
      },
    });

    if (!reel) {
      return res.status(404).json({
        message: "Reel не найден",
      });
    }

    return res.json(reel);
  } catch (error) {
    console.error("GET REEL BY ID ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении reel",
    });
  }
}

export async function updateReel(req, res) {
  try {
    const reelId = Number(req.params.id);

    if (!reelId) {
      return res.status(400).json({
        message: "Некорректный id reel",
      });
    }

    const {
      sortOrder,
      isActive,
      coverImage,
      videoUrl,
      sourceType,
      translations,
    } = req.body;

    const existingReel = await prisma.reel.findUnique({
      where: { id: reelId },
    });

    if (!existingReel) {
      return res.status(404).json({
        message: "Reel не найден",
      });
    }

    await prisma.reelTranslation.deleteMany({
      where: { reelId },
    });

    const updatedReel = await prisma.reel.update({
      where: { id: reelId },
      data: {
        sortOrder:
          sortOrder !== undefined ? Number(sortOrder) : existingReel.sortOrder,
        isActive:
          typeof isActive === "boolean" ? isActive : existingReel.isActive,
        coverImage: coverImage ?? existingReel.coverImage,
        videoUrl: videoUrl ?? existingReel.videoUrl,
        sourceType: sourceType ?? existingReel.sourceType,
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
      },
      include: reelInclude,
    });

    return res.json(updatedReel);
  } catch (error) {
    console.error("UPDATE REEL ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении reel",
    });
  }
}

export async function deleteReel(req, res) {
  try {
    const reelId = Number(req.params.id);

    if (!reelId) {
      return res.status(400).json({
        message: "Некорректный id reel",
      });
    }

    const existingReel = await prisma.reel.findUnique({
      where: { id: reelId },
    });

    if (!existingReel) {
      return res.status(404).json({
        message: "Reel не найден",
      });
    }

    await prisma.reel.delete({
      where: { id: reelId },
    });

    return res.json({
      message: "Reel удалён",
    });
  } catch (error) {
    console.error("DELETE REEL ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении reel",
    });
  }
}