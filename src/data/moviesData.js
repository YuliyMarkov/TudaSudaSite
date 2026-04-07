const t = (ru, uz = "") => ({ ru, uz });

export const moviesData = [
  {
    slug: "avatar-3-fire-and-ash",
    title: t("Аватар 3: Пепел и пламя", "Avatar 3: Kul va alanga"),
    poster: "/Previews/Avatar3.webp",
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    gallery: [
      "/Previews/Avatar3.webp",
      "/Photos-for-Site/Cirk.webp",
      "/Photos-for-Site/Planetariy.webp",
    ],
    description: t(
      "Новая глава масштабной фантастической саги. Зрителей ждут возвращение знакомых героев, новые миры Пандоры, крупные сражения и визуально впечатляющее приключение на большом экране.",
      "Mashhur fantastik dostonning yangi bobida tomoshabinlarni tanish qahramonlar, Pandoraning yangi olamlari, yirik janglar va katta ekrandagi ta’sirli sarguzasht kutadi."
    ),
    info: {
      genre: t("Фантастика, приключения", "Fantastika, sarguzasht"),
      duration: t("2 ч 40 мин", "2 soat 40 daqiqa"),
      age: "12+",
      premiere: t("Премьера", "Premyera"),
    },
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
    },
  },

  {
    slug: "minecraft-movie",
    title: t("Minecraft в кино", "Minecraft kinoda"),
    poster: "/Photos-for-Site/Planetariy.webp",
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    gallery: [
      "/Photos-for-Site/Planetariy.webp",
      "/Photos-for-Site/Mechty.webp",
      "/Photos-for-Site/Vystavka.webp",
    ],
    description: t(
      "Семейное приключение по мотивам популярной игровой вселенной. Фильм подходит для детей и взрослых и делает ставку на яркую картинку, юмор и динамику.",
      "Mashhur o‘yin olamiga asoslangan oilaviy sarguzasht filmi. Yorqin vizual, hazil va dinamika bilan bolalar ham, kattalar ham uchun mos."
    ),
    info: {
      genre: t("Семейный, приключения", "Oilaviy, sarguzasht"),
      duration: t("1 ч 52 мин", "1 soat 52 daqiqa"),
      age: "6+",
      premiere: t("Уже в кино", "Allaqachon kinoda"),
    },
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
    },
  },

  {
    slug: "new-marvel-movie",
    title: t("Новый фильм Marvel", "Yangi Marvel filmi"),
    poster: "/Photos-for-Site/Gagagoy.webp",
    trailer: "https://www.youtube.com/embed/ZkqK44XzPNk",
    gallery: [
      "/Photos-for-Site/Gagagoy.webp",
      "/Photos-for-Site/Kukhnya.webp",
      "/Photos-for-Site/Cirk.webp",
    ],
    description: t(
      "Новый блокбастер Marvel с большим экшеном, знакомыми героями и масштабной супергеройской историей.",
      "Marvel’ning yangi blokbaster filmi: kuchli ekshen, tanish qahramonlar va yirik superqahramon hikoyasi."
    ),
    info: {
      genre: t("Экшен, фантастика", "Ekshen, fantastika"),
      duration: t("2 ч 18 мин", "2 soat 18 daqiqa"),
      age: "12+",
      premiere: t("Скоро в прокате", "Tez orada prokatda"),
    },
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
    },
  },
];