import apiClient from "./apiClient";

const getMostPopularService = () => {
    return apiClient
        .get('podcasts/episode/popular')
        .then((res) => res.data)
}

export default getMostPopularService;