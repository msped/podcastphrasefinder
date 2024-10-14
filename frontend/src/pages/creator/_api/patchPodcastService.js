import apiClient from "../../../api/apiClient";

const patchPodcastService = async (podcastSlug, formData) => {
    const res = await apiClient
        .patch(`orgs/podcasts/${podcastSlug}`, formData);
    return res;
}

export default patchPodcastService;