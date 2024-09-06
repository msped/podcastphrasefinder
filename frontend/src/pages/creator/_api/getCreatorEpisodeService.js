import apiClient from "../../../api/apiClient";

const getEpisodesSearchService = async (selectedPodcastOrg) => {
    const res = await apiClient
        .get(`creator/${selectedPodcastOrg}/episodes`);
    return res.data;
}

export default getEpisodesSearchService;