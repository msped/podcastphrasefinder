import { useEffect, useState } from 'react'
import getMostPopularService from '@/api/getMostPopularService'

const useGetMostPopularHook = () => {
    const [episode, setEpisode] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getMostPopularService()
            .then(setEpisode)
            setIsLoading(false)
        }
        fetchDataFromService()
    }, [])

    return { episode, isLoading };
}

export default useGetMostPopularHook;