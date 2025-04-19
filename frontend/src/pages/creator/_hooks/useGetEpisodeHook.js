import { useEffect, useState } from 'react';
import { getEpisodeService } from "@/api/episodeServices";

const useGetEpisodeHook = () => {
    const [episodeId, setEpisodeId] = useState(null);
    const [episode, setEpisode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromService = async () => {
            setIsLoading(true);
            try {
                const data = await getEpisodeService(episodeId);
                setEpisode(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setEpisode(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (episodeId !== null) {
            fetchDataFromService();
        } else {
            setIsLoading(false);
            setEpisode(null);
        }
    }, [episodeId]);

    return { episode, isLoading, error, setEpisodeId, setEpisode };
};

export default useGetEpisodeHook;
