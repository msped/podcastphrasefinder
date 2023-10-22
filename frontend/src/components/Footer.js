import React from "react";
import { Container, Typography, Box, Grid, Stack, Paper} from "@mui/material";
import Link from '@/components/Link'

const styles = {
    paper: {
        width: '100%',
        position: 'static',
        bottom: 0,
    },
    link: {
        textDecoration: 'none',
        color: '#fff',
        fontSize: 15,
        '&:hover': {
            textDecoration: 'underline',
            color: '#bfbfbf'
        },
        paddingY: '.6rem'
    },
    copyright: {
        textDecoration: 'underline',
        color: '#fff',
        '&:hover': {
            color: '#bfbfbf'
        }
    }
}

function Copyright() {
    return (
        <Typography variant="body2" fontSize={14}>
            {"Copyright © "}
            <Link color="inherit" href="/" sx={{...styles.copyright}}>
                PodFinder
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default function Footer() {
    return (
        <Paper sx={{...styles.paper}}>
            <Container maxWidth="md">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "1rem",
                    }}
                >
                    <Box
                        component="footer"
                        sx={{
                            py: 2,
                            px: 1,
                            marginTop: 'calc(2% + 10px)'
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            mb={2}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Grid item xs={6} sm={6}>
                                <Stack direction='column'>
                                    <Link href='/' sx={{...styles.link}}>
                                        Home
                                    </Link>
                                    <Link href='/episodes' sx={{...styles.link}}>
                                        Search for an Episode
                                    </Link>
                                    <Link href='/podcasts' sx={{...styles.link}}>
                                        Podcasts
                                    </Link>
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Stack direction='column'>
                                    <Link href='/terms' sx={{...styles.link}}>
                                        Terms & Conditions
                                    </Link>
                                    <Link href='/privacy' sx={{...styles.link}}>
                                        Privacy Policy
                                    </Link>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack alignItems='center' alignContent='center'>
                                    <Copyright />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Paper>
    );
}
