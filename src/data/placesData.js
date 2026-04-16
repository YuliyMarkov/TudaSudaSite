const t = (ru, uz = "") => ({ ru, uz });

export const placesData = [
  {
    slug: "magic-city",

    title: t("Magic City", "Magic City"),

    type: t("Парк", "Park"),

    category: t("Развлекательное пространство", "Ko‘ngilochar maskan"),

    cover: "/Photos-for-Site/Cirk.webp",

    address: t("Ташкент, улица Бабура", "Toshkent, Bobur ko‘chasi"),

    mapEmbed:
      "https://yandex.uz/map-widget/v1/?ll=69.240000,41.290000&z=15",

    workingHours: t(
      "Ежедневно, 10:00–23:00",
      "Har kuni, 10:00–23:00"
    ),

    phone: "+998 71 123 45 67",

    contacts: {
      instagram: "https://instagram.com/magiccity.uz",
      telegram: "https://t.me/magiccityuz",
      website: "https://magiccity.uz",
    },

    priceLabel: t("от 50 000 сум", "50 000 so‘mdan"),

    prices: [
      t("Вход — от 50 000 сум", "Kirish — 50 000 so‘mdan"),
      t("Аттракционы — от 20 000 сум", "Attraksionlar — 20 000 so‘mdan"),
    ],

    description: t(
      "Один из самых популярных парков в Ташкенте с аттракционами, прогулочными зонами и вечерней атмосферой.",
      "Toshkentdagi eng mashhur parklaridan biri — attraksionlar, sayr zonalari va kechki atmosfera bilan."
    ),

    highlights: [
      {
        title: t("Фонтан и вечерняя подсветка", "Favvora va kechki yoritish"),
        image: "/Photos-for-Site/Planetariy.webp",
      },
      {
        title: t("Прогулочные аллеи", "Sayr yo‘laklari"),
        image: "/Photos-for-Site/Vystavka.webp",
      },
    ],

    suitableFor: {
      ru: ["Семья", "Свидание", "Прогулка"],
      uz: ["Oila", "Uchrashuv", "Sayr"],
    },

    features: t(
      "Главный плюс — атмосфера и большое количество зон для отдыха.",
      "Asosiy afzalligi — atmosfera va dam olish uchun ko‘plab zonalar."
    ),

    extras: {
      terrace: true,
      photoZone: true,
    },

    amenities: {
      parking: true,
      wifi: true,
      booking: false,
      family: true,
    },

    mustVisit: t(
      "Идеально для вечернего выхода и прогулки.",
      "Kechki sayr uchun ideal joy."
    ),
  },

  {
    slug: "tashkent-city-park",

    title: t("Tashkent City Park", "Tashkent City Park"),

    type: t("Парк", "Park"),

    category: t("Городское пространство", "Shahar makoni"),

    cover: "/Photos-for-Site/Planetariy.webp",

    address: t("Ташкент, Tashkent City", "Toshkent, Tashkent City"),

    mapEmbed:
      "https://yandex.uz/map-widget/v1/?ll=69.245000,41.310000&z=15",

    workingHours: t("Круглосуточно", "24/7"),

    phone: null,

    contacts: {
      instagram: "https://instagram.com/tashkentcity",
    },

    priceLabel: t("Бесплатно", "Bepul"),

    prices: [t("Вход — бесплатно", "Kirish — bepul")],

    description: t(
      "Современный парк с озером, прогулочными зонами и одной из лучших вечерних атмосфер в городе.",
      "Ko‘l, sayr zonalari va shaharning eng yaxshi kechki atmosferalaridan biri bo‘lgan zamonaviy park."
    ),

    highlights: [
      {
        title: t("Озеро", "Ko‘l"),
        image: "/Photos-for-Site/VanGog.webp",
      },
      {
        title: t("Вечерний вайб", "Kechki vibe"),
        image: "/Photos-for-Site/Gagagoy.webp",
      },
    ],

    suitableFor: {
      ru: ["Прогулка", "Фото", "Свидание"],
      uz: ["Sayr", "Foto", "Uchrashuv"],
    },

    features: t(
      "Минималистичный дизайн и ощущение современного города.",
      "Minimalistik dizayn va zamonaviy shahar hissi."
    ),

    extras: {
      terrace: true,
      photoZone: true,
    },

    amenities: {
      parking: true,
      wifi: false,
      booking: false,
      family: true,
    },

    mustVisit: t(
      "Лучшее место для прогулки в центре города.",
      "Shahar markazida sayr uchun eng yaxshi joy."
    ),
  },

  {
    slug: "japanese-garden",

    title: t("Японский сад", "Yapon bog‘i"),

    type: t("Сад", "Bog‘"),

    category: t("Спокойное место", "Sokin joy"),

    cover: "/Photos-for-Site/Vystavka.webp",

    address: t("Ташкент, Юнусабад", "Toshkent, Yunusobod"),

    mapEmbed:
      "https://yandex.uz/map-widget/v1/?ll=69.290000,41.340000&z=15",

    workingHours: t("09:00–21:00", "09:00–21:00"),

    phone: null,

    contacts: {
      instagram: "https://instagram.com/",
    },

    priceLabel: t("от 20 000 сум", "20 000 so‘mdan"),

    prices: [t("Вход — от 20 000 сум", "Kirish — 20 000 so‘mdan")],

    description: t(
      "Один из самых спокойных парков города с атмосферой уединения.",
      "Shahardagi eng sokin bog‘lardan biri."
    ),

    highlights: [
      {
        title: t("Пруд и мосты", "Hovuz va ko‘priklar"),
        image: "/Photos-for-Site/Kukhnya.webp",
      },
    ],

    suitableFor: {
      ru: ["Уединение", "Прогулка", "Фото"],
      uz: ["Yolg‘izlik", "Sayr", "Foto"],
    },

    features: t(
      "Тишина и природа в центре города.",
      "Shahar markazida tabiat va sokinlik."
    ),

    extras: {
      terrace: false,
      photoZone: true,
    },

    amenities: {
      parking: true,
      wifi: false,
      booking: false,
      family: true,
    },

    mustVisit: t(
      "Если хочется тишины — это одно из лучших мест.",
      "Agar sokinlik kerak bo‘lsa — eng yaxshi joylardan biri."
    ),
  },

  {
    slug: "anhor-lokomotiv",

    title: t("Anhor Lokomotiv", "Anhor Lokomotiv"),

    type: t("Парк", "Park"),

    category: t("Активный отдых", "Faol dam olish"),

    cover: "/Photos-for-Site/Skazat.webp",

    address: t("Ташкент, Анхор", "Toshkent, Anhor"),

    mapEmbed:
      "https://yandex.uz/map-widget/v1/?ll=69.260000,41.300000&z=15",

    workingHours: t(
      "Ежедневно, 10:00–22:00",
      "Har kuni, 10:00–22:00"
    ),

    phone: null,

    contacts: {
      instagram: "https://instagram.com/",
    },

    priceLabel: t("от 30 000 сум", "30 000 so‘mdan"),

    prices: [
      t("Аттракционы — от 30 000 сум", "Attraksionlar — 30 000 so‘mdan"),
    ],

    description: t(
      "Парк для активного отдыха с аттракционами и развлечениями.",
      "Attraksionlar va faol dam olish uchun park."
    ),

    highlights: [
      {
        title: t("Экстрим-аттракционы", "Ekstrem attraksionlar"),
        image: "/Photos-for-Site/Cirk.webp",
      },
    ],

    suitableFor: {
      ru: ["Друзья", "Активный отдых"],
      uz: ["Do‘stlar", "Faol dam olish"],
    },

    features: t(
      "Больше про активность и драйв, чем про спокойствие.",
      "Sokinlikdan ko‘ra ko‘proq harakat va energiya."
    ),

    extras: {
      terrace: false,
      photoZone: true,
    },

    amenities: {
      parking: true,
      wifi: false,
      booking: false,
      family: true,
    },

    mustVisit: t(
      "Если хочется движухи — сюда.",
      "Agar harakat kerak bo‘lsa — shu yer."
    ),
  },
];