import React from 'react';
import {
    Container
} from '@mui/material'
import withDashboardLayout from '../_components/withDashboardLayout';
import CreatePodcastForm from '../_forms/CreatePodcastForm';

function PodcastNew() {
    return (
        <Container maxWidth="md">
            <CreatePodcastForm />
        </Container>
    )
}

export default withDashboardLayout(PodcastNew)