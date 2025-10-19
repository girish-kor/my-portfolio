import { Layout } from '../page/pageLayout';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  const title = 'Girish Kor — Frontend Engineer';
  const description =
    'Girish Kor is a frontend engineer building accessible, performant, and delightful web experiences. Explore projects, skills, and contact details.';
  const siteUrl = 'https://girish-kor.dev';

  return [
    { title },
    { name: 'description', content: description },
    {
      name: 'keywords',
      content: 'Girish Kor, frontend engineer, React, TypeScript, web developer, portfolio',
    },
    { rel: 'canonical', href: siteUrl },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}/ProfileLight.png` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${siteUrl}/ProfileLight.png` },
  ];
}

export default function Home() {
  return <Layout />;
}
