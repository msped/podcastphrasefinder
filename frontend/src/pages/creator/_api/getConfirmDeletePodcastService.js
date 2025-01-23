import apiClient from "@/api/apiClient";

export default function getConfirmDeletePodcastService(slug, token) {
    const res = apiClient
        .get(`orgs/podcasts/${slug}/confirm/delete/${token}`)
    return res;
}
