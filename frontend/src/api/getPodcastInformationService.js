import apiClient from "./apiClient";

const getPodcastInformationService = (slug) => {
    return apiClient
        .get(`podcasts/${slug}`)
        .then((res) => res.data)
}

export default getPodcastInformationService;