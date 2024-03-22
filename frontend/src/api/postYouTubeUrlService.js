import apiClient from "./apiClient";

const postYouTubeUrlService = (url) => {
    return apiClient
        .post('creator/youtube/add/check', {
            'url': url
        })
        .then((res) => {
            return { data: res.data, status: res.status }
        })
}

export default postYouTubeUrlService;