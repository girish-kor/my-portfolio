import type { MetaFunction } from '@remix-run/node';
import { Layout } from '../page/pageLayout';

export const meta: MetaFunction = () => {
  const siteUrl = 'https://www.girishkor.dev';
  const title = 'Girish Kor | Software Engineer & Creative Developer';
  const description =
    "I'm Girish Kor — a software engineer passionate about building elegant digital experiences. I blend technology and creativity through code, design, painting, and photography. Explore my work that bridges logic and artistry.";
  const image = `${siteUrl}/ProfileLight.png`;

  // --- Structured Data: Person ---
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Girish Kor',
    url: siteUrl,
    image,
    jobTitle: 'Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance / Independent',
    },
    sameAs: [
      'https://github.com/girish-kor',
      'https://www.linkedin.com/in/girish-kor-52078a349',
      'https://pin.it/7ATIkntA2',
    ],
    description,
  };

  // --- Structured Data: Website ---
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Girish Kor Portfolio',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return [
    // --- Basic Meta ---
    { title },
    { name: 'description', content: description },
    { name: 'author', content: 'Girish Kor' },
    {
      name: 'keywords',
      content:
        'Girish Kor, software engineer, web developer, React, TypeScript, Java, Spring Boot, portfolio, frontend, backend, fullstack',
    },
    {
      name: 'robots',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    { rel: 'canonical', href: siteUrl },

    // --- Open Graph (Facebook, LinkedIn) ---
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Girish Kor Portfolio' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: 'Portrait of Girish Kor' },
    { property: 'og:locale', content: 'en_US' },

    // --- Twitter Cards ---
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:creator', content: '@girishkor' },

    // --- Optional Enhancements ---
    { name: 'theme-color', content: '#ffffff' },
    { name: 'sitemap', content: `${siteUrl}/sitemap.xml` },
    { name: 'resume', content: `${siteUrl}/Resume.pdf` },
    { rel: 'alternate', href: `${siteUrl}/Resume.pdf`, type: 'application/pdf' },

    // --- JSON-LD Structured Data ---
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(personJsonLd),
    },
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(websiteJsonLd),
    },
  ];
};

export default function Home() {
  return <Layout />;
}
