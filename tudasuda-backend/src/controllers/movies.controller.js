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

function buildSessionStartAt(item) {
  if (item.startAt) {
    const parsed = new Date(item.startAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (item.sessionDate && item.sessionTime) {
    const parsed = new Date(`${item.sessionDate}T${item.sessionTime}:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function mapSessionCreate(item) {
  const startAt = buildSessionStartAt(item);

  if (!startAt) {
    return null;
  }

  return {
    startAt,
    cinemaName: item.cinemaName,
    hallName: item.hallName || null,
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

function mapCastItemCreate(item) {
  return {
    locale: item.locale,
    name: item.name,
    sortOrder: Number(item.sortOrder ?? 0),
  };
}

function normalizeSessions(sessions) {
  if (!Array.isArray(sessions) || !sessions.length) {
    return [];
  }

  return sessions
    .map(mapSessionCreate)
    .filter((item) => item && item.cinemaName);
}

const movieInclude = {
  translations: true,
  sessions: {
    orderBy: [{ startAt: "asc" }, { cinemaName: "asc" }, { id: "asc" }],
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

  return {
    ratingCount,
    ratingAverage,
  };
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
      releaseDate,
      durationMinutes,
      ageRating,
      imdbRating,
      kpRating,
      translations,
      sessions,
      galleryItems,
      castItems,
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

    const existingMovie = await prisma.movie.findUnique({
      where: { slug },
    });

    if (existingMovie) {
      return res.status(409).json({
        message: "Фильм с таким slug уже существует",
      });
    }

    const normalizedSessions = normalizeSessions(sessions);

    const movie = await prisma.movie.create({
      data: {
        slug,
        status: status || "draft",
        isFeatured: Boolean(isFeatured),
        posterImage: posterImage || null,
        coverImage: coverImage || null,
        trailerUrl: trailerUrl || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
        ageRating: ageRating || null,
        imdbRating: imdbRating || null,
        kpRating: kpRating || null,
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        sessions: normalizedSessions.length
          ? {
              create: normalizedSessions,
            }
          : undefined,
        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? {
                create: galleryItems.map(mapGalleryItemCreate),
              }
            : undefined,
        castItems:
          Array.isArray(castItems) && castItems.length
            ? {
                create: castItems.map(mapCastItemCreate),
              }
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

    if (status) {
      where.status = status;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const movies = await prisma.movie.findMany({
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
          orderBy: [{ startAt: "asc" }, { cinemaName: "asc" }, { id: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
        castItems: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    if (!browserToken || typeof browserToken !== "string") {
      return res.json(movies);
    }

    const movieIds = movies.map((movie) => movie.id);

    const ratings = await prisma.movieRating.findMany({
      where: {
        browserToken,
        movieId: { in: movieIds },
      },
      select: {
        movieId: true,
        value: true,
      },
    });

    const ratingMap = new Map(ratings.map((item) => [item.movieId, item.value]));

    const result = movies.map((movie) => ({
      ...movie,
      userRating: ratingMap.get(movie.id) || 0,
    }));

    return res.json(result);
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении фильмов",
    });
  }
}

export async function getMovieBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { lang, browserToken } = req.query;

    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        translations: lang
          ? {
              where: { locale: lang },
            }
          : true,
        sessions: {
          orderBy: [{ startAt: "asc" }, { cinemaName: "asc" }, { id: "asc" }],
        },
        galleryItems: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
        castItems: lang
          ? {
              where: { locale: lang },
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            }
          : {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            },
      },
    });

    if (!movie) {
      return res.status(404).json({
        message: "Фильм не найден",
      });
    }

    let userRating = 0;

    if (browserToken && typeof browserToken === "string") {
      const existingRating = await prisma.movieRating.findUnique({
        where: {
          movieId_browserToken: {
            movieId: movie.id,
            browserToken,
          },
        },
      });

      userRating = existingRating?.value || 0;
    }

    return res.json({
      ...movie,
      userRating,
    });
  } catch (error) {
    console.error("GET MOVIE BY SLUG ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении фильма",
    });
  }
}

export async function updateMovie(req, res) {
  try {
    const movieId = Number(req.params.id);

    if (!movieId) {
      return res.status(400).json({
        message: "Некорректный id фильма",
      });
    }

    const {
      slug,
      status,
      isFeatured,
      posterImage,
      coverImage,
      trailerUrl,
      releaseDate,
      durationMinutes,
      ageRating,
      imdbRating,
      kpRating,
      translations,
      sessions,
      galleryItems,
      castItems,
    } = req.body;

    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      return res.status(404).json({
        message: "Фильм не найден",
      });
    }

    if (slug && slug !== existingMovie.slug) {
      const slugTaken = await prisma.movie.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return res.status(409).json({
          message: "Фильм с таким slug уже существует",
        });
      }
    }

    await prisma.movieTranslation.deleteMany({
      where: { movieId },
    });

    await prisma.movieSession.deleteMany({
      where: { movieId },
    });

    await prisma.movieGalleryItem.deleteMany({
      where: { movieId },
    });

    await prisma.movieCastItem.deleteMany({
      where: { movieId },
    });

    const normalizedSessions = normalizeSessions(sessions);

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        slug: slug ?? existingMovie.slug,
        status: status ?? existingMovie.status,
        isFeatured:
          typeof isFeatured === "boolean"
            ? isFeatured
            : existingMovie.isFeatured,
        posterImage: posterImage ?? existingMovie.posterImage,
        coverImage: coverImage ?? existingMovie.coverImage,
        trailerUrl: trailerUrl ?? existingMovie.trailerUrl,
        releaseDate:
          releaseDate !== undefined
            ? releaseDate
              ? new Date(releaseDate)
              : null
            : existingMovie.releaseDate,
        durationMinutes:
          durationMinutes !== undefined
            ? durationMinutes
              ? Number(durationMinutes)
              : null
            : existingMovie.durationMinutes,
        ageRating: ageRating ?? existingMovie.ageRating,
        imdbRating: imdbRating ?? existingMovie.imdbRating,
        kpRating: kpRating ?? existingMovie.kpRating,
        translations:
          Array.isArray(translations) && translations.length
            ? {
                create: translations.map(mapTranslationCreate),
              }
            : undefined,
        sessions: normalizedSessions.length
          ? {
              create: normalizedSessions,
            }
          : undefined,
        galleryItems:
          Array.isArray(galleryItems) && galleryItems.length
            ? {
                create: galleryItems.map(mapGalleryItemCreate),
              }
            : undefined,
        castItems:
          Array.isArray(castItems) && castItems.length
            ? {
                create: castItems.map(mapCastItemCreate),
              }
            : undefined,
      },
      include: movieInclude,
    });

    return res.json(updatedMovie);
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при обновлении фильма",
    });
  }
}

export async function deleteMovie(req, res) {
  try {
    const movieId = Number(req.params.id);

    if (!movieId) {
      return res.status(400).json({
        message: "Некорректный id фильма",
      });
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      return res.status(404).json({
        message: "Фильм не найден",
      });
    }

    await prisma.movie.delete({
      where: { id: movieId },
    });

    return res.json({
      message: "Фильм удалён",
    });
  } catch (error) {
    console.error("DELETE MOVIE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при удалении фильма",
    });
  }
}

export async function rateMovie(req, res) {
  try {
    const movieId = Number(req.params.id);
    const { browserToken, value } = req.body;

    if (!movieId) {
      return res.status(400).json({
        message: "Некорректный id фильма",
      });
    }

    if (!browserToken || typeof browserToken !== "string") {
      return res.status(400).json({
        message: "browserToken обязателен",
      });
    }

    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 5) {
      return res.status(400).json({
        message: "Оценка должна быть целым числом от 1 до 5",
      });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).json({
        message: "Фильм не найден",
      });
    }

    await prisma.movieRating.upsert({
      where: {
        movieId_browserToken: {
          movieId,
          browserToken,
        },
      },
      update: {
        value: numericValue,
      },
      create: {
        movieId,
        browserToken,
        value: numericValue,
      },
    });

    const stats = await refreshMovieRatingStats(movieId);

    return res.json({
      message: "Оценка сохранена",
      ratingAverage: stats.ratingAverage,
      ratingCount: stats.ratingCount,
      userRating: numericValue,
    });
  } catch (error) {
    console.error("RATE MOVIE ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сервера при сохранении оценки",
    });
  }
}