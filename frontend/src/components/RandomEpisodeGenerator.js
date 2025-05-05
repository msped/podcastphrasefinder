import React from 'react';
import {
    Button,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CachedIcon from '@mui/icons-material/Cached';
import { useGetRandomEpisodeHook } from '@/hooks/episodeHooks';

export default function RandomEpisodeGenerator({ slug }) {
    const { episode, isLoading, fetchRandomEpisode } = useGetRandomEpisodeHook(slug);

    const handleRandomEpisodeClick = () => {
        fetchRandomEpisode();
    }

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            <Button startIcon={episode ? <CachedIcon /> : <ShuffleIcon/>} variant='contained' onClick={handleRandomEpisodeClick}>
                {episode ? 'Try again' : 'Random Episode' }
            </Button>
            <Box sx={{ display: 'flex' }}>
                {isLoading ? (
                    <CircularProgress />
                ) : 
                    episode && (
                        <Typography fontWeight={500} sx={{ margin: 1, fontSize: {
                            xs: '.8rem',
                            md: '1rem',
                        } }}>
                            {episode.title}
                        </Typography>
                )}
            </Box>
        </Box>
    )
}
