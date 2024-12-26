import React from 'react'
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import enGb from 'date-fns/locale/en-GB'
import { CacheProvider } from '@emotion/react';
import { PodcastProvider } from '@/context/PodcastContext';
import createEmotionCache from '@/createEmotionCache';
import theme from '@/theme';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children, props }) {

    const {
        emotionCache=clientSideEmotionCache,
        pageProps: { session, selectedPodcastOrg, ...pageProps}
    } = props;

    return (
        <SessionProvider session={session}>
            <PodcastProvider selectedPodcastOrg={selectedPodcastOrg}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGb}>
                    <AppCacheProvider {...props}>
                        <ThemeProvider theme={theme}>
                            {children}
                        </ThemeProvider>
                    </AppCacheProvider>
                </LocalizationProvider>
            </PodcastProvider>
        </SessionProvider>
    )
}
