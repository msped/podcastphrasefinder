import { useEffect, useState } from 'react';
import { getEpisodeService, patchEditEpisodeFormService, deleteEpisodesService } from '@/api/episodeServices'


export const useGetEpisodeHook = () => {
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

export const usePatchEditEpisodeFormHook = (episodeId, formData) => {
    const [status, setStatus] = useState(null)
    const [isPutLoading, setIsPutLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const patchDataToService = async () => {
            setIsPutLoading(true)
            await patchEditEpisodeFormService(episodeId, formData)
            .then(res => {
                setStatus(res?.status);
            }).catch(error => {
                setError(error)
            }).finally(() => {
                setIsPutLoading(false)
            })
        }
        if (formData) {
            patchDataToService();
        }
    }, [formData])

    return { status, isPutLoading, error };
}

export const useDeleteEpisodesHook = () => {
    const [statusResponse, setStatusResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const deleteEpisodes = async (episodeId) => { 
        setIsLoading(true);
        try {
            const response = await deleteEpisodesService(episodeId);
            setStatusResponse(response);
        } catch (error) {
            console.error("Error deleting selected episodes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { statusResponse, isLoading, deleteEpisodes }; 
}
