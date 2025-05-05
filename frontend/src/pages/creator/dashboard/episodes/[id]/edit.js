import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Box,
    Backdrop,
} from '@mui/material';
import LoadingSpinner from '@/components/LoadingSpinner';
import EditEpisodeForm from '@/pages/creator/_forms/EditEpisodeForm';
import { useGetEpisodeHook } from '@/hooks/episodeHooks';
import withDashboardLayout from '@/pages/creator/_components/withDashboardLayout';

const Edit = () => {
    const router = useRouter();
    
    const { episode, isLoading, setEpisodeId, setEpisode } = useGetEpisodeHook();

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query && router.query.id) {
            setEpisodeId(router.query.id);
        }
    }, [router.isReady])

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <LoadingSpinner />
            </Backdrop>
            <Box>
                {episode && <EditEpisodeForm episode={episode} setEpisode={setEpisode} />}
            </Box>
        </Container>
    )
}

export default withDashboardLayout(Edit)
