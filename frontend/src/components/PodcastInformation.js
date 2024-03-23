import React from 'react';
import Head from 'next/head';
import {
    Typography,
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
        <>
            <Head>
                <title>
                    Find the episode of { 
                    podcast.name ? podcast.name : 'your favourite podcast'
                    } based on what was said. | PodcastPhraseFinder
                </title>
                <meta name="description" content="Find the episode you heard a phrase 
                from by searching through podcast transcripts. Easily locate the episode
                and show using PodcastPhraseFinder."
                />
            </Head>
            <Card>
                {isLoading || !podcast ? (
                    <PodcastInformationSkeleton />
                ) : (
                    <CardActionArea href={youtubeChannelLink} target='_blank'>
                        <CardContent sx={{ padding: 3 }}>
                            <Stack direction='column' spacing={1}>
                                <Stack alignItems='center' justifyItems='center'>
                                    <Avatar
                                        alt={podcast.name}
                                        src={podcast.avatar}
                                        sx={{
                                            height: 60,
                                            width: 60,
                                            display: {
                                                xs: 'inline-block',
                                                sm: 'none'
                                            }
                                        }}
                                    />
                                </Stack>
                                <Stack direction='row' spacing={2} marginY={1}>
                                    <Avatar
                                        alt={podcast.name}
                                        src={podcast.avatar}
                                        sx={{
                                            height: 60,
                                            width: 60,
                                            display: {
                                                xs: 'none',
                                                sm: 'inline-block',
                                            }
                                        }}
                                    />
                                    <Typography 
                                        variant='h3'
                                        component='h1'
                                        fontWeight='500'
                                        sx={{
                                            textAlign: {
                                                xs: 'center',
                                                sm: 'left'
                                            },
                                            flexGrow: 1
                                        }}
                                    >
                                        {podcast.name}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                )}
            </Card>
        </>
    );
}
