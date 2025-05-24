import React from 'react';
import Head from 'next/head';
import { useGetUserHook } from '@/hooks/userHooks';
import { usePatchUserHook } from '@/hooks/userHooks';
import EditableField from '../_components/EditableField';
import {
    Container,
    Grid,
    Box,
    Typography,
    Paper,
} from '@mui/material';
import DeleteAccount from '../_components/DeleteAccount';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function index() {
    const { user, isLoading } = useGetUserHook();

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6">User not found</Typography>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>Account Settings | PodcastPhraseFinder</title>
            </Head>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box mb={3}>
                        <Typography component="h1" variant="h4" fontWeight="bold">
                            Account Settings
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <EditableField
                                fieldName="first_name"
                                onSave={usePatchUserHook}
                                children={user.first_name}
                                variant='subtitle1'
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <EditableField
                                fieldName="last_name"
                                onSave={usePatchUserHook}
                                children={user.last_name}
                                variant='subtitle1'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <EditableField
                                fieldName="email"
                                onSave={usePatchUserHook}
                                children={user.email}
                                variant='subtitle1'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DeleteAccount user={user}/>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
}
