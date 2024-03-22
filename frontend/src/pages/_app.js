import * as React from 'react';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '@/components/Header'
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

export default function MyApp(props) {

  const { Component, pageProps: {...pageProps} } = props

  return (
    <Providers props={props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Toaster
        position="bottom-left"
        reverseOrder={true}
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff'
          }
        }}
      />
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </Providers>
  );
}