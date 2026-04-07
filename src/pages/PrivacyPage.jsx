import { useLanguage } from "../context/useLanguage"
import Seo from "../components/Seo"

function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    ru: {
      title: "Политика конфиденциальности",
      description:
        "Политика конфиденциальности сайта «ТудаСюда»: обработка данных, cookie, аналитика, реклама и сторонние сервисы.",
    },
    uz: {
      title: "Maxfiylik siyosati",
      description:
        "«TudaSuda» sayti maxfiylik siyosati: ma’lumotlarni qayta ishlash, cookie, tahlil, reklama va uchinchi tomon servislar.",
    },
  }

  const t = content[language] || content.ru
  const isUZ = language === "uz"
  const canonical = `/${language}/privacy`

  return (
    <main className="main container about-page">
      <Seo
        title={`${t.title} | ТудаСюда`}
        description={t.description}
        canonical={canonical}
        image="/Icons/privacy.webp"
        type="article"
      />

      <section className="article-page">
        <div className="article-layout">
          <article className="article-main">
            <img src="/Icons/privacy.webp" alt={t.title} />

            <h1>{t.title}</h1>

            {!isUZ ? (
              <>
                <p>
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации
                  о пользователях сайта{" "}
                  <a href="https://tudasuda.uz" target="_blank" rel="noopener noreferrer">
                    https://tudasuda.uz
                  </a>.
                </p>

                <p>Используя сайт, пользователь подтверждает согласие с настоящей Политикой конфиденциальности.</p>

                <h2>1. Общие положения</h2>
                <p>
                  «ТудаСюда» — мультиязычный медиапроект о местах, событиях, развлечениях и гастрономии
                  в Ташкенте и Узбекистане.
                </p>
                <p>
                  Сайт носит информационный характер и публикует материалы о локациях, мероприятиях,
                  городских активностях, акциях и досуге.
                </p>
                <p>Настоящая Политика применяется только к сайту «ТудаСюда».</p>

                <h2>2. Какие данные могут собираться</h2>
                <p>При использовании сайта автоматически могут собираться следующие данные:</p>
                <ul>
                  <li>IP-адрес</li>
                  <li>данные о браузере, устройстве и операционной системе</li>
                  <li>посещённые страницы сайта</li>
                  <li>дата и время посещения</li>
                  <li>источник перехода на сайт</li>
                  <li>файлы cookie</li>
                </ul>

                <p>
                  Пользователь также может добровольно предоставить информацию через формы обратной связи,
                  электронную почту, Telegram или иные способы связи, указанные на сайте.
                </p>

                <h2>3. Для чего используется информация</h2>
                <p>Собранные данные могут использоваться для следующих целей:</p>
                <ul>
                  <li>обеспечение стабильной работы сайта</li>
                  <li>анализ посещаемости и интереса к материалам</li>
                  <li>улучшение структуры, контента и пользовательского опыта</li>
                  <li>обратная связь с пользователями</li>
                  <li>показ рекламных материалов</li>
                  <li>обеспечение безопасности и предотвращение технических сбоев</li>
                </ul>

                <h2>4. Cookie</h2>
                <p>
                  Сайт может использовать cookie-файлы для корректной работы отдельных функций, анализа
                  поведения пользователей и персонализации контента или рекламы.
                </p>
                <p>
                  Пользователь может изменить настройки cookie в своём браузере или полностью отключить
                  их использование.
                </p>

                <h2>5. Аналитика и реклама</h2>
                <p>
                  На сайте могут использоваться инструменты веб-аналитики и рекламные сервисы, которые
                  помогают оценивать посещаемость, интерес пользователей к контенту и эффективность
                  размещённых материалов.
                </p>
                <p>
                  В том числе сайт может использовать Google AdSense или аналогичные рекламные платформы.
                  Настройки персонализации рекламы доступны через{" "}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                    adssettings.google.com
                  </a>.
                </p>

                <h2>6. Сторонние сервисы</h2>
                <p>На сайте могут использоваться сторонние сервисы и платформы, включая:</p>
                <ul>
                  <li>Google Analytics и другие инструменты аналитики</li>
                  <li>Google AdSense и иные рекламные сервисы</li>
                  <li>Telegram</li>
                  <li>Instagram</li>
                  <li>YouTube</li>
                </ul>

                <p>
                  Эти сервисы могут обрабатывать обезличенные технические данные в рамках своей собственной
                  политики конфиденциальности.
                </p>

                <h2>7. Передача данных третьим лицам</h2>
                <p>
                  Администрация сайта не продаёт и не передаёт персональные данные пользователей третьим
                  лицам, за исключением случаев, предусмотренных законодательством, либо когда это необходимо
                  для работы используемых сервисов.
                </p>

                <h2>8. Защита информации</h2>
                <p>
                  Администрация сайта принимает разумные организационные и технические меры для защиты
                  информации пользователей от несанкционированного доступа, изменения, раскрытия или уничтожения.
                </p>

                <h2>9. Права пользователя</h2>
                <p>Пользователь имеет право:</p>
                <ul>
                  <li>получить информацию о том, какие данные могут обрабатываться</li>
                  <li>обратиться с запросом об удалении предоставленных данных</li>
                  <li>отключить cookie в настройках браузера</li>
                  <li>прекратить использование сайта в любое время</li>
                </ul>

                <h2>10. Изменения политики</h2>
                <p>
                  Администрация сайта вправе вносить изменения в настоящую Политику конфиденциальности
                  без предварительного уведомления. Актуальная версия всегда размещается на этой странице.
                </p>

                <h2>11. Контакты</h2>
                <p>
                  Email: <a href="mailto:info@tudasuda.uz">info@tudasuda.uz</a>
                </p>
                <p>
                  Telegram:{" "}
                  <a href="https://t.me/digest_media" target="_blank" rel="noopener noreferrer">
                    @digest_media
                  </a>
                </p>

                <h2>12. Согласие пользователя</h2>
                <p>
                  Продолжая использовать сайт, пользователь подтверждает, что ознакомился с настоящей
                  Политикой конфиденциальности и принимает её условия.
                </p>
              </>
            ) : (
              <>
                <p>
                  Ushbu Maxfiylik siyosati{" "}
                  <a href="https://tudasuda.uz" target="_blank" rel="noopener noreferrer">
                    https://tudasuda.uz
                  </a>{" "}
                  sayti foydalanuvchilari haqidagi ma’lumotlarni yig‘ish, qayta ishlash va himoya qilish
                  tartibini belgilaydi.
                </p>

                <p>Saytdan foydalanish orqali foydalanuvchi ushbu Maxfiylik siyosatiga rozilik bildiradi.</p>

                <h2>1. Umumiy qoidalar</h2>
                <p>
                  «TudaSuda» — Toshkent va O‘zbekiston bo‘ylab joylar, tadbirlar, ko‘ngilochar maskanlar
                  hamda gastronomiya haqida hikoya qiluvchi ko‘p tilli mediaproyekt.
                </p>
                <p>
                  Sayt axborot xarakteriga ega bo‘lib, lokatsiyalar, tadbirlar, shahar faolliklari,
                  aksiyalar va hordiq mavzusidagi materiallarni e’lon qiladi.
                </p>
                <p>Ushbu siyosat faqat «TudaSuda» saytiga nisbatan qo‘llaniladi.</p>

                <h2>2. Qanday ma’lumotlar yig‘ilishi mumkin</h2>
                <p>Saytdan foydalanganda avtomatik ravishda quyidagi ma’lumotlar yig‘ilishi mumkin:</p>
                <ul>
                  <li>IP-manzil</li>
                  <li>brauzer, qurilma va operatsion tizim haqidagi ma’lumotlar</li>
                  <li>ko‘rilgan sahifalar</li>
                  <li>kirish sanasi va vaqti</li>
                  <li>saytga qayerdan o‘tilgani</li>
                  <li>cookie fayllari</li>
                </ul>

                <p>
                  Foydalanuvchi, shuningdek, aloqa shakllari, elektron pochta, Telegram yoki saytda
                  ko‘rsatilgan boshqa aloqa usullari orqali ma’lumotni ixtiyoriy ravishda taqdim etishi mumkin.
                </p>

                <h2>3. Ma’lumotlardan foydalanish maqsadi</h2>
                <p>Yig‘ilgan ma’lumotlar quyidagi maqsadlarda ishlatilishi mumkin:</p>
                <ul>
                  <li>saytning barqaror ishlashini ta’minlash</li>
                  <li>kiruvchilar soni va kontentga qiziqishni tahlil qilish</li>
                  <li>sayt tuzilmasi, kontent va foydalanuvchi tajribasini yaxshilash</li>
                  <li>foydalanuvchilar bilan aloqa o‘rnatish</li>
                  <li>reklama materiallarini ko‘rsatish</li>
                  <li>xavfsizlikni ta’minlash va texnik nosozliklarning oldini olish</li>
                </ul>

                <h2>4. Cookie fayllari</h2>
                <p>
                  Sayt ayrim funksiyalarning to‘g‘ri ishlashi, foydalanuvchi xatti-harakatlarini tahlil qilish
                  va kontent yoki reklamani moslashtirish uchun cookie fayllardan foydalanishi mumkin.
                </p>
                <p>
                  Foydalanuvchi brauzer sozlamalarida cookie fayllarni boshqarishi yoki ularni butunlay o‘chirib
                  qo‘yishi mumkin.
                </p>

                <h2>5. Analitika va reklama</h2>
                <p>
                  Saytda veb-analitika vositalari va reklama servislaridan foydalanilishi mumkin. Ular
                  tashriflar sonini, foydalanuvchilarning kontentga qiziqishini va joylashtirilgan
                  materiallar samaradorligini baholashga yordam beradi.
                </p>
                <p>
                  Jumladan, sayt Google AdSense yoki shunga o‘xshash reklama platformalaridan foydalanishi
                  mumkin. Reklama moslashtirish sozlamalari{" "}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                    adssettings.google.com
                  </a>{" "}
                  orqali boshqariladi.
                </p>

                <h2>6. Uchinchi tomon servislar</h2>
                <p>Saytda quyidagi uchinchi tomon servis va platformalari qo‘llanilishi mumkin:</p>
                <ul>
                  <li>Google Analytics va boshqa analitika vositalari</li>
                  <li>Google AdSense va boshqa reklama servislar</li>
                  <li>Telegram</li>
                  <li>Instagram</li>
                  <li>YouTube</li>
                </ul>

                <p>
                  Ushbu servislar o‘z maxfiylik siyosatiga muvofiq ravishda ayrim texnik va anonim ma’lumotlarni
                  qayta ishlashi mumkin.
                </p>

                <h2>7. Ma’lumotlarni uchinchi shaxslarga uzatish</h2>
                <p>
                  Sayt ma’muriyati foydalanuvchilarning shaxsiy ma’lumotlarini sotmaydi va uchinchi shaxslarga
                  bermaydi, qonunchilikda nazarda tutilgan holatlar yoki foydalanilayotgan servislar ishlashi
                  uchun zarur bo‘lgan vaziyatlar bundan mustasno.
                </p>

                <h2>8. Ma’lumotlarni himoya qilish</h2>
                <p>
                  Sayt ma’muriyati foydalanuvchi ma’lumotlarini ruxsatsiz kirish, o‘zgartirish, oshkor qilish
                  yoki yo‘q qilishdan himoya qilish uchun oqilona tashkiliy va texnik choralarni ko‘radi.
                </p>

                <h2>9. Foydalanuvchi huquqlari</h2>
                <p>Foydalanuvchi quyidagi huquqlarga ega:</p>
                <ul>
                  <li>qanday ma’lumotlar qayta ishlanishi mumkinligi haqida bilish</li>
                  <li>taqdim etilgan ma’lumotlarni o‘chirishni so‘rash</li>
                  <li>brauzer sozlamalarida cookie fayllarni o‘chirish</li>
                  <li>istalgan vaqtda sayt foydalanishini to‘xtatish</li>
                </ul>

                <h2>10. Siyosatga o‘zgartirishlar kiritish</h2>
                <p>
                  Sayt ma’muriyati ushbu Maxfiylik siyosatiga oldindan ogohlantirmasdan o‘zgartirish kiritish
                  ҳуқуқига ega. Amaldagi versiya doim ushbu sahifada joylashtiriladi.
                </p>

                <h2>11. Aloqa</h2>
                <p>
                  Email: <a href="mailto:info@tudasuda.uz">info@tudasuda.uz</a>
                </p>
                <p>
                  Telegram:{" "}
                  <a href="https://t.me/digest_media" target="_blank" rel="noopener noreferrer">
                    @digest_media
                  </a>
                </p>

                <h2>12. Foydalanuvchi roziligi</h2>
                <p>
                  Saytdan foydalanishni davom ettirgan holda, foydalanuvchi ushbu Maxfiylik siyosati bilan
                  tanishganini va uning shartlarini qabul qilishini tasdiqlaydi.
                </p>
              </>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPage