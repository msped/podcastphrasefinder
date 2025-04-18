import { useEffect, useState } from 'react'
import getPodcastService from '@/api/getPodcastService'

const useGetPodcastHook = (slug) => {
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

export default useGetPodcastHook;