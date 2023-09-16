import { useEffect, useState } from 'react'
import getPodcastsSearchService from '@/api/getPodcastsSearchService'

const useGetPodcastsSearchHook = (query) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = () => {
            getPodcastsSearchService(query)
            .then(setResults)
            setIsLoading(false)
        }

        const timeoutId = setTimeout(() => {
            if (query.length >= 3) {
                fetchDataFromService();
            }
            if (query.length == 0){
                setResults([]);
                setIsLoading(!isLoading);
            }
        }, 750)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [query])

    return { results, isLoading };
}

export default useGetPodcastsSearchHook;