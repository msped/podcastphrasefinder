import useGetEpisodesSearchHook from '@/hooks/useGetEpisodesSearchHook'
import EpisodePanel from '@/components/EpisodePanel'
import { Grid, Stack, Typography } from '@mui/material'

import LoadingSpinner from './LoadingSpinner'

export default function EpisodesSearchResults({ query, channelId }) {
    if (query !== undefined) {
        const { results, isLoading } = useGetEpisodesSearchHook(query, channelId)
        if (isLoading && query.length > 3) {
            return (
                <Stack alignItems='center' alignContent='center' my={5}>
                    <LoadingSpinner />
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

        if (!isLoading && results.length > 0) {
            return (
                <Grid container spacing={2}>
                    {results.map((item) => (
                        <Grid item key={item.id} xs={12}>
                            <EpisodePanel episode={item}/>
                        </Grid>
                    ))}
                </Grid>
            )
        }
        
        return (
            <Stack alignItems='center' alignContent='center'>
                <Typography variant='body1' component='p' sx={{textAlign: 'center'}}>
                    Type the phrase you heard above to find the episode you heard it from.
                </Typography>
            </Stack>
        )
    }

    return (
        <Stack alignItems='center' alignContent='center'>
            <Typography variant='body1' component='p' sx={{textAlign: 'center'}}>
                Type the phrase you heard above to find the episode you heard it from.
            </Typography>
        </Stack>
    )
}
