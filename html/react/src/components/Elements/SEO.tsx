import {Helmet} from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  name: string;
  type: string;
}
export default function SEO({
  title,
  description,
  name,
  type,
}: SEOProps): JSX.Element {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content="https://app.yayo1.com/markedPDF/" />
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:url" content="https://app.yayo1.com/markedPDF/" />
      {/* meta keywords */}
      <meta
        name="keywords"
        content="Markdown, markdown editor, markdown to PDF, online markdown, PDF, markdown converter, convert to PDF, マークダウン, オンラインエディタ, マークダウンエディタ, PDF変換"
      />
    </Helmet>
  );
}
