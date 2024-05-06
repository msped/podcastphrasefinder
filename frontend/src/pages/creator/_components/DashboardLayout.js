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

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    return (
        <Container maxWidth='xl'>
            <Box sx={{ display: 'flex', py: 5 }}>
                <Stack direction='column' spacing={1}>
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
