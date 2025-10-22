import { Layout } from '../page/pageLayout';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  const title = 'Girish Kor | Software Engineer & Creative Developer';
  const description =
    "I'm Girish Kor — a software engineer passionate about building elegant digital experiences. I blend technology and creativity through code, design, painting, and photography. Explore my work that bridges logic and artistry.";

  const siteUrl = 'https://www.girish-kor.dev';
  const image = `${siteUrl}/ProfileLight.png`;

  const jsonLd = {
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

  return [
    { title },
    { name: 'description', content: description },
    {
      name: 'keywords',
      content:
        'Girish Kor, software engineer, web developer, React, TypeScript, Java, Spring Boot, portfolio, frontend, backend, fullstack',
    },
    { name: 'author', content: 'Girish Kor' },
    {
      name: 'robots',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    { rel: 'canonical', href: siteUrl },

    // Sitemap + Resume (for crawlers)
    { name: 'sitemap', content: `${siteUrl}/sitemap.xml` },
    { name: 'resume', content: `${siteUrl}/Resume.pdf` },
    { rel: 'alternate', href: `${siteUrl}/Resume.pdf`, type: 'application/pdf' },

    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:site_name', content: 'Girish Kor Portfolio' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: 'Portrait of Girish Kor' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:creator', content: '@girishkor' },

    // JSON-LD Schema
    {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  ];
}

export default function Home() {
  return <Layout />;
}
