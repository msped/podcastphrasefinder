import { useEffect, useState } from 'react'
import getPodcastInformationService from '@/api/getPodcastInformationService'

const useGetPodcastInformationHook = (slug) => {
    const [podcast, setPodcast] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getPodcastInformationService(slug)
            .then(setPodcast)
            setIsLoading(false)
        }
        fetchDataFromService()
    }, [])

    return { podcast, isLoading };
}

export default useGetPodcastInformationHook;