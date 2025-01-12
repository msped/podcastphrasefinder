import React, { useContext } from 'react'
import {
    Container,
    Card,
    CardContent,
    Box,
    Stack,
} from '@mui/material'
import withDashboardLayout from '../_components/withDashboardLayout';
import { PodcastContext } from '@/context/PodcastContext';

import PodcastSettings from '../_components/PodcastSettings';
import UserManagement from '../_components/UserManagement';
import DeletePodcast from '../_components/DeletePodcast';
import LoadingSpinner from '@/components/LoadingSpinner';

function Settings() {
    const { selectedPodcastOrg } = useContext(PodcastContext);

    return (
        <Container maxWidth='md' sx={{ py: 2 }}>
            <Card>
                <CardContent>
                {selectedPodcastOrg === null ? (
                    <Box>
                        <LoadingSpinner />
                    </Box>
                ) : (
                    <Stack direction='column' spacing={3}>
                        <PodcastSettings podcast={selectedPodcastOrg} />
                        <UserManagement />
                        <DeletePodcast podcast={selectedPodcastOrg} />
                    </Stack>
                )}
                </CardContent>
            </Card>
        </Container>
    )
}

export default withDashboardLayout(Settings)
