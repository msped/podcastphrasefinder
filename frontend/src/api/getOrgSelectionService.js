import apiClient from "./apiClient";

const getOrgSelectionService = () => {
    return apiClient
        .get(`orgs/memberships/user`)
        .then((res) => {
            if (res.status === 200) {
                return res.data
            }
            return null
        })
}

export default getOrgSelectionService;