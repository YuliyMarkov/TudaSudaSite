import prisma from "../lib/prisma.js";

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
    } = req.body;

    if (!slug || !type) {
      return res.status(400).json({
        message: "slug и type обязательны",
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
        translations: translations?.length
          ? {
              create: translations.map((item) => ({
                locale: item.locale,
                title: item.title,
                shortDescription: item.shortDescription || null,
                description: item.description || null,
                address: item.address || null,
                ticketPrice: item.ticketPrice || null,
                seoTitle: item.seoTitle || null,
                seoDescription: item.seoDescription || null,
              })),
            }
          : undefined,
        sessions: sessions?.length
          ? {
              create: sessions.map((item) => ({
                startAt: new Date(item.startAt),
                endAt: item.endAt ? new Date(item.endAt) : null,
                price: item.price || null,
                ticketUrl: item.ticketUrl || null,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
        sessions: true,
      },
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
          orderBy: {
            startAt: "asc",
          },
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
          orderBy: {
            startAt: "asc",
          },
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
        translations: translations?.length
          ? {
              create: translations.map((item) => ({
                locale: item.locale,
                title: item.title,
                shortDescription: item.shortDescription || null,
                description: item.description || null,
                address: item.address || null,
                ticketPrice: item.ticketPrice || null,
                seoTitle: item.seoTitle || null,
                seoDescription: item.seoDescription || null,
              })),
            }
          : undefined,
        sessions: sessions?.length
          ? {
              create: sessions.map((item) => ({
                startAt: new Date(item.startAt),
                endAt: item.endAt ? new Date(item.endAt) : null,
                price: item.price || null,
                ticketUrl: item.ticketUrl || null,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
        sessions: {
          orderBy: {
            startAt: "asc",
          },
        },
      },
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