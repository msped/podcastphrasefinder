import apiClient from "./apiClient";

const getChannelsSearchService = (query) => {
    return apiClient
        .get('podcasts/search', {
            params: { q: query }
        })
        .then((res) => res.data)
}

export default getChannelsSearchService;