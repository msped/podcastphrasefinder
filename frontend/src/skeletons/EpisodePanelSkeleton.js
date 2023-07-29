import React from 'react'
import {
    Skeleton,
    Typography,
    Stack,
    Card,
    Paper,
    CardContent,
    Button
} from '@mui/material'
import HeadphonesIcon from '@mui/icons-material/Headphones';

const styles = {
    root: {
        flexGrow: 1,
        padding: 0,
        display: 'flex',
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
        height: '115px',
        width: {
            xs: '80%',
            sm: '85%',
            md: '90%',
        }
    }
}

export default function EpisodePanelSkeleton() {
    return (
        <Card sx={{...styles.root}}>
            <CardContent sx={{...styles.cardContent}}>
                <Stack>
                    <Typography variant='h6' component='span'>
                        <Skeleton />
                    </Typography>
                    <Typography sx={{ width: '225px', pt: 1.5 }}>
                        <Skeleton />
                    </Typography>
                </Stack>
            </CardContent>
            <Paper elevation={3} sx={{...styles.buttonWrapper}}>
                <Button disabled sx={{...styles.button}}>
                    <HeadphonesIcon />
                </Button>
            </Paper>
        </Card>
    )
}
