import { useEffect, useState } from 'react'
import getCreatorEpisodeService from '@/pages/creator/_api/getCreatorEpisodeService'

const useGetCreatorEpisodesHook = () => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        function fetchDataFromService() {
            getCreatorEpisodeService()
                .then(data => {
                    setResults(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setIsLoading(false);
                });
        }
        fetchDataFromService();
    }, []);

    return { results, isLoading };
}

export default useGetCreatorEpisodesHook;