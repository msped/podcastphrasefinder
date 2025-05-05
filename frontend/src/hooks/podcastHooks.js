import { useState, useEffect } from 'react';
import { getPodcastService, getPodcastsSearchService } from '@/api/podcastServices';

export const useGetPodcastHook = (slug) => {
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

export const useGetPodcastsSearchHook = (query) => {
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
            getPodcastsSearchService(query)
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
    }, [query]);

    return { results, isLoading };
}
