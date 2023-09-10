import { useEffect, useState } from 'react'
import getEpisodesSearchService from '@/api/getEpisodesSearchService'

const useGetEpisodesSearchHook = (query, channelId) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = () => {
            getEpisodesSearchService(query, channelId)
            .then(setResults)
            setIsLoading(false)
        }

        if (query.length >= 3 && !results.length > 0) {
            fetchDataFromService();
        } else {
            const timeoutId = setTimeout(() => {
                if (query.length >= 3) {
                    fetchDataFromService();
                }
            }, 750)
            return () => {
                clearTimeout(timeoutId)
            }
        }
    }, [query])

    return { results, isLoading };
}

export default useGetEpisodesSearchHook;