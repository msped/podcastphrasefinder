import apiClient from "./apiClient";

const getPodcastsSearchService = (query) => {
    return apiClient
        .get('podcasts/search', {
            params: { q: query }
        })
        .then((res) => res.data)
}

export default getPodcastsSearchService;