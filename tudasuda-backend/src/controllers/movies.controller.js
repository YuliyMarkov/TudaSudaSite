import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    excerpt: item.excerpt || null,
    description: item.description || null,
    genre: item.genre || null,
    country: item.country || null,
    director: item.director || null,
    seoTitle: item.seoTitle || null,
    seoDescription: item.seoDescription || null,
  };
}

function mapGalleryItemCreate(item) {
  return {
    image: item.image,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapCastItemCreate(item) {
  return {
    locale: item.locale,
    name: item.name,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function mapCalendarDateCreate(item) {
  if (!item?.date) return null;

  const parsed = new Date(item.date);
  if (Number.isNaN(parsed.getTime())) return null;

  return {
    date: parsed,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function normalizeCalendarDates(calendarDates) {
  if (!Array.isArray(calendarDates)) return [];

  return calendarDates.map(mapCalendarDateCreate).filter(Boolean);
}

const movieInclude = {
  translations: true,
  calendarDates: {
    orderBy: [{ date: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
  },
  galleryItems: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
  castItems: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  },
};

async function refreshMovieRatingStats(movieId) {
  const ratings = await prisma.movieRating.findMany({
    where: { movieId },
    select: { value: true },
  });

  const ratingCount = ratings.length;
  const ratingAverage = ratingCount
    ? ratings.reduce((sum, item) => sum + item.value, 0) / ratingCount
    : 0;

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      ratingCount,
      ratingAverage,
    },
  });

  return { ratingCount, ratingAverage };
}

export async function createMovie(req, res) {
  try {
    const {
      slug,
      status,
      isFeatured,
      posterImage,
      coverImage,
      trailerUrl,
      buyTicketsUrl,
      releaseDate,
      durationMinutes,
      ageRating,
      imdbRating,
      kpRating,
      translations,
      calendarDates,
      galleryItems,
      castItems,
    } = req.body;

    if (!slug) {
      return res.status(400).json({ message: "slug обязателен" });
    }

    if (!Array.isArray(translations) || !translations.length) {
      return res.status(400).json({ message: "Нужен хотя бы один перевод" });
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { slug },
    });

    if (existingMovie) {
      return res.status(409).json({
        message: "Фильм с таким slug уже существует",
      });
    }

    const normalizedDates = normalizeCalendarDates(calendarDates);

    const movie = await prisma.movie.create({
      data: {
        slug,
        status: status || "draft",
        isFeatured: Boolean(isFeatured),
        posterImage: posterImage || null,
        coverImage: coverImage || null,
        trailerUrl: trailerUrl || null,
        buyTicketsUrl: buyTicketsUrl || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
        ageRating: ageRating || null,
        imdbRating: imdbRating || null,
        kpRating: kpRating || null,
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        calendarDates: normalizedDates.length
          ? { create: normalizedDates }
          : undefined,
        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? { create: galleryItems.map(mapGalleryItemCreate) }
            : undefined,
        castItems:
          Array.isArray(castItems) && castItems.length
            ? { create: castItems.map(mapCastItemCreate) }
            : undefined,
      },
      include: movieInclude,
    });

    return res.status(201).json(movie);
  } catch (error) {
    console.error("CREATE MOVIE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при создании фильма",
    });
  }
}

export async function getMovies(req, res) {
  try {
    const { status, lang, featured, browserToken } = req.query;

    const where = {};

    if (status) where.status = status;
    if (featured === "true") where.isFeatured = true;

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        translations: lang ? { where: { locale: lang } } : true,
        calendarDates: {
          orderBy: [{ date: "asc" }, { sortOrder: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }],
        },
        castItems: lang
          ? { where: { locale: lang }, orderBy: [{ sortOrder: "asc" }] }
          : { orderBy: [{ sortOrder: "asc" }] },
      },
    });

    if (!browserToken) return res.json(movies);

    const movieIds = movies.map((m) => m.id);

    const ratings = await prisma.movieRating.findMany({
      where: { browserToken, movieId: { in: movieIds } },
      select: { movieId: true, value: true },
    });

    const ratingMap = new Map(ratings.map((r) => [r.movieId, r.value]));

    return res.json(
      movies.map((m) => ({
        ...m,
        userRating: ratingMap.get(m.id) || 0,
      }))
    );
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}

export async function getMovieBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang, browserToken } = req.query;

    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        translations: lang ? { where: { locale: lang } } : true,
        calendarDates: {
          orderBy: [{ date: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }],
        },
        castItems: lang
          ? { where: { locale: lang }, orderBy: [{ sortOrder: "asc" }] }
          : { orderBy: [{ sortOrder: "asc" }] },
      },
    });

    if (!movie) {
      return res.status(404).json({ message: "Фильм не найден" });
    }

    let userRating = 0;

    if (browserToken) {
      const existing = await prisma.movieRating.findUnique({
        where: {
          movieId_browserToken: {
            movieId: movie.id,
            browserToken,
          },
        },
      });

      userRating = existing?.value || 0;
    }

    return res.json({ ...movie, userRating });
  } catch (error) {
    console.error("GET MOVIE ERROR:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}

export async function updateMovie(req, res) {
  try {
    const movieId = Number(req.params.id);

    const {
      slug,
      status,
      isFeatured,
      posterImage,
      coverImage,
      trailerUrl,
      buyTicketsUrl,
      releaseDate,
      durationMinutes,
      ageRating,
      imdbRating,
      kpRating,
      translations,
      calendarDates,
      galleryItems,
      castItems,
    } = req.body;

    await prisma.movieTranslation.deleteMany({ where: { movieId } });
    await prisma.movieCalendarDate.deleteMany({ where: { movieId } });
    await prisma.movieGalleryItem.deleteMany({ where: { movieId } });
    await prisma.movieCastItem.deleteMany({ where: { movieId } });

    const normalizedDates = normalizeCalendarDates(calendarDates);

    const movie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        slug,
        status,
        isFeatured,
        posterImage,
        coverImage,
        trailerUrl,
        buyTicketsUrl,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        durationMinutes: durationMinutes
          ? Number(durationMinutes)
          : null,
        ageRating,
        imdbRating,
        kpRating,
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        calendarDates: normalizedDates.length
          ? { create: normalizedDates }
          : undefined,
        galleryItems:
          galleryItems?.length
            ? { create: galleryItems.map(mapGalleryItemCreate) }
            : undefined,
        castItems:
          castItems?.length
            ? { create: castItems.map(mapCastItemCreate) }
            : undefined,
      },
      include: movieInclude,
    });

    return res.json(movie);
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}

export async function deleteMovie(req, res) {
  try {
    const movieId = Number(req.params.id);

    await prisma.movie.delete({
      where: { id: movieId },
    });

    return res.json({ message: "Фильм удалён" });
  } catch (error) {
    console.error("DELETE MOVIE ERROR:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}

export async function rateMovie(req, res) {
  try {
    const movieId = Number(req.params.id);
    const { browserToken, value } = req.body;

    await prisma.movieRating.upsert({
      where: {
        movieId_browserToken: { movieId, browserToken },
      },
      update: { value },
      create: { movieId, browserToken, value },
    });

    const stats = await refreshMovieRatingStats(movieId);

    return res.json({
      ratingAverage: stats.ratingAverage,
      ratingCount: stats.ratingCount,
      userRating: value,
    });
  } catch (error) {
    console.error("RATE ERROR:", error);
    return res.status(500).json({ message: "Ошибка" });
  }
}