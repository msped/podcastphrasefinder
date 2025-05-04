import apiClient from "./apiClient";

export const getPodcastService = (slug) => {
    return apiClient
        .get(`podcasts/${slug}`)
        .then((res) => res.data)
}
