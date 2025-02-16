import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
    Container,
    Grid,
    Input,
} from '@mui/material';

import PodcastsSearchResults from '@/components/PodcastsSearchResults';

export default function PodcastSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query && router.query.podcast_q) {
            setSearchQuery(router.query.podcast_q);
        }
    }, [router.isReady])

    const handleInputChange = (e) => {
        if(!router.isReady) return;
        setSearchQuery(e.target.value)
        router.replace({
            pathname: '/',
            query: { podcast_q: e.target.value }
        }, undefined, { shallow: true })
    }

    return (
        <>
            <Container maxWidth='sm' sx={{ marginY: 2 }}>
                <Grid container spacing={2}>
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