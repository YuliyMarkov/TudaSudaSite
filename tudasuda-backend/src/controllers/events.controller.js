import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    shortDescription: item.shortDescription || null,
    description: item.description || null,
    address: item.address || null,
    ticketPrice: item.ticketPrice || null,
    venue: item.venue || null,
    duration: item.duration || null,
    ageLimit: item.ageLimit || null,
    seoTitle: item.seoTitle || null,
    seoDescription: item.seoDescription || null,
  };
}

function mapSessionCreate(item) {
  return {
    startAt: new Date(item.startAt),
    endAt: item.endAt ? new Date(item.endAt) : null,
    price: item.price || null,
    ticketUrl: item.ticketUrl || null,
  };
}

function mapGalleryItemCreate(item) {
  return {
    image: item.image,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapProgramItemCreate(item) {
  return {
    locale: item.locale,
    value: item.value,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapImportantInfoItemCreate(item) {
  return {
    locale: item.locale,
    value: item.value,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

const eventInclude = {
  translations: true,
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
      coverImage,
      ticketUrl,
      mapEmbed,
      translations,
      sessions,
      galleryItems,
      programItems,
      importantInfoItems,
    } = req.body;

    if (!slug || !type) {
      return res.status(400).json({
        message: "slug и type обязательны",
      });
    }

    if (!Array.isArray(translations) || !translations.length) {
      return res.status(400).json({
        message: "Нужен хотя бы один перевод",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      return res.status(409).json({
        message: "Событие с таким slug уже существует",
      });
    }

    const event = await prisma.event.create({
      data: {
        slug,
        status: status || "draft",
        type,
        isForKids: Boolean(isForKids),
        coverImage: coverImage || null,
        ticketUrl: ticketUrl || null,
        mapEmbed: mapEmbed || null,
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        sessions:
          Array.isArray(sessions) && sessions.length
            ? {
                create: sessions.map(mapSessionCreate),
              }
            : undefined,
        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? {
                create: galleryItems.map(mapGalleryItemCreate),
              }
            : undefined,
        programItems:
          Array.isArray(programItems) && programItems.length
            ? {
                create: programItems.map(mapProgramItemCreate),
              }
            : undefined,
        importantInfoItems:
          Array.isArray(importantInfoItems) && importantInfoItems.length
            ? {
                create: importantInfoItems.map(mapImportantInfoItemCreate),
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
    const { status, type, lang } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const events = await prisma.event.findMany({
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
        sessions: {
          orderBy: [{ startAt: "asc" }, { id: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
        programItems: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        importantInfoItems: lang
          ? {
              where: { locale: lang },
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

export async function getEventBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
        sessions: {
          orderBy: [{ startAt: "asc" }, { id: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
        programItems: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
        importantInfoItems: lang
          ? {
              where: { locale: lang },
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

    if (!eventId) {
      return res.status(400).json({
        message: "Некорректный id события",
      });
    }

    const {
      slug,
      status,
      type,
      isForKids,
      coverImage,
      ticketUrl,
      mapEmbed,
      translations,
      sessions,
      galleryItems,
      programItems,
      importantInfoItems,
    } = req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    if (slug && slug !== existingEvent.slug) {
      const slugTaken = await prisma.event.findUnique({
        where: { slug },
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
        slug: slug ?? existingEvent.slug,
        status: status ?? existingEvent.status,
        type: type ?? existingEvent.type,
        isForKids:
          typeof isForKids === "boolean"
            ? isForKids
            : existingEvent.isForKids,
        coverImage: coverImage ?? existingEvent.coverImage,
        ticketUrl: ticketUrl ?? existingEvent.ticketUrl,
        mapEmbed: mapEmbed ?? existingEvent.mapEmbed,
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
        sessions:
          Array.isArray(sessions) && sessions.length
            ? {
                create: sessions.map(mapSessionCreate),
              }
            : undefined,
        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? {
                create: galleryItems.map(mapGalleryItemCreate),
              }
            : undefined,
        programItems:
          Array.isArray(programItems) && programItems.length
            ? {
                create: programItems.map(mapProgramItemCreate),
              }
            : undefined,
        importantInfoItems:
          Array.isArray(importantInfoItems) && importantInfoItems.length
            ? {
                create: importantInfoItems.map(mapImportantInfoItemCreate),
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

    if (!eventId) {
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