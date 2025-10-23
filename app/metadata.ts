// metadata.ts
import type { MetaDescriptor } from 'react-router';

const siteUrl = 'https://www.girishkor.dev';
const siteName = 'Girish Kor | Software Engineer & Creative Developer';
const description =
  "I'm Girish Kor — a software engineer passionate about crafting accessible and performant digital experiences that bridge technology and creativity.";

const image = `${siteUrl}/ProfileLight.png`;

export const metadata: MetaDescriptor[] = [
  // Basic metadata
  { title: siteName },
  { name: 'description', content: description },
  { name: 'author', content: 'Girish Kor' },
  {
    name: 'keywords',
    content:
      'Girish Kor, software engineer, fullstack, React, TypeScript, Java, Spring Boot, portfolio, web developer',
  },
  { name: 'robots', content: 'index, follow' },
  { name: 'theme-color', content: '#0f172a' },

  // Canonical
  { rel: 'canonical', href: siteUrl },

  // Favicons
  { rel: 'icon', href: `${siteUrl}/icon/favicon.ico` },
  { rel: 'apple-touch-icon', href: `${siteUrl}/icon/apple-touch-icon.png` },
  { rel: 'sitemap', type: 'application/xml', href: `${siteUrl}/sitemap.xml` },

  // Open Graph
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Girish Kor Portfolio' },
  { property: 'og:title', content: siteName },
  { property: 'og:description', content: description },
  { property: 'og:image', content: image },
  { property: 'og:url', content: siteUrl },

  // Twitter Cards
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: siteName },
  { name: 'twitter:description', content: description },
  { name: 'twitter:image', content: image },
  { name: 'twitter:creator', content: '@girishkor' },
];

// Structured data (JSON-LD)
export const personJsonLd = {
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

export const websiteJsonLd = {
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

// Also export some common absolute asset URLs for reuse in the app if needed
export const assets = {
  favicon: `${siteUrl}/icon/favicon.ico`,
  appleTouchIcon: `${siteUrl}/icon/apple-touch-icon.png`,
  sitemap: `${siteUrl}/sitemap.xml`,
  robots: `${siteUrl}/robots.txt`,
  manifest: `${siteUrl}/site.webmanifest`,
};
