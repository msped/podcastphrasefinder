import apiClient from "./apiClient";

const getPodcastService = (slug) => {
    return apiClient
        .get(`podcasts/${slug}`)
        .then((res) => res.data)
}

export default getPodcastService;