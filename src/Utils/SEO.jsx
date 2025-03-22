import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Rangi Lalls" />

      {/* Open Graph Meta Tags for Social Sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {/* Open Graph Image */}
      <meta
        property="og:image"
        content="https://www.rangilalls.com/Rangi-Lalls-logo.png"
      />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://www.rangilalls.com/Rangi-Lalls-logo.png"
      />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
