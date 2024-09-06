import apiClient from "./apiClient";

const getPodcastOrgsService = async () => {
    const res = await apiClient
        .get('auth/org/memberships');
    return res.data;
}

export default getPodcastOrgsService;