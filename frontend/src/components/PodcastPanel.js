import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Stack,
} from '@mui/material'

export default function PodcastPanel({ podcast }) {

    return (
        <Card>
            <CardActionArea href={`/podcasts/${podcast.slug}`}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction='row' spacing={2}>
                                <Avatar
                                    src={podcast.avatar}
                                    alt={podcast.name}
                                    sx={{
                                        height: 40,
                                        width: 40
                                    }}
                                />
                                <Typography variant='h6' component='span' fontWeight={700}>
                                    {podcast.name} 
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
