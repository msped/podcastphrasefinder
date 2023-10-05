import React from 'react'
import {
    Box,
    Typography,
    Skeleton
} from '@mui/material';
import useGetMostPopularHook from '@/hooks/useGetMostPopularHook';

import EpisodePanel from '@/components/EpisodePanel'
import EpisodePanelSkeleton from '@/skeletons/EpisodePanelSkeleton'

export default function GetMostPopular() {
    const { episode, isLoading } = useGetMostPopularHook()

    if (!isLoading && episode.video_id === '') {
        return null
    }

    if (!isLoading) {
        return (
            <Box>
                <Typography 
                    variant='h5'
                    sx={{ textAlign: 'center' }}
                    component='p'
                    fontWeight={500}
                    pb={2}
                >
                    The most popular podcast on PodFinder
                </Typography>
                <EpisodePanel episode={episode}/>
            </Box>
        )
    }

    return (
        <div>
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography 
                        variant='h5'
                        sx={{ textAlign: 'center', width: '500px' }}
                        pb={2}
                    >
                        <Skeleton />
                </Typography>
            </Box>
            <EpisodePanelSkeleton />
        </div>
    )
}
