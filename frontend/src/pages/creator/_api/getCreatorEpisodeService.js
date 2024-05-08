import apiClient from "../../../api/apiClient";

const getEpisodesSearchService = () => {
    return apiClient
        .get('creator/episodes')
        .then((res) => res.data)
}

export default getEpisodesSearchService;