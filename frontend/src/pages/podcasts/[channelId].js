'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    Container,
    Grid,
    Input,
    InputAdornment,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import PodcastInformation from '@/components/PodcastInformation';
import PodcastInformationSkeleton from '@/skeletons/PodcastInformationSkeleton'
import EpisodesSearchResults from '@/components/EpisodesSearchResults';

export default function Podcasts() {
    const router = useRouter();
    const [channelId, setChannelId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.q !== undefined) {
            setSearchQuery(router.query.q);
        }
        if (router.query.channelId !== undefined) {
            setChannelId(router.query.channelId);
        }
    }, [router.isReady]);

    const handleInputChange = (e) => {
        if (!router.isReady) return;
        setSearchQuery(e.target.value);
        router.push({
            query: { q: e.target.value, channelId: channelId }
        });
    };

    return (
        <Container maxWidth="md" sx={{ marginY: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {channelId ? 
                    <PodcastInformation channelId={channelId} /> :
                    <PodcastInformationSkeleton /> }
                </Grid>
                <Grid item xs={12}>
                    <Input
                        id="outlined-search"
                        type="search"
                        variant='filled'
                        onChange={handleInputChange}
                        placeholder='Type the phrase or guests name'
                        fullWidth
                        value={searchQuery}
                        endAdornment={
                            <InputAdornment position="end" >
                                <IconButton edge="end">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <EpisodesSearchResults query={searchQuery} channelId={channelId} />
                </Grid>
            </Grid>
        </Container>
    )
}
