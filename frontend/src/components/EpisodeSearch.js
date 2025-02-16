import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { 
    Grid,
    Input,
} from '@mui/material';

import EpisodesSearchResults from '@/components/EpisodesSearchResults';

export default function EpisodeSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query && router.query.episode_q) {
            setSearchQuery(router.query.episode_q);
        }
    }, [router.isReady])

    const handleInputChange = (e) => {
        if(!router.isReady) return;
        setSearchQuery(e.target.value)
        router.replace({
            pathname: '/',
            query: { episode_q: e.target.value }
        }, undefined, { shallow: true })
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
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
    )
}
