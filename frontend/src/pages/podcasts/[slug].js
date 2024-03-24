'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    Container,
    Grid,
    Input,
} from '@mui/material';

import PodcastInformation from '@/components/PodcastInformation';
import PodcastInformationSkeleton from '@/skeletons/PodcastInformationSkeleton'
import EpisodesSearchResults from '@/components/EpisodesSearchResults';

export default function Podcasts() {
    const router = useRouter();
    const [slug, setSlug] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.q !== undefined) {
            setSearchQuery(router.query.q);
        }
        if (router.query.slug !== undefined) {
            setSlug(router.query.slug);
        }
    }, [router.isReady]);

    const handleInputChange = (e) => {
        if (!router.isReady) return;
        setSearchQuery(e.target.value);
        router.push({
            query: { q: e.target.value, slug: slug }
        });
    };

    return (
        <Container maxWidth="md" sx={{ marginY: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {slug ? 
                    <PodcastInformation slug={slug} /> :
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
                    />
                </Grid>
                <Grid item xs={12}>
                    <EpisodesSearchResults query={searchQuery} slug={slug} />
                </Grid>
            </Grid>
        </Container>
    )
}
