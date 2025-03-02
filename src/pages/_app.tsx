import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApiProvider } from '@/context/ApiContext';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Testing API Playground</title>
        <meta name="description" content="A playground for testing API endpoints" />
      </Head>
      <ApiProvider>
        <Component {...pageProps} />
      </ApiProvider>
    </>
  );
} 