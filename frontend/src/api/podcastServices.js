import apiClient from "./apiClient";

export const getPodcastService = (slug) => {
    return apiClient
        .get(`podcasts/${slug}`)
        .then((res) => res.data)
}

export const patchPodcastService = async (podcastSlug, formData) => {
    const res = await apiClient
        .patch(`orgs/podcasts/${podcastSlug}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    return res;
}

export const deletePodcastService = (slug) => {
    const res = apiClient
        .delete(`orgs/podcasts/${slug}`)
    return res;
}

export const getPodcastsSearchService = (query) => {
    return apiClient
        .get('podcasts/search', {
            params: { q: query }
        })
        .then((res) => res.data)
}

export const postPodcastFormService = (formData) => {
    return apiClient
        .post('orgs/podcasts', formData)
        .then((res) => {
            return { data: res.data, status: res.status }
        })
}