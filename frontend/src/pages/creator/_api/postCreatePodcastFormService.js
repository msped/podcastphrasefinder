import apiClient from "@/api/apiClient";

const postCreatePodcastFormService = (formData) => {
    return apiClient
        .post('creator/youtube/add', formData)
        .then((res) => {
            return { data: res.data, status: res.status }
        })
}

export default postCreatePodcastFormService;