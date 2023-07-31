import {
    Card,
    CardContent,
    Typography,
    Stack,
    Paper,
    Button,
} from '@mui/material'
import HeadphonesIcon from '@mui/icons-material/Headphones';
import Link from '@/components/Link'
import postEpisodeIncrementService from '@/api/postEpisodeIncrementService'

const styles = {
    root: {
        flexGrow: 1,
        padding: 0,
        display: 'flex'
    },
    buttonWrapper: {
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        maxWidth: {
            xs: '20%',
            sm: '15%',
            md: '10%'
        }
    },
    button: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        width: {
            xs: '80%',
            sm: '85%',
            md: '90%',
        }
    }
}

export default function EpisodePanel({ episode }) {
    const youtubeURL = `http://www.youtube.com/watch?v=${episode.video_id}`

    const handleTimeClickedIncrement = () => {
        postEpisodeIncrementService(episode.id)
    }

    return (
        <Card sx={{...styles.root}}>
            <CardContent sx={{...styles.cardContent}}>
                <Stack>
                    <Typography variant='h6' component='span' fontWeight={700}>
                        {episode.title} 
                    </Typography>
                    <Typography>
                        By <Link
                            href={`https://www.youtube.com/channel/${episode.channel.channel_id}`}
                            target='_blank'
                        >
                            {episode.channel.name}
                        </Link>
                    </Typography>
                </Stack>
            </CardContent>
            <Paper elevation={3} sx={{...styles.buttonWrapper}}>
                <Button
                    sx={{...styles.button}} 
                    onClick={handleTimeClickedIncrement}
                    href={youtubeURL}
                    target='_blank'
                    aria-label='listen to podcast'
                >
                    <HeadphonesIcon />
                </Button>
            </Paper>
        </Card>
    )
}
