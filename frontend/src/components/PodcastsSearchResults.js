import useGetSearchPodcastsHook from '@/hooks/useGetSearchPodcastsHook'
import PodcastPanel from '@/components/PodcastPanel'
import { Grid, Stack } from '@mui/material'

import LoadingSpinner from './LoadingSpinner'

export default function PodcastsSearchResults({ query }) {
    const { results, isLoading } = useGetSearchPodcastsHook(query)

    if (isLoading && query.length > 3) {
        return (
            <Stack alignItems='center' alignContent='center' my={5}>
                <LoadingSpinner />
            </Stack>
        )
    }

    if (isLoading && results.length === 0) {
        return (
            <div>
                Search to see if we have your favourite podcasts!
            </div>
        )
    }

    if (!isLoading && results.length === 0) {
        return (
            <div>
                No results
            </div>
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
