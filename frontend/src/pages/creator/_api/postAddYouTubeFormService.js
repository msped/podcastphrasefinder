import apiClient from "@/api/apiClient";

const postAddYouTubeFormService = (formData) => {
    return apiClient
        .post('creator/youtube/add', formData)
        .then((res) => {
            return { data: res.data, status: res.status }
        })
}

export default postAddYouTubeFormService;