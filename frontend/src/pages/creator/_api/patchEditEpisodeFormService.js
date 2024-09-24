import apiClient from "../../../api/apiClient";

const patchEditEpisodeFormService = async (episodeId, formData) => {
    const res = await apiClient
        .patch(`creator/episodes/${episodeId}`, formData);
    return res;
}

export default patchEditEpisodeFormService;