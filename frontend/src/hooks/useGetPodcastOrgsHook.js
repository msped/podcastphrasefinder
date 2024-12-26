import { useEffect, useState } from 'react';
import getPodcastOrgsService from '@/api/getPodcastOrgsService';

const useGetPodcastOrgsHook = () => {
    const [podcasts, setPodcasts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getPodcastOrgsService()
            .then(setPodcasts)
            setIsLoading(false)
        }
        fetchDataFromService()
    }, [])

    return { podcasts, isLoading };
}

export default useGetPodcastOrgsHook;