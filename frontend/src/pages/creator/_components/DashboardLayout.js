"use client"

import React from 'react';
import { 
    Container,
    Box,
    Stack,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function DashboardLayout({ children }) {
    const theme = useTheme();
    const pathname = usePathname();

    const isDesktop = useMediaQuery(theme.breakpoints.up('md')) 

    return (
        <Container maxWidth='xl'>
            <Box sx={{ display: isDesktop ? 'flex' : 'block', py: 2 }}>
                <Stack 
                    direction={ isDesktop ? 'column' : 'row' } 
                    spacing={1}
                    sx={{ py: isDesktop ? 0 : 2 }}
                >
                    <Link href='/creator/dashboard/episodes/add' passHref>
                        <Button
                            sx={{
                                display: 'flex',
                                color: '#fff',
                                fontWeight: pathname.startsWith('/creator/dashboard/episodes/add') ? "700" : "400"
                            }}
                            startIcon={<AddIcon />}
                        >
                            New Episode
                        </Button>
                    </Link>
                    <Link href='/creator/dashboard/episodes' passHref>
                        <Button
                            sx={{
                                display: 'flex',
                                color: '#fff',
                                fontWeight: pathname.startsWith('/creator/dashboard/episodes') ? "700" : "400"
                            }}
                            startIcon={<ViewListIcon />}
                        >
                            Episodes
                        </Button>
                    </Link>
                </Stack>
                <Box sx={{ flexGrow: 1 }}>
                    {children}
                </Box>
            </Box>
        </Container>
    )
}
