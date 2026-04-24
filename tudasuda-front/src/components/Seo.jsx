import { Helmet } from "react-helmet-async";

const SITE_URL = "https://tudasuda.uz";
const BRAND = "ТудаСюда";
const DEFAULT_TITLE = "ТудаСюда — куда сходить в Ташкенте";
const DEFAULT_DESCRIPTION =
  "Места, события, развлечения и гастрономия Ташкента и Узбекистана.";
const DEFAULT_IMAGE = "/preview.jpg";

function getAbsoluteUrl(value) {
  if (!value) return SITE_URL;
  if (value.startsWith("http")) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = "",
  image = DEFAULT_IMAGE,
  type = "website",
  schema = null,
}) {
  const safeDescription = description || DEFAULT_DESCRIPTION;

  const fullTitle = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
  const fullUrl = canonical ? getAbsoluteUrl(canonical) : SITE_URL;
  const fullImage = getAbsoluteUrl(image || DEFAULT_IMAGE);

  const normalizedSchema = schema ? replaceSchemaUrls(schema, fullUrl) : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />

      <meta property="og:locale" content="ru_RU" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={BRAND} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={fullImage} />

      <link rel="canonical" href={fullUrl} />

      {normalizedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(normalizedSchema)}
        </script>
      )}
    </Helmet>
  );
}

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