import apiClient from "../../../api/apiClient";

const getEpisodeService = async (episodeId) => {
    const res = await apiClient
        .get(`creator/episodes/${episodeId}`);
    return res.data;
}

export default getEpisodeService;