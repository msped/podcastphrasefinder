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