import apiClient from "./apiClient";

const postEpisodeIncrementService = (episodeId) => {
    return apiClient
        .post(`podcasts/episode/increment/${episodeId}`)
        .then((res) => res.data)
}

export default postEpisodeIncrementService;