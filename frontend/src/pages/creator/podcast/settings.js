import React, { useContext } from 'react'
import {
    Container,
    Card,
    CardContent,
    Stack,
    Skeleton,
} from '@mui/material'
import withDashboardLayout from '../_components/withDashboardLayout';
import { PodcastContext } from '@/context/PodcastContext';
import { useGetPodcastHook } from '@/hooks/podcastHooks';

import PodcastSettings from '../_components/PodcastSettings';
import UserManagement from '../_components/UserManagement';
import DeletePodcast from '../_components/DeletePodcast';

function Settings() {
    const { selectedPodcastOrg } = useContext(PodcastContext);
    const { podcast, isLoading } = useGetPodcastHook(selectedPodcastOrg?.slug);

    return (
        <Container maxWidth='md' sx={{ py: 2 }}>
            <Card>
                <CardContent>
                {podcast || !isLoading ? (
                    <Stack direction='column' spacing={3}>
                        <PodcastSettings podcast={podcast} />
                        <UserManagement podcast={podcast}/>
                        <DeletePodcast podcast={podcast} />
                    </Stack>
                ): (
                    <Stack direction='column' spacing={3}>
                        <Skeleton variant="rectangular" height={175} />
                        <Skeleton variant="rectangular" height={175} />
                        <Skeleton variant="rectangular" height={175} />
                    </Stack>
                )}
                </CardContent>
            </Card>
        </Container>
    )
}

export default withDashboardLayout(Settings)
