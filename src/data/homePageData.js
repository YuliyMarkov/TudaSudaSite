const t = (ru, uz = "") => ({ ru, uz });

const createDateRange = (start, end) => {
  const dates = [];
  const current = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);

  while (current <= last) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const makeRecurringEvents = ({
  startDate,
  endDate,
  slug,
  image,
  title,
  location,
  categoryLabel,
  idPrefix,
}) => {
  return createDateRange(startDate, endDate).map((date, index) => ({
    id: `${idPrefix}-${index + 1}`,
    slug,
    date,
    image,
    title,
    location,
    categoryLabel,
  }));
};

const makeSingleEvent = ({
  id,
  slug,
  date,
  image,
  title,
  location,
  categoryLabel,
}) => ({
  id,
  slug,
  date,
  image,
  title,
  location,
  categoryLabel,
});

export const featuredEvents = [
  {
    slug: "tashkent-traffic-control",
    poster: "/Previews/Gagarina.webp",
    videoEmbed:
      "https://videodelivery.net/a98fca651bad8b255ebdb31bacf47c27/manifest/video.m3u8",
    alt: t("Главное событие"),
    title: t("Концерт Полины Гагариной в Ташкенте"),
    subtitle: t("15 мая, билеты - от 100 000 сумов"),
  },
  {
    slug: "weather-warning-uzbekistan",
    poster: "/Previews/Safari.webp",
    videoEmbed:
      "https://videodelivery.net/1888e1c905022d48837f10fddf60c8a7/manifest/video.m3u8",
    alt: t("Главное событие"),
    title: t("Magic Safari в Ташкенте снова открыт для посетителей"),
    subtitle: t("Вход - от 100 000 сумов"),
  },
  {
    slug: "weather-warning-uzbekistan",
    poster: "/Previews/RukiVverkh.webp",
    videoEmbed:
      "https://videodelivery.net/45e872288da7c19ecfb8650aec841bfd/manifest/video.m3u8",
    alt: t("Главное событие"),
    title: t("Концерт Руки Вверх! на Humo Arena"),
    subtitle: t("15 мая, билеты - от 100 000 сумов"),
  },
  {
    slug: "tashkent-airport-schedule",
    poster: "/Previews/Avatar3.webp",
    videoEmbed:
      "https://videodelivery.net/86996c1eba3ff3684d4972f49ed913f6/manifest/video.m3u8",
    alt: t("Главное событие"),
    title: t("Аватар 3: Пепел и пламя - уже в кино"),
    subtitle: t("Билеты - от 60 000 сумов"),
  },
  {
    slug: "tashkent-airport-schedule",
    poster: "/Previews/JONY.webp",
    videoEmbed:
      "https://videodelivery.net/488b09cede1261f1c480b50f9c30b5a2/manifest/video.m3u8",
    alt: t("Главное событие"),
    title: t("Концерт JONY в Ташкенте"),
    subtitle: t("15 мая, билеты - от 100 000 сумов"),
  },
];

export const cinemaEvents = [
  {
    id: "cinema-avatar-3",
    slug: "avatar-3-fire-and-ash",
    image: "/Previews/Avatar3.webp",
    title: t("Аватар 3: Пепел и пламя", "Avatar 3: Kul va alanga"),
    subtitle: t("Уже в кино", "Allaqachon kinoda"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Новая глава масштабной фантастической саги. Зрителей ждут возвращение знакомых героев, новые миры Пандоры, крупные сражения и визуально впечатляющее приключение на большом экране.",
      "Mashhur fantastik dostonning yangi bobida tomoshabinlarni tanish qahramonlar, Pandoraning yangi olamlari, yirik janglar va katta ekrandagi ta’sirli sarguzasht kutadi."
    ),
    schedule: {
      "2026-04-02": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "11:20", url: "#" },
            { time: "14:40", url: "#" },
            { time: "18:10", url: "#" },
            { time: "21:30", url: "#" },
          ],
        },
        {
          cinema: "Next Cinema",
          sessions: [
            { time: "12:10", url: "#" },
            { time: "16:00", url: "#" },
            { time: "20:20", url: "#" },
          ],
        },
      ],
      "2026-04-03": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "12:00", url: "#" },
            { time: "15:10", url: "#" },
            { time: "19:00", url: "#" },
          ],
        },
      ],
      "2026-04-04": [
        {
          cinema: "Seoul Mun",
          sessions: [
            { time: "10:30", url: "#" },
            { time: "13:50", url: "#" },
            { time: "17:20", url: "#" },
            { time: "20:40", url: "#" },
          ],
        },
      ],
      "2026-04-05": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "11:00", url: "#" },
            { time: "14:20", url: "#" },
            { time: "18:00", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-minecraft",
    slug: "minecraft-movie",
    image: "/Photos-for-Site/Planetariy.webp",
    title: t("Minecraft в кино", "Minecraft kinoda"),
    subtitle: t("Для всей семьи", "Butun oila uchun"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Семейное приключение по мотивам популярной игровой вселенной. Фильм подходит для детей и взрослых и делает ставку на яркую картинку, юмор и динамику.",
      "Mashhur o‘yin olamiga asoslangan oilaviy sarguzasht filmi. Yorqin vizual, hazil va dinamika bilan bolalar ham, kattalar ham uchun mos."
    ),
    schedule: {
      "2026-04-02": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "10:00", url: "#" },
            { time: "12:30", url: "#" },
            { time: "15:00", url: "#" },
            { time: "17:40", url: "#" },
          ],
        },
      ],
      "2026-04-03": [
        {
          cinema: "Next Cinema",
          sessions: [
            { time: "11:10", url: "#" },
            { time: "13:30", url: "#" },
            { time: "16:20", url: "#" },
          ],
        },
      ],
      "2026-04-04": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "09:40", url: "#" },
            { time: "12:00", url: "#" },
            { time: "14:30", url: "#" },
            { time: "17:00", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-marvel",
    slug: "new-marvel-movie",
    image: "/Photos-for-Site/Gagagoy.webp",
    title: t("Новый фильм Marvel", "Yangi Marvel filmi"),
    subtitle: t("Скоро в прокате", "Tez orada prokatda"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Новый блокбастер Marvel с большим экшеном, знакомыми героями и масштабной супергеройской историей.",
      "Marvel’ning yangi blokbaster filmi: kuchli ekshen, tanish qahramonlar va yirik superqahramon hikoyasi."
    ),
    schedule: {
      "2026-04-02": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "13:10", url: "#" },
            { time: "16:00", url: "#" },
            { time: "19:15", url: "#" },
            { time: "22:00", url: "#" },
          ],
        },
      ],
      "2026-04-04": [
        {
          cinema: "Next Cinema",
          sessions: [
            { time: "12:30", url: "#" },
            { time: "15:40", url: "#" },
            { time: "18:50", url: "#" },
            { time: "22:10", url: "#" },
          ],
        },
      ],
      "2026-04-05": [
        {
          cinema: "Seoul Mun",
          sessions: [
            { time: "14:00", url: "#" },
            { time: "17:10", url: "#" },
            { time: "20:30", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-dune-messiah",
    slug: "dune-messiah",
    image: "/Previews/Avatar3.webp",
    title: t("Дюна: Мессия", "Dyuna: Messiya"),
    subtitle: t("Скоро в кино", "Tez orada kinoda"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Продолжение эпической истории о власти, судьбе и борьбе за будущее целой цивилизации.",
      "Hokimiyat, taqdir va butun bir sivilizatsiya kelajagi uchun kurash haqidagi epik hikoyaning davomi."
    ),
    schedule: {
      "2026-04-03": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "12:00", url: "#" },
            { time: "15:20", url: "#" },
            { time: "18:50", url: "#" },
            { time: "21:50", url: "#" },
          ],
        },
      ],
      "2026-04-04": [
        {
          cinema: "Next Cinema",
          sessions: [
            { time: "11:40", url: "#" },
            { time: "14:50", url: "#" },
            { time: "18:10", url: "#" },
            { time: "21:20", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-comedy-night",
    slug: "comedy-night-premiere",
    image: "/Photos-for-Site/Mechty.webp",
    title: t("Комедия недели", "Hafta komediyasi"),
    subtitle: t("Премьера", "Premyera"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Лёгкая комедия для вечернего просмотра — с узнаваемыми ситуациями, юмором и динамичным темпом.",
      "Kechki tomosha uchun yengil komediya — tanish vaziyatlar, hazil va dinamik ritm bilan."
    ),
    schedule: {
      "2026-04-03": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "11:30", url: "#" },
            { time: "14:00", url: "#" },
            { time: "16:40", url: "#" },
            { time: "20:10", url: "#" },
          ],
        },
      ],
      "2026-04-05": [
        {
          cinema: "Next Cinema",
          sessions: [
            { time: "10:50", url: "#" },
            { time: "13:20", url: "#" },
            { time: "15:50", url: "#" },
            { time: "19:10", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-action",
    slug: "action-blockbuster",
    image: "/Photos-for-Site/Kukhnya.webp",
    title: t("Главный боевик месяца", "Oyning asosiy jangari filmi"),
    subtitle: t("На больших экранах", "Katta ekranlarda"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Большой зрелищный боевик с динамичным сюжетом, погонями и мощной визуальной подачей.",
      "Dinamik syujet, quvishlar va kuchli vizual uslubga ega katta tomoshabop jangari film."
    ),
    schedule: {
      "2026-04-04": [
        {
          cinema: "Seoul Mun",
          sessions: [
            { time: "13:00", url: "#" },
            { time: "15:50", url: "#" },
            { time: "18:40", url: "#" },
            { time: "21:20", url: "#" },
          ],
        },
      ],
      "2026-04-05": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "12:20", url: "#" },
            { time: "16:10", url: "#" },
            { time: "19:40", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-family",
    slug: "family-animation",
    image: "/Photos-for-Site/Vystavka.webp",
    title: t("Семейная анимация", "Oilaviy animatsiya"),
    subtitle: t("Для детей и взрослых", "Bolalar va kattalar uchun"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Добрая и яркая анимационная история, которую удобно смотреть всей семьёй.",
      "Butun oila bilan tomosha qilish uchun qulay bo‘lgan mehribon va yorqin animatsion hikoya."
    ),
    schedule: {
      "2026-04-04": [
        {
          cinema: "Compass Cinema",
          sessions: [
            { time: "10:20", url: "#" },
            { time: "12:10", url: "#" },
            { time: "14:00", url: "#" },
            { time: "16:00", url: "#" },
          ],
        },
      ],
      "2026-04-05": [
        {
          cinema: "Next Cinema",
          sessions: [
            { time: "09:50", url: "#" },
            { time: "11:40", url: "#" },
            { time: "13:30", url: "#" },
          ],
        },
      ],
    },
  },
  {
    id: "cinema-drama",
    slug: "festival-drama",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Фестивальная драма", "Festival dramasi"),
    subtitle: t("Спецпоказы", "Maxsus namoyishlar"),
    location: t("Кинотеатры Ташкента", "Toshkent kinoteatrlari"),
    categoryLabel: t("Кино", "Kino"),
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    description: t(
      "Авторская драматическая картина для тех, кто любит атмосферное, медленное и сильное кино.",
      "Atmosferali, sekin rivojlanadigan va kuchli filmlarni yoqtiradiganlar uchun mualliflik dramasi."
    ),
    schedule: {
      "2026-04-02": [
        {
          cinema: "House Cinema",
          sessions: [
            { time: "17:10", url: "#" },
            { time: "20:20", url: "#" },
          ],
        },
      ],
      "2026-04-05": [
        {
          cinema: "House Cinema",
          sessions: [
            { time: "16:30", url: "#" },
            { time: "19:40", url: "#" },
          ],
        },
      ],
    },
  },
];

export const topSlides = [
  {
    slug: "tashkent-traffic-control",
    image: "/Previews/Gagarina.webp",
    alt: t("Главное событие"),
    title: t("Концерт Полины Гагариной в Ташкенте"),
  },
  {
    slug: "weather-warning-uzbekistan",
    image: "/Previews/Safari.webp",
    alt: t("Главное событие"),
    title: t("Magic Safari в Ташкенте снова открыт для посетителей"),
  },
  {
    slug: "weather-warning-uzbekistan",
    image: "/Previews/RukiVverkh.webp",
    alt: t("Главное событие"),
    title: t("Концерт Руки Вверх! на Humo Arena"),
  },
];

export const latestNews = [
  {
    slug: "event-being-van-gogh",
    title: t("Выставка «Быть Ван Гогом»"),
  },
  {
    slug: "event-polina-gagarina",
    title: t("Концерт Полины Гагариной в Ташкенте"),
  },
  {
    slug: "event-ruki-vverh",
    title: t("Концерт группы «Руки вверх!»"),
  },
  {
    slug: "event-jony-april",
    title: t("JONY в Ташкенте"),
  },
  {
    slug: "event-space-day-planetarium",
    title: t("«День космонавтики» в Планетарии"),
  },
  {
    slug: "event-african-circus",
    title: t("Африканский цирк"),
  },
  {
    slug: "event-pozdnyaya-lyubov",
    title: t("Спектакль «Поздняя любовь»"),
  },
  {
    slug: "event-textile-expo-2026",
    title: t("Textile Expo 2026"),
  },
  {
    slug: "event-bitiruv-shou-2026",
    title: t("Bitiruv shou 2026"),
  },
];

export const featuredNews = [
  {
    slug: "event-being-van-gogh",
    image: "/Photos-for-Site/VanGog.webp",
    title: t("Мультимедийная выставка «Быть Ван Гогом»"),
    text: t(
      "Большая мультимедийная выставка, вдохновлённая работами Ван Гога."
    ),
  },
  {
    slug: "event-space-day-planetarium",
    image: "/Photos-for-Site/Planetariy.webp",
    title: t("«День космонавтики» в Планетарии"),
    text: t("Программа для детей и взрослых с атмосферой космоса и науки."),
  },
  {
    slug: "event-african-circus",
    image: "/Photos-for-Site/AfricanCircus.webp",
    title: t("Африканский цирк"),
    text: t("Яркое шоу с акробатами, артистами и необычными номерами."),
  },
  {
    slug: "event-million-2026",
    image: "/Photos-for-Site/Million.webp",
    title: t("Коллектив Million"),
    text: t("Большой концерт популярного узбекского коллектива."),
  },
  {
    slug: "event-uzfood-2026",
    image: "/Photos-for-Site/UzFood.webp",
    title: t("UzFood 2026"),
    text: t(
      "Крупная выставка для тех, кто следит за гастрономией и индустрией питания."
    ),
  },
  {
    slug: "event-textile-expo-2026",
    image: "/Photos-for-Site/Textile.webp",
    title: t("Textile Expo 2026"),
    text: t("Выставка, посвящённая текстилю, моде и производству."),
  },
];

export const moreNewsInitial = [
  {
    slug: "event-being-van-gogh",
    type: "articles",
    image: "/Photos-for-Site/VanGog.webp",
    title: t(
      "Мультимедийная выставка «Быть Ван Гогом»",
      "“Van Gog bo‘lish” multimedia ko‘rgazmasi"
    ),
    text: t(
      "Иммерсивное арт-событие для любителей живописи и современного формата выставок.",
      "Rassomlik va zamonaviy ko‘rgazma formatini sevuvchilar uchun immersiv art-tadbir."
    ),
    content: {
      ru: [
        "В Ташкенте проходит мультимедийная выставка «Быть Ван Гогом» — один из самых заметных культурных проектов сезона для тех, кто любит живопись, цифровое искусство и иммерсивные форматы.",
        "Экспозиция построена так, чтобы зритель не просто смотрел на работы, а буквально оказался внутри визуального пространства, вдохновлённого картинами Ван Гога. Свет, анимация, крупный формат и музыкальное сопровождение создают эффект полного погружения.",
        "Такой формат особенно хорошо подходит тем, кто хочет провести вечер не в классическом музее, а в более современном и эмоциональном пространстве. Это хороший вариант и для самостоятельного похода, и для свидания, и для культурного выхода с друзьями.",
        "Если вы ищете выставку, которая выглядит эффектно, легко воспринимается и даёт яркий визуальный опыт, «Быть Ван Гогом» — один из самых удачных вариантов в текущей городской афише."
      ],
      uz: [
        "Toshkentda “Van Gog bo‘lish” multimedia ko‘rgazmasi bo‘lib o‘tmoqda — bu mavsumning rassomlik, raqamli san’at va immersiv formatlarni yoqtiradiganlar uchun eng diqqatga sazovor madaniy loyihalaridan biri.",
        "Ekspozitsiya shunday qurilganki, tomoshabin asarlarga shunchaki qarab qolmaydi, balki Van Gog ijodidan ilhomlangan vizual makon ichiga kirib qolgandek bo‘ladi. Yorug‘lik, animatsiya, katta format va musiqiy fon to‘liq sho‘ng‘ish hissini yaratadi.",
        "Bunday format ayniqsa klassik muzey emas, balki zamonaviy va hissiy makonda vaqt o‘tkazishni istaydiganlar uchun mos. Bu yakka holda borish, uchrashuv yoki do‘stlar bilan madaniy kecha uchun ham yaxshi variant.",
        "Agar siz ta’sirli ko‘rinadigan, oson qabul qilinadigan va kuchli vizual tajriba beradigan ko‘rgazma izlayotgan bo‘lsangiz, “Van Gog bo‘lish” hozirgi shahar afishasidagi eng yaxshi variantlardan biridir."
      ]
    }
  },
  {
    slug: "event-dilorom-mamedova",
    type: "articles",
    image: "/Photos-for-Site/Vystavka.webp",
    title: t(
      "Выставка «100 уникальных работ Дилором Мамедовой»",
      "“Dilorom Mamedovaning 100 noyob asari” ko‘rgazmasi"
    ),
    text: t(
      "Выставочный проект с большой подборкой работ художницы.",
      "Rassomaning katta to‘plamdagi asarlaridan iborat ko‘rgazma loyihasi."
    ),
    content: {
      ru: [
        "Выставка, посвящённая творчеству Дилором Мамедовой, собирает большую подборку работ художницы и даёт возможность увидеть её стиль в одном пространстве.",
        "Такие проекты особенно ценны тем, что позволяют не фрагментарно знакомиться с автором, а почувствовать целостную художественную логику, темы и настроение, которые проходят через разные произведения.",
        "Для зрителей, которым интересны локальные художественные имена, эта выставка может стать хорошим способом открыть для себя ещё один важный пласт современной культурной сцены.",
        "Это спокойный, вдумчивый формат культурного досуга, который подойдёт тем, кто хочет провести время не спеша и с акцентом на визуальное восприятие."
      ],
      uz: [
        "Dilorom Mamedova ijodiga bag‘ishlangan ko‘rgazma rassomaning katta hajmdagi asarlarini bir joyga jamlab, uning uslubini bir makonda ko‘rish imkonini beradi.",
        "Bunday loyihalar ayniqsa qimmatli, chunki ular muallif bilan parchalanib emas, balki uning butun badiiy mantiqi, mavzulari va kayfiyatini birgalikda his qilish imkonini beradi.",
        "Mahalliy san’at vakillariga qiziqadigan tomoshabinlar uchun bu ko‘rgazma zamonaviy madaniy sahnaning muhim qatlamlaridan birini kashf qilish usuli bo‘lishi mumkin.",
        "Bu shoshmasdan, vizual idrokka urg‘u bergan holda vaqt o‘tkazishni istaydiganlar uchun mos bo‘lgan sokin va mulohazali madaniy hordiq formatidir."
      ]
    }
  },
  {
    slug: "event-central-asia-kitchen",
    type: "articles",
    image: "/Photos-for-Site/Kukhnya.webp",
    title: t(
      "Выставка «Кухня Центральной Азии»",
      "“Markaziy Osiyo oshxonasi” ko‘rgazmasi"
    ),
    text: t(
      "Проект о гастрономической культуре и традициях региона.",
      "Mintaqaning gastronomik madaniyati va an’analari haqidagi loyiha."
    ),
    content: {
      ru: [
        "Выставка «Кухня Центральной Азии» — это проект на стыке гастрономии, культуры и визуального рассказа о регионе.",
        "Такие события интересны не только тем, кто любит еду, но и тем, кто хочет лучше понять традиции, образ жизни и культурный код Центральной Азии через повседневные вещи — продукты, рецепты, ритуалы и семейные привычки.",
        "Формат особенно хорош для тех, кто устал от однотипных выставок и хочет посмотреть на знакомую тему под другим углом — через историю вкусов, памяти и локальной идентичности.",
        "Это одна из тех выставок, после которых хочется не только обсудить увиденное, но и продолжить вечер уже в каком-нибудь хорошем месте с центральноазиатской кухней."
      ],
      uz: [
        "“Markaziy Osiyo oshxonasi” ko‘rgazmasi — bu gastronomiya, madaniyat va mintaqa haqidagi vizual hikoya kesishgan nuqtadagi loyiha.",
        "Bunday tadbirlar faqat ovqatni yaxshi ko‘radiganlar uchun emas, balki mahsulotlar, retseptlar, marosimlar va oilaviy odatlar orqali Markaziy Osiyoning an’analari, turmush tarzi va madaniy kodini chuqurroq tushunishni istaydiganlar uchun ham қизиқ.",
        "Bu format ayniqsa bir xil ko‘rgazmalardan charchagan va tanish mavzuga boshqa rakursdan — ta’m tarixi, xotira va mahalliy identiklik orqali qarashni istaydiganlar uchun mos.",
        "Bu shunday ko‘rgazmalardan biriki, undan keyin faqat ko‘rganingizni muhokama qilish emas, balki kechani yaxshi bir markaziy osiyo oshxonasi joyida davom ettirish ham istaladi."
      ]
    }
  },
  {
    slug: "event-ga-ga-goy",
    type: "articles",
    image: "/Photos-for-Site/Gagagoy.webp",
    title: t(
      "Выставка «Га га гой»",
      "“Ga ga goy” ko‘rgazmasi"
    ),
    text: t(
      "Современная выставка в пространстве театра «Ильхом».",
      "Ilhom teatr makonidagi zamonaviy ko‘rgazma."
    ),
    content: {
      ru: [
        "«Га га гой» — это современная выставка в пространстве театра «Ильхом», а значит, уже сама площадка добавляет проекту нужный контекст и атмосферу.",
        "Такие события обычно работают сразу на нескольких уровнях: как визуальный опыт, как разговор о современном искусстве и как повод вновь попасть в одно из самых характерных культурных пространств города.",
        "Для тех, кто следит за независимой сценой Ташкента, подобные выставки особенно важны: именно в таких местах часто появляются самые живые, смелые и обсуждаемые проекты.",
        "Если хочется чего-то менее формального, чем классическая музейная экспозиция, и более живого по энергии, этот вариант точно стоит взять в заметки."
      ],
      uz: [
        "“Ga ga goy” — bu Ilhom teatr makonidagi zamonaviy ko‘rgazma, demak, loyihaning o‘zi uchun maydon ham kerakli kontekst va atmosferani beradi.",
        "Bunday tadbirlar odatda bir nechta darajada ishlaydi: vizual tajriba sifatida, zamonaviy san’at haqidagi suhbat sifatida va shaharning eng xarakterli madaniy makonlaridan biriga yana bir bor borish uchun sabab sifatida.",
        "Toshkentning mustaqil sahnasini kuzatadiganlar uchun bunday ko‘rgazmalar ayniqsa muhim: aynan shunday joylarda eng jonli, dadil va ko‘p muhokama qilinadigan loyihalar paydo bo‘ladi.",
        "Agar siz klassik muzey ekspozitsiyasidan ko‘ra kamroq rasmiy va energiyasi jihatidan tirikroq narsa istasangiz, bu variantni albatta eslab qo‘yish kerak."
      ]
    }
  },
  {
    slug: "event-african-circus",
    type: "news",
    image: "/Photos-for-Site/AfricanCircus.webp",
    title: t("Африканский цирк", "Afrika sirki"),
    text: t(
      "Зрелищное шоу с артистами и цирковыми номерами.",
      "Artistlar va sirk chiqishlari bilan tomoshabop shou."
    ),
    content: {
      ru: [
        "В Ташкенте проходит программа «Африканский цирк» — яркое шоу для тех, кто ищет зрелищный семейный досуг.",
        "В таких постановках обычно делают ставку на динамику, акробатику, выразительные номера и визуальный эффект, поэтому формат хорошо подходит и для похода с детьми, и для вечернего выхода всей семьёй.",
        "Для городской афиши это один из универсальных вариантов: когда хочется не выставку и не концерт, а именно шоу с понятной эмоцией и живой реакцией зала.",
        "Если нужен формат «пойти и просто хорошо провести время», цирковая программа — один из самых простых и рабочих вариантов."
      ],
      uz: [
        "Toshkentda “Afrika sirki” dasturi bo‘lib o‘tmoqda — tomoshabop oilaviy hordiq izlayotganlar uchun yorqin shou.",
        "Bunday sahna dasturlarida odatda dinamika, akrobatika, ifodali chiqishlar va kuchli vizual effektga urg‘u beriladi, shuning uchun format bolalar bilan ham, butun oila bilan kechki chiqish uchun ham juda mos.",
        "Shahar afishasi uchun bu eng universal variantlardan biri: ko‘rgazma ham emas, konsert ham emas, balki aniq hissiyot beradigan va zaldan jonli reaksiya oladigan shou kerak bo‘lganda aynan shunday tadbirlar tanlanadi.",
        "Agar sizga “borib shunchaki yaxshi vaqt o‘tkazish” formati kerak bo‘lsa, sirk dasturi eng sodda va ishlaydigan variantlardan biridir."
      ]
    }
  },
  {
    slug: "event-million-2026",
    type: "news",
    image: "/Photos-for-Site/Million.webp",
    title: t("Коллектив Million", "Million guruhi"),
    text: t(
      "Один из самых заметных концертов месяца.",
      "Oyining eng sezilarli konsertlaridan biri."
    ),
    content: {
      ru: [
        "Выступление коллектива Million — один из заметных концертных поводов месяца для местной аудитории.",
        "Такие события, как правило, быстро собирают интерес, потому что работают сразу на узнаваемость, настроение и понятный формат вечернего выхода.",
        "Если хочется выбрать большой концерт без долгих раздумий и попасть на событие с широкой аудиторией, это как раз один из таких вариантов.",
        "Для поклонников локальной сцены и тех, кто любит живые массовые выступления, концерт Million — событие, которое легко вписывается в планы на вечер."
      ],
      uz: [
        "Million guruhi chiqishi — mahalliy auditoriya uchun oyning sezilarli konsert sabablaridan biri.",
        "Bunday tadbirlar odatda tezda qiziqish uyg‘otadi, chunki ular birdaniga tanishlik, kayfiyat va tushunarli kechki chiqish formatini beradi.",
        "Agar siz ko‘p o‘ylamasdan katta konsert tanlamoqchi va keng auditoriyali tadbirga tushmoqchi bo‘lsangiz, bu aynan shunday variantlardan biri.",
        "Mahalliy sahna muxlislari va jonli ommaviy chiqishlarni yoqtiradiganlar uchun Million konserti kechki rejalarga osongina mos tushadigan tadbirdir."
      ]
    }
  },
  {
    slug: "event-uzfood-2026",
    type: "articles",
    image: "/Photos-for-Site/UzFood.webp",
    title: t("UzFood 2026", "UzFood 2026"),
    text: t(
      "Выставка для тех, кто интересуется едой, брендами и индустрией HoReCa.",
      "Ovqat, brendlar va HoReCa sanoati bilan qiziquvchilar uchun ko‘rgazma."
    ),
    content: {
      ru: [
        "UzFood 2026 — одна из ключевых профильных выставок для тех, кто следит за гастрономией, продуктами, ресторанной индустрией и рынком HoReCa.",
        "Для профессионалов это рабочая площадка, где можно смотреть тренды, бренды, поставщиков и новые решения. Для широкой аудитории — это возможность почувствовать, чем живёт индустрия питания прямо сейчас.",
        "Такие выставки особенно интересны тем, кто работает с ресторанами, доставкой, продуктами, упаковкой или просто внимательно следит за развитием гастрономической сцены в регионе.",
        "Если вам интересно, как устроен рынок еды за пределами обычного похода в ресторан, UzFood — хороший повод посмотреть на индустрию шире."
      ],
      uz: [
        "UzFood 2026 — gastronomiya, mahsulotlar, restoran sanoati va HoReCa bozori bilan qiziquvchilar uchun asosiy professional ko‘rgazmalardan biri.",
        "Mutaxassislar uchun bu trendlar, brendlar, ta’minotchilar va yangi yechimlarni ko‘rish mumkin bo‘lgan ish maydoni. Keng auditoriya uchun esa oziq-ovqat sanoati hozir nimalar bilan yashayotganini his qilish imkoniyati.",
        "Bunday ko‘rgazmalar ayniqsa restoranlar, yetkazib berish, mahsulotlar, qadoqlash bilan ishlaydiganlar yoki mintaqadagi gastronomik sahna rivojini diqqat bilan kuzatadiganlar uchun қизиқ.",
        "Agar siz restoranlarga oddiy borishdan tashqari ovqat bozori qanday ishlashini tushunishni istasangiz, UzFood sanoatga kengroq qarash uchun yaxshi sabab bo‘ladi."
      ]
    }
  },
  {
    slug: "event-textile-expo-2026",
    type: "articles",
    image: "/Photos-for-Site/Textile.webp",
    title: t("Textile Expo 2026", "Textile Expo 2026"),
    text: t(
      "Масштабное событие в мире текстиля и производства.",
      "To‘qimachilik va ishlab chiqarish olamidagi yirik tadbir."
    ),
    content: {
      ru: [
        "Textile Expo 2026 — крупное отраслевое событие для тех, кто интересуется текстилем, производством, модой и развитием индустрии.",
        "Подобные выставки важны не только для профессионалов, но и для тех, кто хочет лучше понять, как устроен один из ключевых секторов экономики региона.",
        "Это хороший формат для знакомства с брендами, тенденциями, производственными решениями и деловой средой, которая стоит за модой и текстильным рынком.",
        "Если вам интересна индустриальная сторона городской жизни и крупных выставочных событий, Textile Expo — один из самых заметных пунктов календаря."
      ],
      uz: [
        "Textile Expo 2026 — to‘qimachilik, ishlab chiqarish, moda va sanoat rivojiga qiziqadiganlar uchun yirik tarmoq tadbiri.",
        "Bunday ko‘rgazmalar nafaqat mutaxassislar, balki mintaqa iqtisodiyotining muhim sohalaridan biri qanday ishlashini yaxshiroq tushunishni istaydiganlar uchun ham muhim.",
        "Bu brendlar, tendensiyalar, ishlab chiqarish yechimlari va moda hamda tekstil bozori ortida turgan ishbilarmonlik muhitini yaqindan ko‘rish uchun yaxshi format.",
        "Agar sizga shahar hayotining sanoat tomoni va yirik ko‘rgazma tadbirlari qiziq bo‘lsa, Textile Expo taqvimdagi eng sezilarli nuqtalardan biridir."
      ]
    }
  },
];

export const moreNewsExtra = [
  {
    slug: "event-space-day-planetarium",
    type: "news",
    image: "/Photos-for-Site/Planetariy.webp",
    title: t(
      "«День космонавтики» в Планетарии",
      "Planetariydagi “Kosmonavtika kuni”"
    ),
    text: t(
      "Познавательная программа для всей семьи.",
      "Butun oila uchun qiziqarli va foydali dastur."
    ),
    content: {
      ru: [
        "Ко Дню космонавтики в Планетарии подготовили специальную программу для детей и взрослых.",
        "Такие события обычно хорошо сочетают развлекательный и познавательный формат: здесь можно не только провести время всей семьёй, но и добавить в выходной немного науки, космоса и впечатлений.",
        "Для родителей это удобный вариант семейного досуга, а для детей — шанс увидеть знакомую тему в более живом и вовлекающем формате.",
        "Если хочется выбрать событие, которое и интересно, и полезно, программа в Планетарии выглядит очень удачным вариантом."
      ],
      uz: [
        "Kosmonavtika kuni munosabati bilan Planetariyda bolalar va kattalar uchun maxsus dastur tayyorlandi.",
        "Bunday tadbirlar odatda ko‘ngilochar va ma’rifiy formatni yaxshi birlashtiradi: bu yerda nafaqat butun oila bilan vaqt o‘tkazish, balki dam olish kuniga biroz ilm, kosmos va taassurot qo‘shish ham mumkin.",
        "Ota-onalar uchun bu qulay oilaviy hordiq varianti, bolalar uchun esa tanish mavzuni yanada jonli va jalb qiluvchi formatda ko‘rish imkoniyatidir.",
        "Agar siz bir vaqtning o‘zida ham qiziqarli, ham foydali tadbir qidirsangiz, Planetariydagi dastur juda yaxshi variant bo‘lib ko‘rinadi."
      ]
    }
  },
  {
    slug: "event-caex-mebel-2026",
    type: "articles",
    image: "/Photos-for-Site/CAeX.webp",
    title: t("CAEx Mebel & Décor 2026", "CAEx Mebel & Décor 2026"),
    text: t(
      "Площадка для тех, кто следит за дизайном, мебелью и интерьерными решениями.",
      "Dizayn, mebel va interyer yechimlarini kuzatadiganlar uchun maydon."
    ),
    content: {
      ru: [
        "CAEx Mebel & Décor 2026 — выставка для тех, кто интересуется интерьером, мебелью, дизайном пространства и актуальными визуальными решениями.",
        "Это событие может быть полезно как профессионалам отрасли, так и тем, кто просто любит следить за эстетикой городских пространств, домашнего интерьера и современного оформления.",
        "Подобные площадки дают возможность увидеть, какие стили, материалы и подходы сейчас становятся заметными на рынке.",
        "Если вам интересна тема красивого пространства — от квартиры до коммерческого интерьера — на эту выставку точно стоит обратить внимание."
      ],
      uz: [
        "CAEx Mebel & Décor 2026 — interyer, mebel, makon dizayni va dolzarb vizual yechimlarga qiziqadiganlar uchun ko‘rgazma.",
        "Bu tadbir soha mutaxassislari uchun ham, shahar makonlari, uy interyeri va zamonaviy bezak estetikasini kuzatishni yaxshi ko‘radiganlar uchun ham foydali bo‘lishi mumkin.",
        "Bunday maydonlar bozorda hozir qaysi uslublar, materiallar va yondashuvlar ajralib chiqayotganini ko‘rish imkonini beradi.",
        "Agar sizga chiroyli makon mavzusi — kvartiradan tortib tijorat interyerigacha — qiziq bo‘lsa, bu ko‘rgazmaga albatta e’tibor qaratish kerak."
      ]
    }
  },
  {
    slug: "event-dreams-changing-world-2",
    type: "articles",
    image: "/Photos-for-Site/Mechty.webp",
    title: t(
      "«Мечты, меняющие мир 2: В поисках призвания»",
      "“Dunyoni o‘zgartiradigan orzular 2: Kasbni izlab”"
    ),
    text: t(
      "Семейное событие и вдохновляющая программа для детей.",
      "Bolalar uchun ilhomlantiruvchi oilaviy dastur."
    ),
    content: {
      ru: [
        "«Мечты, меняющие мир 2» — это семейное событие с мотивационным и образовательным акцентом.",
        "Такие программы особенно интересны тем, кто ищет для ребёнка не просто развлечение, а формат, который может вдохновить, расширить кругозор и подтолкнуть к размышлению о будущем.",
        "Для родителей это хороший способ совместить полезный досуг с живым, вовлекающим сценическим опытом.",
        "Если хочется выбрать детское событие не только ради яркой картинки, но и ради смысла, этот проект выглядит очень уместно."
      ],
      uz: [
        "“Dunyoni o‘zgartiradigan orzular 2” — motivatsion va ta’limiy urg‘uga ega oilaviy tadbirdir.",
        "Bunday dasturlar ayniqsa bolaga shunchaki ko‘ngilochar emas, balki ilhom beradigan, dunyoqarashni kengaytiradigan va kelajak haqida o‘ylashga undaydigan format izlayotganlar uchun қизиқ.",
        "Ota-onalar uchun bu foydali hordiqni jonli va jalb qiluvchi sahna tajribasi bilan birlashtirishning yaxshi usuli.",
        "Agar siz bolalar uchun tadbirni faqat yorqin ko‘rinish uchun emas, balki mazmun uchun ham tanlamoqchi bo‘lsangiz, bu loyiha juda mos tushadi."
      ]
    }
  },
  {
    slug: "event-polina-gagarina",
    type: "news",
    image: "/Previews/Gagarina.webp",
    title: t("Полина Гагарина", "Polina Gagarina"),
    text: t(
      "Большой концерт популярной певицы в Ташкенте.",
      "Mashhur xonandaning Toshkentdagi katta konserti."
    ),
    content: {
      ru: [
        "Концерт Полины Гагариной — один из самых громких музыкальных анонсов ближайшего периода в Ташкенте.",
        "Это формат большого поп-шоу, который обычно собирает широкую аудиторию и подходит тем, кто любит узнаваемые хиты, масштабную сцену и сильный концертный вайб.",
        "Для городской афиши это одно из тех событий, которые быстро становятся ориентиром при планировании месяца: идти ли самому, покупать ли билеты заранее, брать ли компанию.",
        "Если вы ждёте большой концерт с понятной программой и сильной зрительской реакцией, выступление Полины Гагариной — один из самых заметных вариантов."
      ],
      uz: [
        "Polina Gagarina konserti — Toshkentdagi yaqin davrning eng yirik musiqiy e’lonlaridan biri.",
        "Bu keng auditoriyani yig‘adigan va tanish hitlar, katta sahna hamda kuchli konsert vibeni yoqtiradiganlar uchun mos bo‘lgan yirik pop-shou formatidir.",
        "Shahar afishasi uchun bu oyni rejalashtirishda tezda mezonga aylanadigan tadbirlardan biri: o‘zingiz borasizmi, chiptani oldindan olasizmi, kompaniya yig‘asizmi.",
        "Agar siz aniq dasturga ega va kuchli tomoshabin reaksiyasi beradigan katta konsert kutayotgan bo‘lsangiz, Polina Gagarina chiqishi eng sezilarli variantlardan biridir."
      ]
    }
  },
  {
    slug: "event-jony-april",
    type: "news",
    image: "/Previews/JONY.webp",
    title: t("JONY", "JONY"),
    text: t(
      "Концерт одного из самых популярных артистов современной сцены.",
      "Zamonaviy sahnaning eng mashhur artistlaridan birining konserti."
    ),
    content: {
      ru: [
        "Выступление JONY — это один из самых ожидаемых концертных поводов для молодой городской аудитории.",
        "Его концерты обычно воспринимаются как эмоциональный поп-ивент с сильной вовлечённостью зала, знакомыми треками и понятной атмосферой большого музыкального вечера.",
        "Такой формат особенно хорошо подходит для компании друзей, романтического выхода или просто вечера, когда хочется пойти на событие с гарантированной энергетикой.",
        "Если вы выбираете между несколькими концертами и хотите что-то максимально актуальное по ощущениям, JONY — один из самых очевидных вариантов."
      ],
      uz: [
        "JONY chiqishi — yosh shahar auditoriyasi uchun eng kutilgan konsert sabablaridan biri.",
        "Uning konsertlari odatda hissiy pop-ivent sifatida qabul qilinadi: zalning kuchli ishtiroki, tanish treklar va katta musiqiy kechaning aniq atmosferasi bilan.",
        "Bunday format ayniqsa do‘stlar davrasi, romantik chiqish yoki energiyasi oldindan sezilib turadigan tadbirga borishni istagan kechalar uchun juda mos.",
        "Agar siz bir nechta konsert orasidan tanlayotgan bo‘lsangiz va hissiyot bo‘yicha eng dolzarb variantni xohlasangiz, JONY eng ravshan tanlovlardan biridir."
      ]
    }
  },
  {
    slug: "event-ruki-vverh",
    type: "news",
    image: "/Previews/RukiVverkh.webp",
    title: t(
      "Концерт группы «Руки вверх!»",
      "“Ruki Vverx!” guruhi konserti"
    ),
    text: t(
      "Большое шоу с хитами, знакомыми всем.",
      "Hammaning qulog‘iga tanish hitlar bilan katta shou."
    ),
    content: {
      ru: [
        "Концерт группы «Руки вверх!» — это событие для тех, кто хочет не просто пойти на выступление, а получить вечер ностальгии, хитов и общего настроения зала.",
        "Такие концерты хороши тем, что работают сразу на массовую эмоцию: публика знает песни, быстро включается и делает шоу по-настоящему живым.",
        "Это формат, который одинаково хорошо воспринимается и как поход с друзьями, и как большое развлекательное событие без лишней сложности.",
        "Если хочется выбрать концерт, где почти гарантированы узнаваемость, драйв и атмосфера общего праздника, это один из самых надёжных вариантов."
      ],
      uz: [
        "“Ruki Vverx!” guruhi konserti — bu shunchaki chiqishga emas, balki nostalgiya, hitlar va zalning umumiy kayfiyatiga to‘la kecha olishni istaydiganlar uchun tadbirdir.",
        "Bunday konsertlarning kuchi shundaki, ular ommaviy hissiyotga ishlaydi: tomoshabinlar qo‘shiqlarni biladi, tezda qo‘shiladi va shouni haqiqatan ham jonli qiladi.",
        "Bu do‘stlar bilan borish uchun ham, ortiqcha murakkabliksiz katta ko‘ngilochar tadbir sifatida ham birdek yaxshi qabul qilinadigan format.",
        "Agar siz tanish qo‘shiqlar, kuchli energiya va umumiy bayram muhitini istasangiz, bu eng ishonchli variantlardan biridir."
      ]
    }
  },
  {
    slug: "event-pozdnyaya-lyubov",
    type: "articles",
    image: "/Photos-for-Site/VanGog.webp",
    title: t(
      "Спектакль «Поздняя любовь»",
      "“Kechki muhabbat” spektakli"
    ),
    text: t(
      "Театральная постановка для любителей классических историй.",
      "Klassik hikoyalarni sevuvchilar uchun teatr sahnalashtiruvi."
    ),
    content: {
      ru: [
        "«Поздняя любовь» — спектакль для тех, кто ценит драматургию, театральную подачу и истории, построенные на сильной эмоциональной основе.",
        "Такие постановки особенно хорошо подходят зрителям, которые выбирают театр не ради визуального вау-эффекта, а ради актёрской игры, текста и внутреннего ритма сцены.",
        "Это формат более спокойного, содержательного культурного вечера, который хорошо работает как альтернатива шумным концертам и большим шоу.",
        "Если хочется театрального события с классическим ощущением и акцентом на чувствах, эта постановка выглядит очень достойным вариантом."
      ],
      uz: [
        "“Kechki muhabbat” — dramaturgiya, teatr ifodasi va kuchli hissiy asosga qurilgan hikoyalarni qadrlaydiganlar uchun spektakl.",
        "Bunday постановкalar ayniqsa teatrni vizual wow-effekt uchun emas, balki aktyorlik o‘yini, matn va sahnaning ichki ritmi uchun tanlaydigan tomoshabinlarga mos keladi.",
        "Bu shovqinli konsertlar va katta shoularga muqobil bo‘la oladigan, xotirjam va mazmunli madaniy kecha formatidir.",
        "Agar siz klassik hissiyotga ega va tuyg‘ularga urg‘u berilgan teatr tadbirini istasangiz, bu постановка juda munosib variant bo‘lib ko‘rinadi."
      ]
    }
  },
  {
    slug: "event-bitiruv-shou-2026",
    type: "news",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Bitiruv shou 2026", "Bitiruv shou 2026"),
    text: t(
      "Яркое шоу-событие на крупной площадке города.",
      "Shaharning yirik maydonidagi yorqin shou-tadbir."
    ),
    content: {
      ru: [
        "Bitiruv shou 2026 — это крупное шоу-событие, рассчитанное на зрелищность, атмосферу праздника и массовую аудиторию.",
        "Подобные форматы хорошо работают тогда, когда хочется попасть на энергичное городское событие с большой площадкой и ощущением масштаба.",
        "Это вариант для тех, кто любит современный ритм больших мероприятий, яркую подачу и живую публику.",
        "Если в афише нужен вечер не про камерность, а про эмоцию и эффект, Bitiruv shou — вполне подходящий выбор."
      ],
      uz: [
        "Bitiruv shou 2026 — tomoshaboplik, bayram muhiti va ommaviy auditoriyaga mo‘ljallangan yirik shou-tadbirdir.",
        "Bunday formatlar ayniqsa katta maydon va keng ko‘lam hissi bo‘lgan energiyali shahar tadbiriga tushishni istagan paytlarda yaxshi ishlaydi.",
        "Bu katta zamonaviy tadbirlar ritmi, yorqin taqdimot va jonli auditoriyani yoqtiradiganlar uchun mos variant.",
        "Agar afishada sokinlik emas, balki hissiyot va effekt beradigan kecha kerak bo‘lsa, Bitiruv shou juda mos tanlov bo‘la oladi."
      ]
    }
  }
];

export const theatreEvents = [
  {
    id: "theatre-ilkhom",
    slug: "ilkhom-performance",
    image: "/Photos-for-Site/Teatr.webp",
    title: t("Спектакль в театре «Ильхом»", "Ilhom teatridagi spektakl"),
    subtitle: t("Современная постановка", "Zamonaviy sahnalashtirish"),
    location: t("Театр «Ильхом»", "Ilhom teatri"),
    categoryLabel: t("Театр", "Teatr"),
    schedule: {
      today: ["19:00"],
      tomorrow: ["18:30"],
      weekend: ["17:00", "20:00"],
    },
  },
  {
    id: "theatre-turkiston",
    slug: "turkiston-performance",
    image: "/Photos-for-Site/Teatr.webp",
    title: t("Премьера в «Туркистон»", "“Turkiston”dagi premyera"),
    subtitle: t("Новая сцена сезона", "Mavsumning yangi sahnasi"),
    location: t("Дворец «Туркистон»", "“Turkiston” saroyi"),
    categoryLabel: t("Театр", "Teatr"),
    schedule: {
      today: [],
      tomorrow: ["19:30"],
      weekend: ["18:00"],
    },
  },
  {
    id: "theatre-opera",
    slug: "opera-night",
    image: "/Photos-for-Site/Teatr.webp",
    title: t("Вечер оперы", "Opera kechasi"),
    subtitle: t("Классическая программа", "Klassik dastur"),
    location: t("Большой театр", "Katta teatr"),
    categoryLabel: t("Театр", "Teatr"),
    schedule: {
      today: ["19:00"],
      tomorrow: [],
      weekend: ["18:00", "20:30"],
    },
  },
  {
    id: "theatre-drama",
    slug: "drama-performance",
    image: "/Photos-for-Site/Teatr.webp",
    title: t("Драматический спектакль", "Dramatik spektakl"),
    subtitle: t("Спецпоказ", "Maxsus namoyish"),
    location: t("Гос театр", "Davlat teatri"),
    categoryLabel: t("Театр", "Teatr"),
    schedule: {
      today: [],
      tomorrow: ["18:00"],
      weekend: ["17:30"],
    },
  },
  {
    id: "theatre-comedy",
    slug: "comedy-performance",
    image: "/Photos-for-Site/Teatr.webp",
    title: t("Комедийный вечер", "Komediya kechasi"),
    subtitle: t("Лёгкий вечер", "Yengil kecha"),
    location: t("Театр комедии", "Komediya teatri"),
    categoryLabel: t("Театр", "Teatr"),
    schedule: {
      today: ["20:00"],
      tomorrow: ["19:00"],
      weekend: ["16:00", "19:00"],
    },
  },
  {
    id: "theatre-modern",
    slug: "modern-theatre",
    image: "/Photos-for-Site/Teatr.webp",
    title: t("Современный театр", "Zamonaviy teatr"),
    subtitle: t("Экспериментальная сцена", "Eksperimental sahna"),
    location: t("Cultura", "Cultura"),
    categoryLabel: t("Театр", "Teatr"),
    schedule: {
      today: [],
      tomorrow: ["20:00"],
      weekend: ["18:30"],
    },
  },
];

export const placesEvents = [
  {
    id: "place-magic-city",
    slug: "magic-city",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Magic City", "Magic City"),
    subtitle: t(
      "Парк, прогулки и вечерняя атмосфера",
      "Park, sayr va kechki atmosfera"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-tashkent-city-park",
    slug: "tashkent-city-park",
    image: "/Photos-for-Site/Planetariy.webp",
    title: t("Tashkent City Park", "Tashkent City Park"),
    subtitle: t(
      "Современное городское пространство",
      "Zamonaviy shahar makoni"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-japanese-garden",
    slug: "japanese-garden",
    image: "/Photos-for-Site/Vystavka.webp",
    title: t("Японский сад", "Yapon bog‘i"),
    subtitle: t(
      "Спокойное место для прогулки",
      "Sayr uchun sokin joy"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-eco-park",
    slug: "eco-park",
    image: "/Photos-for-Site/Gagagoy.webp",
    title: t("Экопарк", "Ekopark"),
    subtitle: t("Зелёная зона в городе", "Shahardagi yashil hudud"),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-botanical-garden",
    slug: "botanical-garden",
    image: "/Photos-for-Site/VanGog.webp",
    title: t("Ботанический сад", "Botanika bog‘i"),
    subtitle: t(
      "Природа, тишина и воздух",
      "Tabiat, sokinlik va toza havo"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-samarqand-darvoza",
    slug: "samarqand-darvoza",
    image: "/Photos-for-Site/Kukhnya.webp",
    title: t("Samarqand Darvoza", "Samarqand Darvoza"),
    subtitle: t(
      "Шопинг и досуг в одном месте",
      "Shoping va hordiq bir joyda"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-anhor-lokomotiv",
    slug: "anhor-lokomotiv",
    image: "/Photos-for-Site/Skazat.webp",
    title: t("Anhor Lokomotiv", "Anhor Lokomotiv"),
    subtitle: t(
      "Активный отдых и прогулки",
      "Faol dam olish va sayr"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
  {
    id: "place-humo-arena-area",
    slug: "humo-arena-area",
    image: "/Photos-for-Site/Mechty.webp",
    title: t("Район Humo Arena", "Humo Arena hududi"),
    subtitle: t(
      "События, прогулки и городской вайб",
      "Tadbirlar, sayr va shahar vibe"
    ),
    location: t("Ташкент", "Toshkent"),
    categoryLabel: t("Место", "Joy"),
  },
];

export const upcomingEvents = [
  ...makeRecurringEvents({
    idPrefix: "van-gogh",
    slug: "event-being-van-gogh",
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    image: "/Photos-for-Site/VanGog.webp",
    title: t(
      "Мультимедийная выставка «Быть Ван Гогом»",
      "“Van Gog bo‘lish” multimedia ko‘rgazmasi"
    ),
    location: t("Tashkent City Mall", "Tashkent City Mall"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  ...makeRecurringEvents({
    idPrefix: "dilorom-mamedova",
    slug: "event-dilorom-mamedova",
    startDate: "2026-04-01",
    endDate: "2026-05-14",
    image: "/Photos-for-Site/Vystavka.webp",
    title: t(
      "Выставка «100 уникальных работ Дилором Мамедовой»",
      "“Dilorom Mamedovaning 100 noyob asari” ko‘rgazmasi"
    ),
    location: t("Парк астрономии", "Astronomiya bog‘i"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  ...makeRecurringEvents({
    idPrefix: "kitchen-central-asia",
    slug: "event-central-asia-kitchen",
    startDate: "2026-04-01",
    endDate: "2026-04-12",
    image: "/Photos-for-Site/Kukhnya.webp",
    title: t(
      "Выставка «Кухня Центральной Азии»",
      "“Markaziy Osiyo oshxonasi” ko‘rgazmasi"
    ),
    location: t(
      "Международный Караван-Сарай культуры Икуо Хираямы",
      "Ikuo Hirayama nomidagi Xalqaro Karvonsaroy madaniyat markazi"
    ),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  ...makeRecurringEvents({
    idPrefix: "nam-est-chto-skazat",
    slug: "event-nam-est-chto-skazat",
    startDate: "2026-04-02",
    endDate: "2026-05-02",
    image: "/Photos-for-Site/Skazat.webp",
    title: t(
      "Выставка «Нам есть что сказать 2.0»",
      "“Aytadigan gapimiz bor 2.0” ko‘rgazmasi"
    ),
    location: t("Cultura", "Cultura"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  ...makeRecurringEvents({
    idPrefix: "ga-ga-goy",
    slug: "event-ga-ga-goy",
    startDate: "2026-04-03",
    endDate: "2026-04-23",
    image: "/Photos-for-Site/Gagagoy.webp",
    title: t("Выставка «Га га гой»", "“Ga ga goy” ko‘rgazmasi"),
    location: t("Театр «Ильхом»", "Ilhom teatri"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  ...makeRecurringEvents({
    idPrefix: "planetarium-space-day",
    slug: "event-space-day-planetarium",
    startDate: "2026-04-07",
    endDate: "2026-04-17",
    image: "/Photos-for-Site/Planetariy.webp",
    title: t(
      "«День космонавтики» в Планетарии",
      "Planetariydagi “Kosmonavtika kuni”"
    ),
    location: t("Планетарий", "Planetariy"),
    categoryLabel: t("Детям", "Bolalar"),
  }),

  ...makeRecurringEvents({
    idPrefix: "textile-expo",
    slug: "event-textile-expo-2026",
    startDate: "2026-05-13",
    endDate: "2026-05-15",
    image: "/Photos-for-Site/Textile.webp",
    title: t("Textile Expo 2026", "Textile Expo 2026"),
    location: t("УзЭкспоцентр", "UzExpoCenter"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  ...makeRecurringEvents({
    idPrefix: "next-mba",
    slug: "event-next-mba-2026",
    startDate: "2026-05-21",
    endDate: "2026-05-22",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("NEXT MBA 2026", "NEXT MBA 2026"),
    location: t("Humo Arena", "Humo Arena"),
    categoryLabel: t("Форум", "Forum"),
  }),

  makeSingleEvent({
    id: "million-2026-04-01",
    slug: "event-million-2026",
    date: "2026-04-01",
    image: "/Photos-for-Site/Million.webp",
    title: t("Коллектив Million", "Million guruhi"),
    location: t("Дворец «Дружба народов»", "Xalqlar do‘stligi saroyi"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "uzfood-2026-04-01",
    slug: "event-uzfood-2026",
    date: "2026-04-01",
    image: "/Photos-for-Site/UzFood.webp",
    title: t("UzFood 2026", "UzFood 2026"),
    location: t("УзЭкспоцентр", "UzExpoCenter"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  makeSingleEvent({
    id: "ozupack-2026-04-01",
    slug: "event-ozupack-2026",
    date: "2026-04-01",
    image: "/Photos-for-Site/AfricanCircus.webp",
    title: t("O’ZuPACK 2026", "O’ZuPACK 2026"),
    location: t("УзЭкспоцентр", "UzExpoCenter"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  makeSingleEvent({
    id: "ecommerce-expo-2026-04-01",
    slug: "event-ecommerce-central-asia-expo-2026",
    date: "2026-04-01",
    image: "/Photos-for-Site/AfricanCircus.webp",
    title: t(
      "E-commerce Central Asia Expo 2026",
      "E-commerce Central Asia Expo 2026"
    ),
    location: t("AZIMUT Grand Hotel Tashkent", "AZIMUT Grand Hotel Tashkent"),
    categoryLabel: t("Форум", "Forum"),
  }),

  makeSingleEvent({
    id: "caex-mebel-2026-04-02",
    slug: "event-caex-mebel-2026",
    date: "2026-04-02",
    image: "/Photos-for-Site/CAeX.webp",
    title: t("CAEx Mebel & Décor 2026", "CAEx Mebel & Décor 2026"),
    location: t("CAEx Uzbekistan", "CAEx Uzbekistan"),
    categoryLabel: t("Выставка", "Ko‘rgazma"),
  }),

  makeSingleEvent({
    id: "world-souvenirs-2026-04-03",
    slug: "event-world-souvenirs-central-europe",
    date: "2026-04-03",
    image: "/Photos-for-Site/Cirk.webp",
    title: t(
      "World’s Souvenirs: Центральная Европа",
      "World’s Souvenirs: Markaziy Yevropa"
    ),
    location: t(
      "Государственная консерватория Узбекистана",
      "O‘zbekiston davlat konservatoriyasi"
    ),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "african-circus-2026-04-04",
    slug: "event-african-circus",
    date: "2026-04-04",
    image: "/Photos-for-Site/AfricanCircus.webp",
    title: t("Африканский цирк", "Afrika sirki"),
    location: t("Государственный цирк Узбекистана", "O‘zbekiston davlat sirki"),
    categoryLabel: t("Шоу", "Shou"),
  }),

  makeSingleEvent({
    id: "jony-2026-04-04",
    slug: "event-jony-april",
    date: "2026-04-04",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("JONY", "JONY"),
    location: t("Humo Arena", "Humo Arena"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "marathon-2026-04-05",
    slug: "event-tashkent-marathon-2026",
    date: "2026-04-05",
    image: "/Photos-for-Site/Cirk.webp",
    title: t(
      "VIII Ташкентский международный марафон",
      "VIII Toshkent xalqaro marafoni"
    ),
    location: t("Humo Arena", "Humo Arena"),
    categoryLabel: t("Спорт", "Sport"),
  }),

  makeSingleEvent({
    id: "art-bazaar-2026-04-05",
    slug: "event-art-bazaar-2026",
    date: "2026-04-05",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Art Bazaar", "Art Bazaar"),
    location: t("AZIMUT Grand Hotel Tashkent", "AZIMUT Grand Hotel Tashkent"),
    categoryLabel: t("Маркет", "Market"),
  }),

  makeSingleEvent({
    id: "che-friends-2026-04-05",
    slug: "event-che-and-friends-2026",
    date: "2026-04-05",
    image: "/Photos-for-Site/CAeX.webp",
    title: t("Маркет CHE & Friends", "CHE & Friends market"),
    location: t("Nino", "Nino"),
    categoryLabel: t("Маркет", "Market"),
  }),

  makeSingleEvent({
    id: "dreams-changing-world-2026-04-05",
    slug: "event-dreams-changing-world-2",
    date: "2026-04-05",
    image: "/Photos-for-Site/Mechty.webp",
    title: t(
      "«Мечты, меняющие мир 2: В поисках призвания»",
      "“Dunyoni o‘zgartiradigan orzular 2: Kasbni izlab”"
    ),
    location: t(
      "Центральный Дворец Культуры Железнодорожников",
      "Temiryo‘lchilar markaziy madaniyat saroyi"
    ),
    categoryLabel: t("Детям", "Bolalar"),
  }),

  makeSingleEvent({
    id: "helene-julian-2026-04-13",
    slug: "event-helene-mercier-julian-rachlin",
    date: "2026-04-13",
    image: "/Photos-for-Site/file_69b7e2a2c8865_avif.avif",
    title: t(
      "Hélène Mercier and Julian Rachlin",
      "Hélène Mercier and Julian Rachlin"
    ),
    location: t(
      "Дворец международных форумов «Узбекистан»",
      "“O‘zbekiston” xalqaro forumlar saroyi"
    ),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "polina-gagarina-2026-04-16",
    slug: "event-polina-gagarina",
    date: "2026-04-16",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Полина Гагарина", "Polina Gagarina"),
    location: t("Alpomish", "Alpomish"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "boris-grebenshikov-2026-04-16",
    slug: "event-boris-grebenshikov-akvarium",
    date: "2026-04-16",
    image: "/Photos-for-Site/file_69b7ecdda2a38_avif.avif",
    title: t(
      "Борис Гребенщиков и группа «Аквариум»",
      "Boris Grebenshchikov va “Akvarium”"
    ),
    location: t(
      "O'zbekiston Milliy kino san'ati saroyi (Panorama)",
      "O'zbekiston Milliy kino san'ati saroyi (Panorama)"
    ),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "jony-2026-04-17",
    slug: "event-jony-april-17",
    date: "2026-04-17",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("JONY", "JONY"),
    location: t("Humo Arena", "Humo Arena"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "lone-2026-04-18",
    slug: "event-lone-2026",
    date: "2026-04-18",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Концерт L'One", "L'One konserti"),
    location: t(
      "«Узбекистан» — Государственный теннисный клуб",
      "“O‘zbekiston” davlat tennis klubi"
    ),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "max-richter-2026-04-21",
    slug: "event-max-richter-2026",
    date: "2026-04-21",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Макс Рихтер", "Max Richter"),
    location: t(
      "Дворец международных форумов «Узбекистан»",
      "“O‘zbekiston” xalqaro forumlar saroyi"
    ),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "caec-2026-04-24",
    slug: "event-caec-2026",
    date: "2026-04-24",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("CAEC 2026", "CAEC 2026"),
    location: t("Hilton Tashkent City", "Hilton Tashkent City"),
    categoryLabel: t("Форум", "Forum"),
  }),

  makeSingleEvent({
    id: "caec-2026-04-25",
    slug: "event-caec-2026",
    date: "2026-04-25",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("CAEC 2026", "CAEC 2026"),
    location: t("Hilton Tashkent City", "Hilton Tashkent City"),
    categoryLabel: t("Форум", "Forum"),
  }),

  makeSingleEvent({
    id: "benom-2026-05-01",
    slug: "event-benom-2026",
    date: "2026-05-01",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Группа Benom", "Benom guruhi"),
    location: t("Дворец «Дружба народов»", "Xalqlar do‘stligi saroyi"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "shedevry-music-2026-05-04",
    slug: "event-shedevry-mirovoy-muzyki",
    date: "2026-05-04",
    image: "/Photos-for-Site/Cirk.webp",
    title: t(
      "Концерт «Шедевры мировой музыки»",
      "“Jahon musiqasi durdonalari” konserti"
    ),
    location: t(
      "Дворец международных форумов «Узбекистан»",
      "“O‘zbekiston” xalqaro forumlar saroyi"
    ),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "late-love-2026-05-05",
    slug: "event-pozdnyaya-lyubov",
    date: "2026-05-05",
    image: "/Photos-for-Site/VanGog.webp",
    title: t("Спектакль «Поздняя любовь»", "“Kechki muhabbat” spektakli"),
    location: t("Дворец искусств «Туркистон»", "“Turkiston” san’at saroyi"),
    categoryLabel: t("Театр", "Teatr"),
  }),

  makeSingleEvent({
    id: "elmurod-2026-05-07",
    slug: "event-elmurod-haqnazarov",
    date: "2026-05-07",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Elmurod Haqnazarov", "Elmurod Haqnazarov"),
    location: t("Дворец «Дружба народов»", "Xalqlar do‘stligi saroyi"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "naruto-avatar-orchestra-2026-05-07",
    slug: "event-ne-prosto-orchestra-naruto-avatar",
    date: "2026-05-07",
    image: "/Photos-for-Site/Cirk.webp",
    title: t(
      'NE PROSTO ORCHESTRA "Наруто и Аватар"',
      'NE PROSTO ORCHESTRA "Naruto va Avatar"'
    ),
    location: t("Дворец искусств «Туркистон»", "“Turkiston” san’at saroyi"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "vxxv-prince-2026-05-08",
    slug: "event-vxxv-prince",
    date: "2026-05-08",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("V $ X V PRiNCE", "V $ X V PRiNCE"),
    location: t('СК "Юнусабад"', 'SK "Yunusobod"'),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "ruki-vverh-2026-05-18",
    slug: "event-ruki-vverh",
    date: "2026-05-18",
    image: "/Photos-for-Site/Cirk.webp",
    title: t(
      "Концерт группы «Руки вверх!»",
      "“Ruki Vverx!” guruhi konserti"
    ),
    location: t("Humo Arena", "Humo Arena"),
    categoryLabel: t("Концерт", "Konsert"),
  }),

  makeSingleEvent({
    id: "bitiruv-shou-2026-05-23",
    slug: "event-bitiruv-shou-2026",
    date: "2026-05-23",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Bitiruv shou 2026", "Bitiruv shou 2026"),
    location: t("Humo Arena", "Humo Arena"),
    categoryLabel: t("Шоу", "Shou"),
  }),
].sort((a, b) => a.date.localeCompare(b.date));