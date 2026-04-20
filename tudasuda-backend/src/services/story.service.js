// src/services/story.service.js
import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeLocale(locale) {
  return locale === "uz" ? "uz" : "ru";
}

function normalizeStatus(status) {
  if (status === "published") return PublishStatus.published;
  if (status === "archived") return PublishStatus.archived;
  return PublishStatus.draft;
}

function buildStoryResponse(story, locale = "ru") {
  const currentLocale = normalizeLocale(locale);

  const translation =
    story.translations?.find((item) => item.locale === currentLocale) ||
    story.translations?.find((item) => item.locale === "ru") ||
    story.translations?.[0] ||
    null;

  return {
    id: story.id,
    slug: story.slug,
    status: story.status,
    type: story.type,
    isFeatured: story.isFeatured,
    coverImage: story.coverImage,
    publishedAt: story.publishedAt,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
    title: translation?.title || "",
    excerpt: translation?.excerpt || "",
    content: translation?.content || "",
    seoTitle: translation?.seoTitle || "",
    seoDescription: translation?.seoDescription || "",
    translations: story.translations || [],
  };
}

export async function getStories({ lang = "ru", status, featuredOnly = false }) {
  const locale = normalizeLocale(lang);

  const where = {};

  if (status) {
    where.status = normalizeStatus(status);
  } else {
    where.status = PublishStatus.published;
  }

  if (featuredOnly) {
    where.isFeatured = true;
  }

  const stories = await prisma.story.findMany({
    where,
    include: {
      translations: true,
    },
    orderBy: [
      { isFeatured: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return stories.map((story) => buildStoryResponse(story, locale));
}

export async function getStoryBySlug(slug, lang = "ru") {
  const locale = normalizeLocale(lang);

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      translations: true,
    },
  });

  if (!story) {
    return null;
  }

  return buildStoryResponse(story, locale);
}

function buildTranslationInput(translation = {}) {
  return {
    title: translation.title?.trim() || "",
    excerpt: translation.excerpt?.trim() || null,
    content: translation.content?.trim() || null,
    seoTitle: translation.seoTitle?.trim() || null,
    seoDescription: translation.seoDescription?.trim() || null,
  };
}

export async function createStory(payload) {
  const {
    slug,
    status = "draft",
    type = "news",
    isFeatured = false,
    coverImage = null,
    publishedAt = null,
    translations = {},
  } = payload;

  if (!slug?.trim()) {
    throw new Error("Slug is required");
  }

  if (!translations.ru?.title?.trim()) {
    throw new Error("Russian title is required");
  }

  const createdStory = await prisma.story.create({
    data: {
      slug: slug.trim(),
      status: normalizeStatus(status),
      type: type?.trim() || "news",
      isFeatured: Boolean(isFeatured),
      coverImage: coverImage?.trim() || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      translations: {
        create: [
          {
            locale: "ru",
            ...buildTranslationInput(translations.ru),
          },
          {
            locale: "uz",
            ...buildTranslationInput(translations.uz || {}),
          },
        ],
      },
    },
    include: {
      translations: true,
    },
  });

  return buildStoryResponse(createdStory, "ru");
}

export async function updateStory(id, payload) {
  const storyId = Number(id);

  if (!storyId || Number.isNaN(storyId)) {
    throw new Error("Invalid story id");
  }

  const existingStory = await prisma.story.findUnique({
    where: { id: storyId },
    include: { translations: true },
  });

  if (!existingStory) {
    return null;
  }

  const {
    slug,
    status,
    type,
    isFeatured,
    coverImage,
    publishedAt,
    translations = {},
  } = payload;

  await prisma.story.update({
    where: { id: storyId },
    data: {
      ...(slug !== undefined ? { slug: slug?.trim() || existingStory.slug } : {}),
      ...(status !== undefined ? { status: normalizeStatus(status) } : {}),
      ...(type !== undefined ? { type: type?.trim() || existingStory.type } : {}),
      ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
      ...(coverImage !== undefined
        ? { coverImage: coverImage?.trim() || null }
        : {}),
      ...(publishedAt !== undefined
        ? { publishedAt: publishedAt ? new Date(publishedAt) : null }
        : {}),
    },
  });

  if (translations.ru) {
    await prisma.storyTranslation.upsert({
      where: {
        storyId_locale: {
          storyId,
          locale: "ru",
        },
      },
      update: buildTranslationInput(translations.ru),
      create: {
        storyId,
        locale: "ru",
        ...buildTranslationInput(translations.ru),
      },
    });
  }

  if (translations.uz) {
    await prisma.storyTranslation.upsert({
      where: {
        storyId_locale: {
          storyId,
          locale: "uz",
        },
      },
      update: buildTranslationInput(translations.uz),
      create: {
        storyId,
        locale: "uz",
        ...buildTranslationInput(translations.uz),
      },
    });
  }

  const updatedStory = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      translations: true,
    },
  });

  return buildStoryResponse(updatedStory, "ru");
}