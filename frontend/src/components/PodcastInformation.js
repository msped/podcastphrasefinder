import React from 'react'
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    CardActionArea,
} from '@mui/material';

import useGetPodcastInformationHook from '@/hooks/useGetPodcastInformationHook';

export default function PodcastInformation({ channelId }) {
    const { podcast, isLoading } = useGetPodcastInformationHook(channelId);

    const youtubeChannelLink = `https://www.youtube/channel/${channelId}`

    return (
        <Card>
            <CardActionArea href={youtubeChannelLink}>
                <CardContent sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Stack direction='column' spacing={1}>
                                <Typography 
                                    variant='h3'
                                    component='h1'
                                    fontFamily='Roboto, cursive'
                                    font fontWeight='500'
                                >
                                    {podcast.name}
                                </Typography>
                                <Typography variant='body2'>
                                    Number of Episodes: {podcast.no_of_episodes}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
