import apiClient from "@/api/apiClient";

const postPodcastFormService = (formData) => {
    return apiClient
        .post('orgs/podcasts', formData)
        .then((res) => {
            return { data: res.data, status: res.status }
        })
}

export default postPodcastFormService;