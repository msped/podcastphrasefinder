import apiClient from "@/api/apiClient";

const deletePodcastService = (slug) => {
    const res = apiClient
        .delete(`orgs/podcasts/${slug}`)
    return res;
}

export default deletePodcastService;