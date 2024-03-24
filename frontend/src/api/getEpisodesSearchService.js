import apiClient from "./apiClient";

const getEpisodesSearchService = (query, slug) => {
    let params = {
        q: query,
    }
    if (slug) {
        params['s'] = slug
    }
    return apiClient
        .get('podcasts/episode/search', {
            params
        })
        .then((res) => res.data)
}

export default getEpisodesSearchService;