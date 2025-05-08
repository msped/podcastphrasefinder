import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
} from '@mui/material';
import { useConfirmDeletePodcastHook } from '@/hooks/membershipHooks';
import withDashboardLayout from '@/pages/creator/_components/withDashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

function DeletePodcastConfirmationPage() {
    const router = useRouter();

    const { status, error, isLoading, setSlug, setToken } = useConfirmDeletePodcastHook();

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query && router.query.slug && router.query.token) {
            setSlug(router.query.slug);
            setToken(router.query.token);
        }
    }, [router.isReady])

    useEffect(() => {
        if (status === 200) {
            toast.success('Podcast deleted successfully.');
            router.push('/creator/dashboard/episodes');
        } else if (status === 400) {
            toast.error(error);
            router.push('/creator/podcast/settings');
        } else if (status === 403 || status === 401) {
            toast.error('You do not have permission to complete this action.');
            router.push('/creator/dashboard/episodes');
        } else if (status === 404) {
            toast.error('Podcast does not exist.')
            router.push('/creator/dashboard/episodes');
        }
    }, [status, error, isLoading])

    return (
        <Box>
            {isLoading && !status && !error && (
                <Box>
                    <LoadingSpinner />
                </Box>
            )}
        </Box>
    )
}

export default withDashboardLayout(DeletePodcastConfirmationPage);

