import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from '@mui/material'

export default function PodcastPanel({ podcast }) {
    return (
        <Card>
            <CardActionArea href={podcast.channel_link} target='_blank'>
                <CardContent>
                    <Typography variant='h6' component='span' fontWeight={700}>
                        {podcast.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
