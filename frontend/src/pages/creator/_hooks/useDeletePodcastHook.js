import { useState, useEffect } from 'react';
import deletePodcastService from '@/pages/creator/_api/deletePodcastService';

export default function useDeletePodcastHook(slug) {
    const [status, setStatus] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const deletePodcast = async () => {
            await deletePodcastService(slug)
            .then(res => {
                setStatus(res.status);
                setError(null);
            })
            .catch(err => {
                setError(err.response.data);
                setStatus(err.response.status);
            })
        }
        if (slug) {
            deletePodcast();
        }
    }, [slug])

    return { status, error }
}
