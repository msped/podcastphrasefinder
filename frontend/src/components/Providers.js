import React from 'react'
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/createEmotionCache';
import theme from '@/theme';

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children, props }) {

    const {
        emotionCache=clientSideEmotionCache,
        pageProps: { session, ...pageProps}
    } = props;

    return (
        <SessionProvider session={session}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CacheProvider value={emotionCache}>
                    <ThemeProvider theme={theme}>
                        {children}
                    </ThemeProvider>
                </CacheProvider>
            </LocalizationProvider>
        </SessionProvider>
    )
}
