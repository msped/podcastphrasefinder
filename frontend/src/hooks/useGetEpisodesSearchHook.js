import { useEffect, useState } from 'react'
import getEpisodesSearchService from '@/api/getEpisodesSearchService'

const useGetEpisodesSearchHook = (query, slug) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = () => {
            getEpisodesSearchService(query, slug)
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

export default useGetEpisodesSearchHook;