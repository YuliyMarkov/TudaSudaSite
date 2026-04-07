import { useLanguage } from "../context/useLanguage"
import Seo from "../components/Seo"

function AboutPage() {
  const { language } = useLanguage()

  const content = {
    ru: {
      title: "О нас",
      description:
        "«ТудаСюда» — мультиязычный медиапроект о местах, событиях, гастрономии и интересном досуге в Ташкенте и Узбекистане.",
      text: [
        "«ТудаСюда UZ» — это мультиязычный медиапроект о местах, событиях и развлечениях в Ташкенте и по всему Узбекистану. Мы развиваемся сразу на нескольких площадках — в Telegram, Instagram и YouTube — и объединяем аудиторию более 220 000 человек.",
        "Мы рассказываем о том, куда сходить, что попробовать, что посмотреть и как интересно провести время в городе. В центре нашего внимания — новые локации, яркие события, гастрономические открытия, акции, городские активности и всё, что делает досуг насыщеннее и интереснее.",
        "Наша основная аудитория — молодые и активные пользователи социальных сетей от 18 до 25 лет. Это люди, которые хотят быть в курсе всего самого интересного, ищут свежие идеи для отдыха, необычные места для встреч и актуальные события в Ташкенте.",
        "Особый акцент «ТудаСюда» делает на необычных, новых и малоизвестных локациях. Мы помогаем аудитории открывать Ташкент и Узбекистан с новой стороны — живо, современно и с интересом к городскому ритму."
      ]
    },

    uz: {
      title: "Biz haqimizda",
      description:
        "«TudaSuda UZ» — Toshkent va O‘zbekistondagi joylar, tadbirlar, gastronomiya va mazmunli hordiq haqida ko‘p tilli mediaproyekt.",
      text: [
        "«TudaSuda UZ» — bu Toshkent va butun O‘zbekistondagi joylar, tadbirlar hamda ko‘ngilochar imkoniyatlar haqida hikoya qiluvchi ko‘p tilli mediaproyekt. Biz Telegram, Instagram va YouTube platformalarida faoliyat yuritamiz va 220 000 dan ortiq auditoriyani birlashtiramiz.",
        "Biz qayerga borish, nimalarni tatib ko‘rish, nimalarni tomosha qilish va shaharda vaqtni qanday qiziqarli o‘tkazish mumkinligi haqida so‘z yuritamiz. E’tiborimiz markazida — yangi lokatsiyalar, yorqin tadbirlar, gastronomik kashfiyotlar, aksiyalar, shahar faolliklari va hordiqni yanada mazmunli qiladigan barcha narsalar.",
        "Bizning asosiy auditoriyamiz — 18–25 yoshdagi, ijtimoiy tarmoqlarda faol bo‘lgan yosh va harakatchan foydalanuvchilar. Ular doimo qiziqarli yangiliklardan xabardor bo‘lishni, dam olish uchun yangi g‘oyalarni, uchrashuvlar uchun noodatiy joylarni va Toshkentdagi dolzarb tadbirlarni izlaydi.",
        "«TudaSuda» ayniqsa noodatiy, yangi va kam tanilgan lokatsiyalarga alohida e’tibor qaratadi. Biz auditoriyaga Toshkent va O‘zbekistonni yangi tomondan kashf etishga yordam beramiz — zamonaviy, jonli va shahar ritmini his qilgan holda."
      ]
    }
  }

  const t = content[language] || content.ru
  const canonical = `/${language}/about`

  return (
    <main className="main container about-page">
      <Seo
        title={`${t.title} | ТудаСюда`}
        description={t.description}
        canonical={canonical}
        image="/Icons/O-Nas.webp"
        type="article"
      />

      <section className="article-page">
        <div className="article-layout">
          <article className="article-main">
            <h1>{t.title}</h1>

            <img
              src="/Icons/O-Nas.webp"
              alt={t.title}
            />

            {t.text.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        </div>
      </section>
    </main>
  )
}

export default AboutPage