import apiClient from "./apiClient";

const getEpisodesSearchService = (query) => {
    return apiClient
        .get('podcasts/epiosde/search', {
            params: { q: query }
        })
        .then((res) => res.data)
}

export default getEpisodesSearchService;