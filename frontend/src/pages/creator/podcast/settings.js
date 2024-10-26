import React, { useContext } from 'react'
import {
    Container,
    Card,
    CardContent,
    Box,
} from '@mui/material'
import withDashboardLayout from '../_components/withDashboardLayout';
import { PodcastContext } from '@/context/PodcastContext';

import PodcastSettings from '../_components/PodcastSettings';
import UserManagement from '../_components/UserManagement';
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
                    <>
                        <PodcastSettings podcast={selectedPodcastOrg} />
                        <UserManagement podcast={selectedPodcastOrg}/>
                    </>
                )}
                </CardContent>
            </Card>
        </Container>
    )
}

export default withDashboardLayout(Settings)
