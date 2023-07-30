import Head from 'next/head'
import { useState } from 'react'
import { 
    Container,
    Grid,
    Input,
    InputAdornment,
    IconButton,
    Stack,
    Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

import Link from '@/components/Link'
import EpisodesSearchResults from '@/components/EpisodesSearchResults'

export default function Episodes() {
    const [query, setQuery] = useState('')

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
                            <Typography variant='subtitle1' fontWeight={500} sx={{ textAlign: 'center' }}>
                                You can see the Podcasts we have and the amount of episodes on <Link href="/podcasts">this page</Link>.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="outlined-search"
                            type="search"
                            variant='filled'
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='Type the phrase or guests name'
                            fullWidth
                            value={query}
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
                        <EpisodesSearchResults query={query} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
