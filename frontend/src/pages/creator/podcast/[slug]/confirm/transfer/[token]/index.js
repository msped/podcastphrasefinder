import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
} from '@mui/material';
import { useGetConfirmTransferPodcastOwnershipHook } from '@/pages/creator/_hooks/membershipHooks';
import withDashboardLayout from '@/pages/creator/_components/withDashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

function TransferPodcastOwnershipConfirmationPage() {
    const router = useRouter();

    const { 
        status,
        error,
        isLoading,
        setSlug,
        setToken 
    } = useGetConfirmTransferPodcastOwnershipHook();

    useEffect(() => {
        if(!router.isReady) return;
        if (router.query && router.query.slug && router.query.token) {
            setSlug(router.query.slug);
            setToken(router.query.token);
        }
    }, [router.isReady])

    useEffect(() => {
        if (!status) return;
        switch (status) {
            case 200:
                toast.success('Podcast has been successfully transferred.');
                break;
            case 400:
                toast.error(error.error)
                break;
            case 403:
                toast.error('You do not have permission to complete this action.');
                break;
            case 404:
                toast.error('Podcast does not exist.');
                break;
            default:
                toast.error('An unexpected error occurred.');st.error('Podcast does not exist.')
        }
        router.push('/creator/podcast/settings');
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

export default withDashboardLayout(TransferPodcastOwnershipConfirmationPage);

