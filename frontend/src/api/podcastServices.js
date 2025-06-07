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

export const getFeedsService = async (podcastSlug) => {
    const res = await apiClient
        .get(`orgs/podcasts/${podcastSlug}/rss-feeds`);
    return res.data;
}

export const postFeedService = async (podcast, feedUrl) => {
    const res = await apiClient
        .post(`orgs/podcasts/${podcast.slug}/rss-feeds`, {
            podcast_id: podcast.id,
            rss_feed_url: feedUrl
        });
    return res.data;
}

export const deleteFeedService = async (podcastSlug, feedId) => {
    const res = await apiClient
        .delete(`orgs/podcasts/${podcastSlug}/rss-feeds/${feedId}`);
    return res.data;
}

export const getEpisodeReleaseDaysService = async (podcastSlug) => {
    const res = await apiClient
        .get(`orgs/podcasts/${podcastSlug}/schedule`);
    return res.data;
}

export const postEpisodeReleaseDaysService = async (podcast, day) => {
    const res = await apiClient
        .post(`orgs/podcasts/${podcast.slug}/schedule`, {
            podcast_id: podcast.id,
            day: day
        });
    return res.data;
}
export const deleteEpisodeReleaseDaysService = async (podcast, day) => {
    const res = await apiClient
        .delete(`orgs/podcasts/${podcast.slug}/schedule/${day.id}`);
    return res.data;
}