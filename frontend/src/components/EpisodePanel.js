import Image from 'next/image';
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Paper,
    Button,
    Grid,
    Box,
    Avatar
} from '@mui/material'
import { formatDistance } from 'date-fns';
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
    },
    thumbnail: {
        height: 'auto',
        width: '100%',
        borderRadius: '5px',
        padding: '-10% 0',
    },
    thumbnailWrapper: {
        position: 'relative',
        width: '100%',
        height: 'auto',
        margin: 0,
        padding: 0,
    },
    episodeInformation: {
        fontWeight: '700',
        fontSize: {
            xs: '.8rem',
            md: '1.25rem',
        }
    },
    channelInformation: {
        fontSize: {
            xs: '.65rem',
            md: '1rem',
        },
        color: '#fff',
        textDecoration: 'none'
    },
    published_date: {
        color: '#AAAAAA',
        fontSize: {
            xs: '.75rem',
            md: '.85rem',
        }
        
    }
}

export default function EpisodePanel({ episode }) {
    const youtubeURL = `http://www.youtube.com/watch?v=${episode.video_id}`
    const published_date = new Date(episode.published_date)
    const current_date_time = new Date()

    const handleTimeClickedIncrement = () => {
        postEpisodeIncrementService(episode.id)
    }

    return (
        <Card sx={{...styles.root}}>
            <CardContent sx={{...styles.cardContent}}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Box sx={{...styles.thumbnailWrapper}}>
                            <Image
                                src={episode.thumbnail}
                                style={{...styles.thumbnail}}
                                alt={`${episode.title} thumbnail`}
                                width={1280}
                                height={720}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Stack>
                            <Typography
                                variant='h6'
                                component='span'
                                sx={{...styles.episodeInformation}}
                            >
                                {episode.title} 
                            </Typography>
                            <Typography sx={{...styles.published_date}} data-testid='time-since-test-id'>
                                {formatDistance(published_date, current_date_time)} ago
                            </Typography>
                            <Stack direction='row' spacing={1} marginY={1}>
                                <Avatar alt={episode.channel.name} src={episode.channel.avatar} sx={{ height: 30, width: 30 }}/>
                                <Link
                                    href={`https://www.youtube.com/channel/${episode.channel.channel_id}`}
                                    target='_blank'
                                    sx={{...styles.channelInformation}}
                                >
                                    {episode.channel.name}
                                </Link>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
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
