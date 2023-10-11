import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { 
    Container,
    Grid,
    Input,
    Stack,
    Typography,
} from '@mui/material';

import Link from '@/components/Link';
import EpisodesSearchResults from '@/components/EpisodesSearchResults';

export default function Episodes() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query && router.query.q) {
            setSearchQuery(router.query.q);
        }
    }, [router.isReady])

    const handleInputChange = (e) => {
        if(!router.isReady) return;
        setSearchQuery(e.target.value)
        router.push({
            pathname: '/episodes',
            query: { q: e.target.value }
        })
    }

    return (
        <>
        <Head>
            <title>Search on a phrase you heard and find the podcast it came from. | PodFinder</title>
            <meta name="description" content="PodFinder allows you to search on transcripts to find where it came from." />
        </Head>
        <Container maxWidth='md' sx={{ marginY: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack 
                            direction='column' 
                            alignItems='center' 
                            alignContent='center'
                        >
                            <Typography variant='h3' component='h1' fontWeight={500}>
                                Search for an Episode
                            </Typography>
                            <Typography variant='subtitle1' component='p' fontWeight={500} sx={{ textAlign: 'center' }}>
                                You can see the Podcasts we have and the amount of episodes on <Link href="/podcasts">this page</Link>.
                            </Typography>
                        </Stack>
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
                        <EpisodesSearchResults query={searchQuery} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
