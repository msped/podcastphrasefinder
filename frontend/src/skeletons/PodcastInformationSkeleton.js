import React from 'react'
import { 
    CardContent,
    Grid,
    Typography,
    Stack,
    Skeleton    
} from '@mui/material'

export default function PodcastInformationSkeleton() {
    return (
            <CardContent sx={{ padding: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction='column' spacing={1}>
                            <Stack direction='row' spacing={2} marginY={1}>
                                <Skeleton variant='circular' height={60} width={60} />
                                <Typography 
                                    variant='h3'
                                    component='h1'
                                    fontWeight='500'
                                >
                                    <Skeleton width={250}/>
                                </Typography>
                            </Stack>
                            <Typography variant='body2'>
                                <Skeleton width={200} />
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
    )
}
