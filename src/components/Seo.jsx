import { Helmet } from "react-helmet-async";

function Seo({
  title = "ТудаСюда — куда сходить в Ташкенте",
  description = "Места, события, развлечения и гастрономия Ташкента и Узбекистана.",
  canonical = "",
  image = "/preview.jpg",
  type = "website",
  schema = null,
}) {
  const siteUrl = "https://tudasuda.uz";
  const brand = "ТудаСюда";

  const fullTitle = title.includes(brand)
    ? title
    : `${title} — ${brand}`;

  const fullUrl = canonical
    ? `${siteUrl}${canonical}`
    : siteUrl;

  const fullImage = image.startsWith("http")
    ? image
    : `${siteUrl}${image}`;

  // 🔥 нормальная подстановка URL без костылей
  const normalizedSchema = schema
    ? replaceSchemaUrls(schema, fullUrl)
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={brand} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Schema.org */}
      {normalizedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(normalizedSchema)}
        </script>
      )}
    </Helmet>
  );
}

// 🔥 рекурсивная замена __PAGE_URL__
function replaceSchemaUrls(obj, url) {
  if (typeof obj === "string") {
    return obj === "__PAGE_URL__" ? url : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceSchemaUrls(item, url));
  }

  if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replaceSchemaUrls(obj[key], url);
    }
    return newObj;
  }

  return obj;
}

export default Seo;