import prisma from "../lib/prisma.js";

export async function getCalendarItems(req, res) {
  try {
    const {
      from,
      to,
      lang = "ru",
      type,
      kids,
      limit,
    } = req.query;

    const sessionWhere = {};
    const eventWhere = {
      status: "published",
    };

    if (from || to) {
      sessionWhere.startAt = {};
    }

    if (from) {
      const fromDate = new Date(from);
      if (!Number.isNaN(fromDate.getTime())) {
        sessionWhere.startAt.gte = fromDate;
      }
    }

    if (to) {
      const toDate = new Date(to);
      if (!Number.isNaN(toDate.getTime())) {
        sessionWhere.startAt.lte = toDate;
      }
    }

    if (type) {
      eventWhere.type = type;
    }

    if (kids === "true") {
      eventWhere.isForKids = true;
    }

    const parsedLimit = limit ? Number(limit) : undefined;

    const sessions = await prisma.eventSession.findMany({
      where: {
        ...sessionWhere,
        event: eventWhere,
      },
      orderBy: {
        startAt: "asc",
      },
      take:
        parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0
          ? parsedLimit
          : undefined,
      include: {
        event: {
          include: {
            translations: {
              where: { locale: lang },
              take: 1,
            },
          },
        },
      },
    });

    const items = sessions.map((session) => {
      const translation = session.event.translations?.[0] || null;

      return {
        sessionId: session.id,
        eventId: session.event.id,
        slug: session.event.slug,
        status: session.event.status,
        type: session.event.type,
        isForKids: session.event.isForKids,
        coverImage: session.event.coverImage,
        eventTicketUrl: session.event.ticketUrl,
        mapEmbed: session.event.mapEmbed,

        title: translation?.title || null,
        shortDescription: translation?.shortDescription || null,
        description: translation?.description || null,
        address: translation?.address || null,
        ticketPrice: translation?.ticketPrice || null,
        seoTitle: translation?.seoTitle || null,
        seoDescription: translation?.seoDescription || null,

        startAt: session.startAt,
        endAt: session.endAt,
        sessionPrice: session.price,
        sessionTicketUrl: session.ticketUrl,
        createdAt: session.createdAt,
      };
    });

    return res.json(items);
  } catch (error) {
    console.error("GET CALENDAR ITEMS ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении календаря",
    });
  }
}