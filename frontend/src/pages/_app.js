import * as React from 'react';
import Head from 'next/head';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '@/theme';
import createEmotionCache from '@/createEmotionCache';
import Header from '@/components/Header'
import Footer from '@/components/Footer';

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700', '900']
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <main className={roboto.className}>
          <Header />
            <div style={{ minHeight: '80vh' }}>
              <Component {...pageProps} />
            </div>
          <Footer />
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
}