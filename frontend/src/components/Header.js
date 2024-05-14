import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/static/images/podcastphrasefinder-no-bg.png'
import { signIn } from "next-auth/react";
import AccountMenu from '@/components/AccountMenu';
import PodcastSwitcher from '@/components/PodcastSwitcher';
import SignedIn from '@/components/SignedIn';
import SignedOut from '@/components/SignedOut';

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
                    <Link href='/' aria-label="Home">
                        <Image
                            src={logo}
                            alt='PodcastPhraseFinder'
                            height={60}
                            width={60}
                        />
                    </Link>
                    <Link href="/" style={{...styles.logoLink}} aria-label='Home'>
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            PodcastPhraseFinder
                        </Typography>
                    </Link>

                    <SignedIn>
                        <PodcastSwitcher />
                    </SignedIn>

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
                    <SignedIn>
                        <AccountMenu />
                    </SignedIn>
                    <SignedOut>
                    <Button onClick={() => signIn('google', { callbackUrl: '/creator/dashboard/episodes' })}>
                        Sign in
                    </Button>
                    </SignedOut>
                </Toolbar>
            </AppBar>
        </Box>
    );
}