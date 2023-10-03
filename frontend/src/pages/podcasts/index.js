import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
    Container,
    Grid,
    Input,
    Stack,
    Typography,
} from '@mui/material';

import PodcastsSearchResults from '@/components/PodcastsSearchResults';

export default function Podcasts() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query) {
            setSearchQuery(router.query.q);
        }
    }, [router.isReady])

    const handleInputChange = (e) => {
        if(!router.isReady) return;
        setSearchQuery(e.target.value)
        router.push({
            query: { q: e.target.value }
        })
    }

    return (
        <>
            <Head>
                <title>Find which podcasts and how many episodes are currently supported. | PodFinder</title>
                <meta name="description" content="Search and discover podcasts with ease. Explore a wide range of 
                    podcasts and search for them directly. Find episodes, topics, or keywords in the transcripts for a more 
                    personalized listening experience. Start exploring and find your favorite podcasts today!"
                />
            </Head>
            <Container maxWidth='sm' sx={{ marginY: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack 
                            direction='column' 
                            alignItems='center' 
                            alignContent='center'
                        >
                            <Typography variant='h2' component='h1' fontWeight={500}>
                                Podcasts
                            </Typography>
                            <Typography variant='subtitle1' component='p' fontWeight={500}>
                                See all the Podcasts and the amount of episodes we have transcripts for.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="outlined-search"
                            type="search"
                            variant='filled'
                            onChange={handleInputChange}
                            placeholder='Start typing the name of your favourite podcast'
                            fullWidth
                            value={searchQuery}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PodcastsSearchResults query={searchQuery} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}