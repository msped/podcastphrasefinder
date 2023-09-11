import apiClient from "./apiClient";

const getPodcastInformationService = (channelId) => {
    return apiClient
        .get(`podcasts/${channelId}`)
        .then((res) => res.data)
}

export default getPodcastInformationService;