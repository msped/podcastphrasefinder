import { useEffect, useState } from 'react';
import { getConfirmDeletePodcastService } from "@/api/membershipServices";


const useConfirmDeletePodcastHook = () => {
    const [slug, setSlug] = useState(null);
    const [token, setToken] = useState(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromService = async () => {
            setIsLoading(true);
            await getConfirmDeletePodcastService(slug, token)
            .then(res => {
                setStatus(res.status);
                setError(null);
            })
            .catch(err => {
                setError(err.response.data);
                setStatus(err.response.status);
            })
            .finally(setIsLoading(false))
            
        };

        if (slug && token) {
            fetchDataFromService();
        }
    }, [slug, token]);

    return { status, error, isLoading, setSlug, setToken };
};

export default useConfirmDeletePodcastHook;
