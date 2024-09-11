import apiClient from "./apiClient";

const getRandomEpisodeService = (slug) => {
    return apiClient
        .get(`podcasts/${slug}/episode/random`)
        .then((res) => res.data)
}

export default getRandomEpisodeService;