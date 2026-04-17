import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    type: item.type || null,
    category: item.category || null,
    address: item.address || null,
    workingHours: item.workingHours || null,
    priceLabel: item.priceLabel || null,
    description: item.description || null,
    features: item.features || null,
    mustVisit: item.mustVisit || null,
    seoTitle: item.seoTitle || null,
    seoDescription: item.seoDescription || null,
  };
}

function mapPriceCreate(item) {
  return {
    locale: item.locale,
    value: item.value,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapHighlightCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    image: item.image || null,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapSuitableForCreate(item) {
  return {
    locale: item.locale,
    value: item.value,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

const placeInclude = {
  translations: true,
  prices: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  highlights: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  suitableFor: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
};

export async function createPlace(req, res) {
  try {
    const {
      slug,
      status,
      coverImage,
      mapEmbed,
      phone,
      instagram,
      telegram,
      website,
      parking,
      wifi,
      booking,
      family,
      terrace,
      photoZone,
      translations,
      prices,
      highlights,
      suitableFor,
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

    const existingPlace = await prisma.place.findUnique({
      where: { slug },
    });

    if (existingPlace) {
      return res.status(409).json({
        message: "Место с таким slug уже существует",
      });
    }

    const place = await prisma.place.create({
      data: {
        slug,
        status: status || "draft",
        coverImage: coverImage || null,
        mapEmbed: mapEmbed || null,
        phone: phone || null,
        instagram: instagram || null,
        telegram: telegram || null,
        website: website || null,
        parking: Boolean(parking),
        wifi: Boolean(wifi),
        booking: Boolean(booking),
        family: Boolean(family),
        terrace: Boolean(terrace),
        photoZone: Boolean(photoZone),
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        prices:
          Array.isArray(prices) && prices.length
            ? {
                create: prices.map(mapPriceCreate),
              }
            : undefined,
        highlights:
          Array.isArray(highlights) && highlights.length
            ? {
                create: highlights.map(mapHighlightCreate),
              }
            : undefined,
        suitableFor:
          Array.isArray(suitableFor) && suitableFor.length
            ? {
                create: suitableFor.map(mapSuitableForCreate),
              }
            : undefined,
      },
      include: placeInclude,
    });

    return res.status(201).json(place);
  } catch (error) {
    console.error("CREATE PLACE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании места",
    });
  }
}

export async function getPlaces(req, res) {
  try {
    const { status, lang } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
        prices: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        highlights: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        suitableFor: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    return res.json(places);
  } catch (error) {
    console.error("GET PLACES ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении мест",
    });
  }
}

export async function getPlaceBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    const place = await prisma.place.findUnique({
      where: { slug },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
        prices: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        highlights: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        suitableFor: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    if (!place) {
      return res.status(404).json({
        message: "Место не найдено",
      });
    }

    return res.json(place);
  } catch (error) {
    console.error("GET PLACE BY SLUG ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении места",
    });
  }
}

export async function updatePlace(req, res) {
  try {
    const placeId = Number(req.params.id);

    if (!placeId) {
      return res.status(400).json({
        message: "Некорректный id места",
      });
    }

    const {
      slug,
      status,
      coverImage,
      mapEmbed,
      phone,
      instagram,
      telegram,
      website,
      parking,
      wifi,
      booking,
      family,
      terrace,
      photoZone,
      translations,
      prices,
      highlights,
      suitableFor,
    } = req.body;

    const existingPlace = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!existingPlace) {
      return res.status(404).json({
        message: "Место не найдено",
      });
    }

    if (slug && slug !== existingPlace.slug) {
      const slugTaken = await prisma.place.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return res.status(409).json({
          message: "Место с таким slug уже существует",
        });
      }
    }

    await prisma.placeTranslation.deleteMany({
      where: { placeId },
    });

    await prisma.placePriceItem.deleteMany({
      where: { placeId },
    });

    await prisma.placeHighlight.deleteMany({
      where: { placeId },
    });

    await prisma.placeSuitableForTag.deleteMany({
      where: { placeId },
    });

    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        slug: slug ?? existingPlace.slug,
        status: status ?? existingPlace.status,
        coverImage: coverImage ?? existingPlace.coverImage,
        mapEmbed: mapEmbed ?? existingPlace.mapEmbed,
        phone: phone ?? existingPlace.phone,
        instagram: instagram ?? existingPlace.instagram,
        telegram: telegram ?? existingPlace.telegram,
        website: website ?? existingPlace.website,
        parking: typeof parking === "boolean" ? parking : existingPlace.parking,
        wifi: typeof wifi === "boolean" ? wifi : existingPlace.wifi,
        booking: typeof booking === "boolean" ? booking : existingPlace.booking,
        family: typeof family === "boolean" ? family : existingPlace.family,
        terrace: typeof terrace === "boolean" ? terrace : existingPlace.terrace,
        photoZone:
          typeof photoZone === "boolean"
            ? photoZone
            : existingPlace.photoZone,
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
        prices:
          Array.isArray(prices) && prices.length
            ? {
                create: prices.map(mapPriceCreate),
              }
            : undefined,
        highlights:
          Array.isArray(highlights) && highlights.length
            ? {
                create: highlights.map(mapHighlightCreate),
              }
            : undefined,
        suitableFor:
          Array.isArray(suitableFor) && suitableFor.length
            ? {
                create: suitableFor.map(mapSuitableForCreate),
              }
            : undefined,
      },
      include: placeInclude,
    });

    return res.json(updatedPlace);
  } catch (error) {
    console.error("UPDATE PLACE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении места",
    });
  }
}

export async function deletePlace(req, res) {
  try {
    const placeId = Number(req.params.id);

    if (!placeId) {
      return res.status(400).json({
        message: "Некорректный id места",
      });
    }

    const existingPlace = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!existingPlace) {
      return res.status(404).json({
        message: "Место не найдено",
      });
    }

    await prisma.place.delete({
      where: { id: placeId },
    });

    return res.json({
      message: "Место удалено",
    });
  } catch (error) {
    console.error("DELETE PLACE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении места",
    });
  }
}