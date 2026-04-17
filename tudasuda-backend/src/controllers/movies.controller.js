import prisma from "../lib/prisma.js";

function mapTranslationCreate(item) {
  return {
    locale: item.locale,
    title: item.title,
    excerpt: item.excerpt || null,
    description: item.description || null,
    genre: item.genre || null,
    country: item.country || null,
    seoTitle: item.seoTitle || null,
    seoDescription: item.seoDescription || null,
  };
}

function mapSessionCreate(item) {
  return {
    startAt: new Date(item.startAt),
    endAt: item.endAt ? new Date(item.endAt) : null,
    hallName: item.hallName || null,
    price: item.price || null,
    ticketUrl: item.ticketUrl || null,
  };
}

const movieInclude = {
  translations: true,
  sessions: {
    orderBy: [{ startAt: "asc" }, { id: "asc" }],
  },
};

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
      translations,
      sessions,
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
        translations: {
          create: translations.map(mapTranslationCreate),
        },
        sessions:
          Array.isArray(sessions) && sessions.length
            ? {
                create: sessions.map(mapSessionCreate),
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
    const { status, lang, featured } = req.query;

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
          orderBy: [{ startAt: "asc" }, { id: "asc" }],
        },
      },
    });

    return res.json(movies);
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
    const { lang } = req.query;

    const movie = await prisma.movie.findUnique({
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
      },
    });

    if (!movie) {
      return res.status(404).json({
        message: "Фильм не найден",
      });
    }

    return res.json(movie);
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
      translations,
      sessions,
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
            ? (releaseDate ? new Date(releaseDate) : null)
            : existingMovie.releaseDate,
        durationMinutes:
          durationMinutes !== undefined
            ? (durationMinutes ? Number(durationMinutes) : null)
            : existingMovie.durationMinutes,
        ageRating: ageRating ?? existingMovie.ageRating,
        imdbRating: imdbRating ?? existingMovie.imdbRating,
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