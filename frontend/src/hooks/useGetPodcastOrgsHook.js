import { useEffect, useState } from 'react';
import getOrgSelectionService from '@/api/getOrgSelectionService';


const useGetPodcastOrgsHook = () => {
    const [podcasts, setPodcasts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getOrgSelectionService()
            .then(setPodcasts)
            setIsLoading(false)
        }
        fetchDataFromService()
    }, [])

    return { podcasts, isLoading };
}

export default useGetPodcastOrgsHook;