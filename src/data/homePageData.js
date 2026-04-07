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
    image: "/Photos-for-Site/VanGog.webp",
    title: t("Мультимедийная выставка «Быть Ван Гогом»"),
    text: t(
      "Иммерсивное арт-событие для любителей живописи и современного формата выставок."
    ),
  },
  {
    slug: "event-dilorom-mamedova",
    image: "/Photos-for-Site/Vystavka.webp",
    title: t("Выставка «100 уникальных работ Дилором Мамедовой»"),
    text: t("Выставочный проект с большой подборкой работ художницы."),
  },
  {
    slug: "event-central-asia-kitchen",
    image: "/Photos-for-Site/Kukhnya.webp",
    title: t("Выставка «Кухня Центральной Азии»"),
    text: t("Проект о гастрономической культуре и традициях региона."),
  },
  {
    slug: "event-ga-ga-goy",
    image: "/Photos-for-Site/Gagagoy.webp",
    title: t("Выставка «Га га гой»"),
    text: t("Современная выставка в пространстве театра «Ильхом»."),
  },
  {
    slug: "event-african-circus",
    image: "/Photos-for-Site/AfricanCircus.webp",
    title: t("Африканский цирк"),
    text: t("Зрелищное шоу с артистами и цирковыми номерами."),
  },
  {
    slug: "event-million-2026",
    image: "/Photos-for-Site/Million.webp",
    title: t("Коллектив Million"),
    text: t("Один из самых заметных концертов месяца."),
  },
  {
    slug: "event-uzfood-2026",
    image: "/Photos-for-Site/UzFood.webp",
    title: t("UzFood 2026"),
    text: t(
      "Выставка для тех, кто интересуется едой, брендами и индустрией HoReCa."
    ),
  },
  {
    slug: "event-textile-expo-2026",
    image: "/Photos-for-Site/Textile.webp",
    title: t("Textile Expo 2026"),
    text: t("Масштабное событие в мире текстиля и производства."),
  },
];

export const moreNewsExtra = [
  {
    slug: "event-space-day-planetarium",
    image: "/Photos-for-Site/Planetariy.webp",
    title: t("«День космонавтики» в Планетарии"),
    text: t("Познавательная программа для всей семьи."),
  },
  {
    slug: "event-caex-mebel-2026",
    image: "/Photos-for-Site/CAeX.webp",
    title: t("CAEx Mebel & Décor 2026"),
    text: t(
      "Площадка для тех, кто следит за дизайном, мебелью и интерьерными решениями."
    ),
  },
  {
    slug: "event-dreams-changing-world-2",
    image: "/Photos-for-Site/Mechty.webp",
    title: t("«Мечты, меняющие мир 2: В поисках призвания»"),
    text: t("Семейное событие и вдохновляющая программа для детей."),
  },
  {
    slug: "event-polina-gagarina",
    image: "/Previews/Gagarina.webp",
    title: t("Полина Гагарина"),
    text: t("Большой концерт популярной певицы в Ташкенте."),
  },
  {
    slug: "event-jony-april",
    image: "/Previews/JONY.webp",
    title: t("JONY"),
    text: t("Концерт одного из самых популярных артистов современной сцены."),
  },
  {
    slug: "event-ruki-vverh",
    image: "/Previews/RukiVverkh.webp",
    title: t("Концерт группы «Руки вверх!»"),
    text: t("Большое шоу с хитами, знакомыми всем."),
  },
  {
    slug: "event-pozdnyaya-lyubov",
    image: "/Photos-for-Site/VanGog.webp",
    title: t("Спектакль «Поздняя любовь»"),
    text: t("Театральная постановка для любителей классических историй."),
  },
  {
    slug: "event-bitiruv-shou-2026",
    image: "/Photos-for-Site/Cirk.webp",
    title: t("Bitiruv shou 2026"),
    text: t("Яркое шоу-событие на крупной площадке города."),
  },
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