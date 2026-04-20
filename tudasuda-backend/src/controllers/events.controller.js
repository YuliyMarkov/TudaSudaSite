import prisma from "../lib/prisma.js";

function normalizeStatus(status) {
  if (status === "published") return "published";
  if (status === "archived") return "archived";
  return "draft";
}

function normalizeType(type) {
  const allowed = [
    "concert",
    "theatre",
    "exhibition",
    "kids",
    "festival",
    "standup",
    "masterclass",
    "other",
  ];

  return allowed.includes(type) ? type : "other";
}

function normalizeLocale(locale) {
  return locale === "uz" ? "uz" : "ru";
}

function mapTranslationCreate(item = {}) {
  return {
    locale: normalizeLocale(item.locale),
    title: item.title?.trim() || "",
    subtitle: item.subtitle?.trim() || null,
    shortDescription: item.shortDescription?.trim() || null,
    description: item.description?.trim() || null,
    address: item.address?.trim() || null,
    ticketPrice: item.ticketPrice?.trim() || null,
    venue: item.venue?.trim() || null,
    duration: item.duration?.trim() || null,
    ageLimit: item.ageLimit?.trim() || null,
    seoTitle: item.seoTitle?.trim() || null,
    seoDescription: item.seoDescription?.trim() || null,
  };
}

function mapSessionCreate(item = {}) {
  return {
    startAt: new Date(item.startAt),
    endAt: item.endAt ? new Date(item.endAt) : null,
    price: item.price?.trim() || null,
    ticketUrl: item.ticketUrl?.trim() || null,
  };
}

function mapGalleryItemCreate(item = {}) {
  return {
    image: item.image?.trim() || "",
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapProgramItemCreate(item = {}) {
  return {
    locale: normalizeLocale(item.locale),
    value: item.value?.trim() || "",
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapImportantInfoItemCreate(item = {}) {
  return {
    locale: normalizeLocale(item.locale),
    value: item.value?.trim() || "",
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

const eventInclude = {
  translations: {
    orderBy: [{ locale: "asc" }],
  },
  sessions: {
    orderBy: [{ startAt: "asc" }, { id: "asc" }],
  },
  galleryItems: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  programItems: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  importantInfoItems: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
};

export async function createEvent(req, res) {
  try {
    const {
      slug,
      status,
      type,
      isForKids,
      isFeatured,
      coverImage,
      posterImage,
      ticketUrl,
      mapEmbed,
      publishedAt,
      translations,
      sessions,
      galleryItems,
      programItems,
      importantInfoItems,
    } = req.body;

    if (!slug?.trim() || !type) {
      return res.status(400).json({
        message: "slug и type обязательны",
      });
    }

    if (!Array.isArray(translations) || !translations.length) {
      return res.status(400).json({
        message: "Нужен хотя бы один перевод",
      });
    }

    const hasRuTitle = translations.some(
      (item) => normalizeLocale(item.locale) === "ru" && item.title?.trim()
    );

    if (!hasRuTitle) {
      return res.status(400).json({
        message: "Нужен хотя бы русский перевод с title",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingEvent) {
      return res.status(409).json({
        message: "Событие с таким slug уже существует",
      });
    }

    const event = await prisma.event.create({
      data: {
        slug: slug.trim(),
        status: normalizeStatus(status),
        type: normalizeType(type),
        isForKids: Boolean(isForKids),
        isFeatured: Boolean(isFeatured),
        coverImage: coverImage?.trim() || null,
        posterImage: posterImage?.trim() || null,
        ticketUrl: ticketUrl?.trim() || null,
        mapEmbed: mapEmbed?.trim() || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        sessions:
          Array.isArray(sessions) && sessions.length
            ? {
                create: sessions
                  .filter((item) => item.startAt)
                  .map(mapSessionCreate),
              }
            : undefined,
        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? {
                create: galleryItems
                  .filter((item) => item.image)
                  .map(mapGalleryItemCreate),
              }
            : undefined,
        programItems:
          Array.isArray(programItems) && programItems.length
            ? {
                create: programItems
                  .filter((item) => item.value)
                  .map(mapProgramItemCreate),
              }
            : undefined,
        importantInfoItems:
          Array.isArray(importantInfoItems) && importantInfoItems.length
            ? {
                create: importantInfoItems
                  .filter((item) => item.value)
                  .map(mapImportantInfoItemCreate),
              }
            : undefined,
      },
      include: eventInclude,
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании события",
    });
  }
}

export async function getEvents(req, res) {
  try {
    const { status, type, lang, admin, featured } = req.query;

    const where = {};

    if (admin === "true") {
      if (status) {
        where.status = normalizeStatus(status);
      }
    } else {
      where.status = "published";
    }

    if (type) {
      where.type = normalizeType(type);
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        translations: lang
          ? {
              where: { locale: normalizeLocale(lang) },
            }
          : {
              orderBy: [{ locale: "asc" }],
            },
        sessions: {
          orderBy: [{ startAt: "asc" }, { id: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
        programItems: lang
          ? {
              where: { locale: normalizeLocale(lang) },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        importantInfoItems: lang
          ? {
              where: { locale: normalizeLocale(lang) },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    return res.json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении событий",
    });
  }
}

export async function getEventById(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId || Number.isNaN(eventId)) {
      return res.status(400).json({
        message: "Некорректный id события",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: eventInclude,
    });

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    return res.json(event);
  } catch (error) {
    console.error("GET EVENT BY ID ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении события",
    });
  }
}

export async function getEventBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: "published",
      },
      include: {
        translations: lang
          ? {
              where: { locale: normalizeLocale(lang) },
            }
          : {
              orderBy: [{ locale: "asc" }],
            },
        sessions: {
          orderBy: [{ startAt: "asc" }, { id: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
        programItems: lang
          ? {
              where: { locale: normalizeLocale(lang) },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        importantInfoItems: lang
          ? {
              where: { locale: normalizeLocale(lang) },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    return res.json(event);
  } catch (error) {
    console.error("GET EVENT BY SLUG ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении события",
    });
  }
}

export async function updateEvent(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId || Number.isNaN(eventId)) {
      return res.status(400).json({
        message: "Некорректный id события",
      });
    }

    const {
      slug,
      status,
      type,
      isForKids,
      isFeatured,
      coverImage,
      posterImage,
      ticketUrl,
      mapEmbed,
      publishedAt,
      translations,
      sessions,
      galleryItems,
      programItems,
      importantInfoItems,
    } = req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: eventInclude,
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    if (slug && slug.trim() !== existingEvent.slug) {
      const slugTaken = await prisma.event.findUnique({
        where: { slug: slug.trim() },
      });

      if (slugTaken) {
        return res.status(409).json({
          message: "Событие с таким slug уже существует",
        });
      }
    }

    await prisma.eventTranslation.deleteMany({
      where: { eventId },
    });

    await prisma.eventSession.deleteMany({
      where: { eventId },
    });

    await prisma.eventGalleryItem.deleteMany({
      where: { eventId },
    });

    await prisma.eventProgramItem.deleteMany({
      where: { eventId },
    });

    await prisma.eventImportantInfoItem.deleteMany({
      where: { eventId },
    });

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        slug: slug !== undefined ? slug.trim() : existingEvent.slug,
        status: status !== undefined ? normalizeStatus(status) : existingEvent.status,
        type: type !== undefined ? normalizeType(type) : existingEvent.type,
        isForKids:
          typeof isForKids === "boolean" ? isForKids : existingEvent.isForKids,
        isFeatured:
          typeof isFeatured === "boolean"
            ? isFeatured
            : existingEvent.isFeatured,
        coverImage:
          coverImage !== undefined
            ? coverImage?.trim() || null
            : existingEvent.coverImage,
        posterImage:
          posterImage !== undefined
            ? posterImage?.trim() || null
            : existingEvent.posterImage,
        ticketUrl:
          ticketUrl !== undefined
            ? ticketUrl?.trim() || null
            : existingEvent.ticketUrl,
        mapEmbed:
          mapEmbed !== undefined
            ? mapEmbed?.trim() || null
            : existingEvent.mapEmbed,
        publishedAt:
          publishedAt !== undefined
            ? publishedAt
              ? new Date(publishedAt)
              : null
            : existingEvent.publishedAt,

        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,

        sessions:
          Array.isArray(sessions) && sessions.length
            ? {
                create: sessions
                  .filter((item) => item.startAt)
                  .map(mapSessionCreate),
              }
            : undefined,

        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? {
                create: galleryItems
                  .filter((item) => item.image)
                  .map(mapGalleryItemCreate),
              }
            : undefined,

        programItems:
          Array.isArray(programItems) && programItems.length
            ? {
                create: programItems
                  .filter((item) => item.value)
                  .map(mapProgramItemCreate),
              }
            : undefined,

        importantInfoItems:
          Array.isArray(importantInfoItems) && importantInfoItems.length
            ? {
                create: importantInfoItems
                  .filter((item) => item.value)
                  .map(mapImportantInfoItemCreate),
              }
            : undefined,
      },
      include: eventInclude,
    });

    return res.json(updatedEvent);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении события",
    });
  }
}

export async function deleteEvent(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId || Number.isNaN(eventId)) {
      return res.status(400).json({
        message: "Некорректный id события",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return res.json({
      message: "Событие удалено",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении события",
    });
  }
}