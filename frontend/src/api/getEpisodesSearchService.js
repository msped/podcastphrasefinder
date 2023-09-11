import apiClient from "./apiClient";

const getEpisodesSearchService = (query, channelId) => {
    let params = {
        q: query,
    }
    if (channelId) {
        params['c'] = channelId
    }
    return apiClient
        .get('podcasts/episode/search', {
            params
        })
        .then((res) => res.data)
}

export default getEpisodesSearchService;