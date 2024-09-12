import apiClient from "@/api/apiClient";

const deleteEpisodesService = (episodeId) => {
    return apiClient
        .delete(`creator/episodes/${episodeId}`)
        .then((res) => res.status)
}

export default deleteEpisodesService;