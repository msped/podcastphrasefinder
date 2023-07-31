import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Grid,
} from '@mui/material'

export default function PodcastPanel({ podcast }) {
    const channel_link = `https://www.youtube.com/channel/${podcast.channel_id}`

    return (
        <Card>
            <CardActionArea href={channel_link} target='_blank'>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant='h6' component='span' fontWeight={700}>
                                {podcast.name} 
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            No. {podcast.no_of_episodes}
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
