import { useEffect, useState } from 'react'
import getEpisodesSearchService from '@/api/getEpisodesSearchService'

const useGetEpisodesSearchHook = (query) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = () => {
            getEpisodesSearchService(query)
            .then(setResults)
            setIsLoading(false)
        }

        if (query.length >= 3 && !results.length > 0) {
            fetchDataFromService();
        } else {
            const timeoutId = setTimeout(() => {
                if (query) {
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