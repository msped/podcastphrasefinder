import React from 'react'
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    CardActionArea,
    Avatar
} from '@mui/material';

import useGetPodcastInformationHook from '@/hooks/useGetPodcastInformationHook';
import PodcastInformationSkeleton from '@/skeletons/PodcastInformationSkeleton';

export default function PodcastInformation({ channelId }) {
    const { podcast, isLoading } = useGetPodcastInformationHook(channelId);

    const youtubeChannelLink = `https://www.youtube.com/channel/${channelId}`

    return (
        <Card>
            {isLoading ? <PodcastInformationSkeleton /> : (
            <CardActionArea href={youtubeChannelLink} target='_blank'>
                <CardContent sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction='column' spacing={1}>
                                <Stack direction='row' spacing={2} marginY={1}>
                                    <Avatar
                                        alt={podcast.name}
                                        src={podcast.avatar}
                                        sx={{ height: 60, width: 60 }}
                                    />
                                    <Typography 
                                        variant='h3'
                                        component='h1'
                                        fontFamily='Roboto, cursive'
                                        fontWeight='500'
                                    >
                                        {podcast.name}
                                    </Typography>
                                </Stack>
                                <Typography variant='body2'>
                                    Number of Episodes: {podcast.no_of_episodes}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea> )}
        </Card>
    )
}
