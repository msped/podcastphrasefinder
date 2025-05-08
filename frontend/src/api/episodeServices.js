import apiClient from "./apiClient";

export const getEpisodesSearchService = (query, slug) => {
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

export const getRandomEpisodeService = (slug) => {
    return apiClient
        .get(`podcasts/${slug}/episode/random`)
        .then((res) => res.data)
}

export const deleteEpisodesService = (episodeId) => {
    return apiClient
        .delete(`creator/episodes/${episodeId}`)
        .then((res) => res.status)
}

export const getEpisodeService = async (episodeId) => {
    const res = await apiClient
        .get(`creator/episodes/${episodeId}`);
    return res.data;
}

export const getCreatorEpisodeService = async (selectedPodcastOrg) => {
    const res = await apiClient
        .get(`creator/${selectedPodcastOrg}/episodes`);
    return res.data;
}

export const patchEditEpisodeFormService = async (episodeId, formData) => {
    const res = await apiClient
        .patch(`creator/episodes/${episodeId}`, formData);
    return res;
}
