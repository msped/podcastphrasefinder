import { useState } from 'react';
import Image from 'next/image';
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    Box,
    Accordion,
    Collapse,
    AccordionSummary,
    Link,
} from '@mui/material'
import { formatDistance } from 'date-fns';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExclusiveChip from '@/components/ExclusiveChip';

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
    logo: {
        height: 'auto',
        width: '100%',
        borderRadius: '5px',
        padding: '-10% 0',
    },
    logoWrapper: {
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
            xs: '.7rem',
            sm: '.85rem',
        },
        fontWeight: '600',
        color: '#fff',
        textDecoration: 'none'
    },
    publishedDate: {
        color: '#AAAAAA',
        fontSize: {
            xs: '.75rem',
            md: '.85rem',
        }
        
    },
    highlightText: {
        fontSize: {
            'lg': '1',
            'md': '.85rem',
            'sm': '.75rem',
            'xs': '.75rem'
        },
        textAlign: 'center'
    },
    accordionStyles: {
        border: 'none',
        boxShadow: 'none',
        '&:before': {
            display: 'none'
        },
    },
    accordionSummaryStyles: {
        maxWidth: {
            'xs': '100%',
            'sm': '46%',
            'md': '35%'
        },
        padding: '0 0'
    },
    cardContent: {
        width: '100%'
    },
}

export default function EpisodePanel({ item }) {
    const published_date = new Date(item.episode.published_date)
    const current_date_time = new Date()
    const [highlightIndex, setHighlightIndex] = useState(0)
    const highlightIndexLength = item.highlight ? item.highlight.length : 0
    const [isExpanded, setIsExpanded] = useState(false)

    const handleHighlightSelection = (direction) => () => {
        if (direction === 'next' && highlightIndex < item.highlight.length - 1) {
            setHighlightIndex(highlightIndex + 1);
        } else if (direction === 'prev' && highlightIndex > 0) {
            setHighlightIndex(highlightIndex - 1);
        }
    };

    const handleAccordionToggle = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <Card sx={styles.root}>
            <CardContent sx={styles.cardContent}>
                <Grid container spacing={2}>
                    <Grid item xs={3} sm={2}>
                        <Box sx={styles.logoWrapper}>
                            <Image
                                src={item.episode.channel.avatar}
                                style={{...styles.logo}}
                                alt={`${item.episode.channel.name} logo`}
                                width={160}
                                height={90}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={9} sm={10}>
                        <Stack spacing={.1}>
                            <Typography
                                variant='h6'
                                component='span'
                                sx={styles.episodeInformation}
                            >
                                {item.episode.title}{item.episode.exclusive && <ExclusiveChip />}
                            </Typography>
                            <Typography sx={styles.publishedDate} data-testid='time-since-test-id'>
                                {formatDistance(published_date, current_date_time)} ago
                            </Typography>
                            <Link
                                href={`https://www.youtube.com/channel/${item.episode.channel.channel_id}`}
                                target='_blank'
                                sx={styles.channelInformation}
                            >
                                {item.episode.channel.name}
                            </Link>
                            {
                                item.highlight && (
                                    <Accordion 
                                        disableGutters
                                        sx={styles.accordionStyles}
                                        expanded={isExpanded}
                                        onChange={handleAccordionToggle}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="match-highlights"
                                            id="match-highlights"
                                            sx={styles.accordionSummaryStyles}
                                        >
                                            <Typography sx={{ fontSize: '10pt' }}>
                                                See transcript matches
                                            </Typography>
                                        </AccordionSummary>
                                    </Accordion>
                                )}
                        </Stack>
                    </Grid>
                </Grid>
                {item.highlight && (
                    <Collapse in={isExpanded} mountOnEnter unmountOnExit>
                        <Stack direction='column' spcaing={2}>
                            <Button 
                                onClick={handleHighlightSelection('prev')} 
                                disabled={highlightIndex === 0}
                                aria-label='previous match'
                                fullWidth
                            >
                                <ArrowDropUpIcon />
                            </Button>
                            <Typography
                                dangerouslySetInnerHTML={
                                    {__html: item.highlight[highlightIndex]}
                                }
                                sx={styles.highlightText}
                            ></Typography>
                            <Button 
                                onClick={handleHighlightSelection('next')} 
                                disabled={highlightIndex === highlightIndexLength - 1}
                                aria-label='next match'
                                fullWidth
                            >
                                <ArrowDropDownIcon />
                            </Button>
                        </Stack>
                    </Collapse>
                )}
            </CardContent>
        </Card>
    )
}
