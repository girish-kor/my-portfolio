import { Layout } from '../page/pageLayout';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Girish Kor' }, { name: 'description', content: 'Welcome to Girish Kor Portfolio!' }];
}

export default function Home() {
  return <Layout />;
}
