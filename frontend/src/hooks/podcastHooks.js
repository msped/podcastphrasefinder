import { useState, useEffect } from 'react';
import { getPodcastService } from '@/api/podcastServices';

export const useGetPodcastHook = (slug) => {
    const [podcast, setPodcast] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getPodcastService(slug)
            .then(setPodcast)
            setIsLoading(false)
        }
        if (slug) {
            fetchDataFromService();
        
        }
    }, [slug])

    return { podcast, isLoading };
}
