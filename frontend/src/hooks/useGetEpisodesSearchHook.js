import { useEffect, useState } from 'react'
import getEpisodesSearchService from '@/api/getEpisodesSearchService'

const useGetEpisodesSearchHook = (query, slug) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            if (query.length >= 3) {
                fetchDataFromService();
            }
        }, 750);

        function fetchDataFromService() {
            getEpisodesSearchService(query, slug)
                .then(data => {
                    setResults(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setIsLoading(false);
                });
        }

        return () => clearTimeout(timeoutId); 
    }, [query, slug]);

    return { results, isLoading };
}

export default useGetEpisodesSearchHook;