import { useState } from 'react'
import getRandomEpisodeService from '@/api/getRandomEpisodeService'

const useGetRandomEpisodeHook = (slug) => {
    const [episode, setEpisode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchRandomEpisode = async () => { 
        setIsLoading(true);
        try {
            const data = await getRandomEpisodeService(slug);
            setEpisode(data);
        } catch (error) {
            console.error("Error fetching random episode:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { episode, isLoading, fetchRandomEpisode }; 
}

export default useGetRandomEpisodeHook;
