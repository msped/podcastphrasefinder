import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';

import podfinder_logo from '../../public/static/images/podfinder-no-bg.png'

const styles = {
    logoLink: {
        color: '#fff',
        textDecoration: 'none',
    },
    headerLink: {
        textDecoration: 'none',
        color: '#fff',
        fontSize: '13pt',
        cursor: 'pointer',
        fontWeight: '500',
        marginRight: '10px'
    }
}

export default function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Link href='/'>
                        <Image
                            src={podfinder_logo}
                            alt='PodFinder'
                            style={{
                                maxWidth: '70px',
                                height: 'auto',
                            }}
                        />
                    </Link>
                    <Link href="/" style={{...styles.logoLink}}>
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            PodFinder
                        </Typography>
                    </Link>
                    <Box sx={{
                        flexGrow: 1,
                    }}>
                        
                    </Box>
                    <Link href='/episodes' style={{...styles.headerLink}}>
                        Episodes
                    </Link>
                    <Link href='/podcasts' style={{...styles.headerLink}}>
                        Podcasts
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}