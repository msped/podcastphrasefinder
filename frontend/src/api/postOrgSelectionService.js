import apiClient from "./apiClient";

const postOrgSelectionService = (org) => {
    return apiClient
        .post(`/orgs/memberships/user`, {'slug': org})
        .then((res) => {
            if (res.status === 200) {
                return res.data
            }
            return null
        })
}

export default postOrgSelectionService;