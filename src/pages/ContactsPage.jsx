import { useLanguage } from "../context/useLanguage"
import Seo from "../components/Seo"

function ContactsPage() {
  const { language } = useLanguage()

  const content = {
    ru: {
      title: "Контакты",
      description:
        "Контакты проекта «ТудаСюда», рекламные размещения, Telegram и ссылки на соцсети.",
      blocks: [
        {
          title: "Связаться с нами",
          items: [
            {
              label: "Email",
              text: "info@tudasuda.uz",
              href: "mailto:info@tudasuda.uz",
            },
          ],
        },
        {
          title: "По вопросам рекламы",
          items: [
            {
              label: "Telegram",
              text: "@digest_media",
              href: "https://t.me/digest_media",
            },
          ],
        },
        {
          title: "Предложить новость",
          items: [
            {
              label: "Telegram-бот",
              text: "@WriteUsAnythingBot",
              href: "https://t.me/WriteUsAnythingBot",
            },
          ],
        },
        {
          title: "Мы в соцсетях",
          items: [
            {
              label: "Telegram",
              text: "t.me/TudaSudaUz",
              href: "https://t.me/+zBdfoNGygiw3MzYy",
            },
            {
              label: "Instagram",
              text: "instagram.com/tudasudauz/",
              href: "https://www.instagram.com/tudasudauz/",
            },
            {
              label: "YouTube",
              text: "youtube.com/@tudasudauz",
              href: "https://www.youtube.com/@tudasudauz",
            },
          ],
        },
      ],
    },

    uz: {
      title: "Kontaktlar",
      description:
        "«TudaSuda» loyihasi kontaktlari, reklama bo‘yicha aloqa va ijtimoiy tarmoqlar.",
      blocks: [
        {
          title: "Biz bilan bog‘lanish",
          items: [
            {
              label: "Email",
              text: "info@tudasuda.uz",
              href: "mailto:info@tudasuda.uz",
            },
          ],
        },
        {
          title: "Reklama masalalari bo‘yicha",
          items: [
            {
              label: "Telegram",
              text: "@digest_media",
              href: "https://t.me/digest_media",
            },
          ],
        },
        {
          title: "Taklif yuborish",
          items: [
            {
              label: "Telegram-bot",
              text: "@WriteUsAnythingBot",
              href: "https://t.me/WriteUsAnythingBot",
            },
          ],
        },
        {
          title: "Ijtimoiy tarmoqlar",
          items: [
            {
              label: "Telegram",
              text: "t.me/TudaSudaUz",
              href: "https://t.me/+zBdfoNGygiw3MzYy",
            },
            {
              label: "Instagram",
              text: "https://www.instagram.com/tudasudauz/",
              href: "https://www.instagram.com/tudasudauz/",
            },
            {
              label: "YouTube",
              text: "https://www.youtube.com/@tudasudauz",
              href: "https://www.youtube.com/@tudasudauz",
            },
          ],
        },
      ],
    },
  }

  const t = content[language] || content.ru
  const canonical = `/${language}/contacts`

  return (
    <main className="main container about-page">
      <Seo
        title={`${t.title} | ТудаСюда`}
        description={t.description}
        canonical={canonical}
        image="/Icons/Kontakti.webp"
        type="article"
      />

      <section className="article-page">
        <div className="article-layout">
          <article className="article-main">
            <h1>{t.title}</h1>

            <img
              src="/Icons/Kontakti.webp"
              alt={t.title}
            />

            {t.blocks.map((block, index) => (
              <div key={index} className="contacts-block">
                <h3>{block.title}</h3>

                {block.items.map((item, i) => (
                  <p key={i}>
                    <strong>{item.label}:</strong>{" "}
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {item.text}
                    </a>
                  </p>
                ))}
              </div>
            ))}
          </article>
        </div>
      </section>
    </main>
  )
}

export default ContactsPage