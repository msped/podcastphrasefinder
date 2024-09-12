import { useState } from 'react'
import deleteEpisodesService from '../_api/deleteEpisodesService'

const useDeleteEpisodesInBulkHook = () => {
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

export default useDeleteEpisodesInBulkHook;
