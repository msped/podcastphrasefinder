import { useEffect, useState, useContext } from 'react';
import getCreatorEpisodeService from '@/pages/creator/_api/getCreatorEpisodeService';
import { PodcastContext } from '@/context/PodcastContext';

const useGetCreatorEpisodesHook = () => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { selectedPodcastOrg } = useContext(PodcastContext);

    useEffect(() => {
        async function fetchDataFromService() {
            const episodes = await getCreatorEpisodeService(selectedPodcastOrg.slug)
            setResults(episodes);
            setIsLoading(false);
        }
        if (selectedPodcastOrg !== null) {
            fetchDataFromService();
        } else {
            setIsLoading(false);
            setResults([]);
        }
    }, [selectedPodcastOrg]);

    return { results, isLoading, setResults };
}

export default useGetCreatorEpisodesHook;