import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
    Container,
    Grid,
    Input,
    InputAdornment,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
                <meta name="description" content="Find which podcasts and how many episodes are currently supported." />
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
                            <Typography variant='subtitle1' fontWeight={500}>
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
                        <PodcastsSearchResults query={searchQuery} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}