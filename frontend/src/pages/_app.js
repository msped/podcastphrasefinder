import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '@/theme';
import createEmotionCache from '@/createEmotionCache';
import Header from '@/components/Header'
import Footer from '@/components/Footer';
import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const {
    Component,
    emotionCache=clientSideEmotionCache,
    pageProps: { session, ...pageProps}
  } = props;

  return (
    <SessionProvider session={session}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Header />
            <main style={{ minHeight: '80vh' }}>
              <Component {...pageProps} />
            </main>
            <Footer />
          </ThemeProvider>
        </CacheProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}