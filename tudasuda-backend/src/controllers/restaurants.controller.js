import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    type: item.type || null,
    cuisine: item.cuisine || null,
    address: item.address || null,
    workingHours: item.workingHours || null,
    averageCheck: item.averageCheck || null,
    description: item.description || null,
    atmosphere: item.atmosphere || null,
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

function mapDishCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    image: item.image || null,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapFormatCreate(item) {
  return {
    locale: item.locale,
    value: item.value,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

const restaurantInclude = {
  translations: true,
  prices: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  dishes: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  formats: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
};

export async function createRestaurant(req, res) {
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
      delivery,
      smoking,
      terrace,
      music,
      translations,
      prices,
      dishes,
      formats,
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

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existingRestaurant) {
      return res.status(409).json({
        message: "Ресторан с таким slug уже существует",
      });
    }

    const restaurant = await prisma.restaurant.create({
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
        delivery: Boolean(delivery),
        smoking: Boolean(smoking),
        terrace: Boolean(terrace),
        music: Boolean(music),
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        prices: Array.isArray(prices) && prices.length
          ? {
              create: prices.map(mapPriceCreate),
            }
          : undefined,
        dishes: Array.isArray(dishes) && dishes.length
          ? {
              create: dishes.map(mapDishCreate),
            }
          : undefined,
        formats: Array.isArray(formats) && formats.length
          ? {
              create: formats.map(mapFormatCreate),
            }
          : undefined,
      },
      include: restaurantInclude,
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    console.error("CREATE RESTAURANT ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании ресторана",
    });
  }
}

export async function getRestaurants(req, res) {
  try {
    const { status, lang } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    const restaurants = await prisma.restaurant.findMany({
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
        dishes: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        formats: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    return res.json(restaurants);
  } catch (error) {
    console.error("GET RESTAURANTS ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении ресторанов",
    });
  }
}

export async function getRestaurantBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    const restaurant = await prisma.restaurant.findUnique({
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
        dishes: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        formats: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Ресторан не найден",
      });
    }

    return res.json(restaurant);
  } catch (error) {
    console.error("GET RESTAURANT BY SLUG ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении ресторана",
    });
  }
}

export async function updateRestaurant(req, res) {
  try {
    const restaurantId = Number(req.params.id);

    if (!restaurantId) {
      return res.status(400).json({
        message: "Некорректный id ресторана",
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
      delivery,
      smoking,
      terrace,
      music,
      translations,
      prices,
      dishes,
      formats,
    } = req.body;

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Ресторан не найден",
      });
    }

    if (slug && slug !== existingRestaurant.slug) {
      const slugTaken = await prisma.restaurant.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return res.status(409).json({
          message: "Ресторан с таким slug уже существует",
        });
      }
    }

    await prisma.restaurantTranslation.deleteMany({
      where: { restaurantId },
    });

    await prisma.restaurantPriceItem.deleteMany({
      where: { restaurantId },
    });

    await prisma.restaurantDish.deleteMany({
      where: { restaurantId },
    });

    await prisma.restaurantFormatTag.deleteMany({
      where: { restaurantId },
    });

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        slug: slug ?? existingRestaurant.slug,
        status: status ?? existingRestaurant.status,
        coverImage: coverImage ?? existingRestaurant.coverImage,
        mapEmbed: mapEmbed ?? existingRestaurant.mapEmbed,
        phone: phone ?? existingRestaurant.phone,
        instagram: instagram ?? existingRestaurant.instagram,
        telegram: telegram ?? existingRestaurant.telegram,
        website: website ?? existingRestaurant.website,
        parking: typeof parking === "boolean" ? parking : existingRestaurant.parking,
        wifi: typeof wifi === "boolean" ? wifi : existingRestaurant.wifi,
        booking: typeof booking === "boolean" ? booking : existingRestaurant.booking,
        delivery: typeof delivery === "boolean" ? delivery : existingRestaurant.delivery,
        smoking: typeof smoking === "boolean" ? smoking : existingRestaurant.smoking,
        terrace: typeof terrace === "boolean" ? terrace : existingRestaurant.terrace,
        music: typeof music === "boolean" ? music : existingRestaurant.music,
        translations: Array.isArray(translations) && translations.length
          ? {
              create: translations.map(mapTranslationCreate),
            }
          : undefined,
        prices: Array.isArray(prices) && prices.length
          ? {
              create: prices.map(mapPriceCreate),
            }
          : undefined,
        dishes: Array.isArray(dishes) && dishes.length
          ? {
              create: dishes.map(mapDishCreate),
            }
          : undefined,
        formats: Array.isArray(formats) && formats.length
          ? {
              create: formats.map(mapFormatCreate),
            }
          : undefined,
      },
      include: restaurantInclude,
    });

    return res.json(updatedRestaurant);
  } catch (error) {
    console.error("UPDATE RESTAURANT ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении ресторана",
    });
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const restaurantId = Number(req.params.id);

    if (!restaurantId) {
      return res.status(400).json({
        message: "Некорректный id ресторана",
      });
    }

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Ресторан не найден",
      });
    }

    await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return res.json({
      message: "Ресторан удалён",
    });
  } catch (error) {
    console.error("DELETE RESTAURANT ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении ресторана",
    });
  }
}