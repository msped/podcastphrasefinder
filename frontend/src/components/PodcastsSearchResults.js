import useGetPodcastsSearchHook from '@/hooks/useGetPodcastsSearchHook'
import PodcastPanel from '@/components/PodcastPanel'
import { Grid, Stack, Typography } from '@mui/material'

import LoadingSpinner from './LoadingSpinner'

export default function PodcastsSearchResults({ query }) {
    if (query !== undefined) {
        const { results, isLoading } = useGetPodcastsSearchHook(query)

        if (isLoading && query.length > 3) {
            return (
                <Stack alignItems='center' alignContent='center' my={5}>
                    <LoadingSpinner />
                </Stack>
            )
        }

        if (isLoading && results.length === 0) {
            return (
                <Stack alignItems='center' alignContent='center'>
                    <Typography>
                        Search to see if we have your favourite podcasts!
                    </Typography>
                </Stack>
            )
        }

        if (!isLoading && results.length === 0) {
            return (
                <Stack alignItems='center' alignContent='center'>
                    <Typography>
                        No results
                    </Typography>
                </Stack>
            )
        }

        return (
            <Grid container spacing={2}>
                {results.map((item) => (
                    <Grid item key={item.id} xs={12}>
                        <PodcastPanel podcast={item}/>
                    </Grid>
                ))}
            </Grid>
        )
    }

    return (
        <Stack alignItems='center' alignContent='center'>
            <Typography>
                Search to see if we have your favourite podcasts!
            </Typography>
        </Stack>
    )
}
