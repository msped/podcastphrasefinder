import { useEffect, useState } from 'react';
import { patchEditEpisodeFormService, deleteEpisodesService } from '@/api/episodeServices'

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
