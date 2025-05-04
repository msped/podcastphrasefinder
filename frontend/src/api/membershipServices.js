import apiClient from "@/api/apiClient";

export const getMembershipsService = async () => {
    const res = await apiClient
        .get('/orgs/memberships');
    return res.data;
}

export const postMembershipsService = async (formData) => {
    const res = await apiClient
        .post('/orgs/memberships', formData);
    return res;
}

export const patchMembershipsService = async (memberId, formData) => {
    const res = await apiClient
        .patch(`/orgs/memberships/${memberId}`, formData);
    return res;
}

export const deleteMembershipsService = async (memberId) => {
    const res = await apiClient
        .delete(`/orgs/memberships/${memberId}`);
    return res;
}

export const getOrgSelectionService = () => {
    return apiClient
        .get(`orgs/memberships/user`)
        .then((res) => {
            if (res.status === 200) {
                return res.data
            }
            return null
        })
}

export const postOrgSelectionService = (org) => {
    return apiClient
        .post(`/orgs/memberships/user`, {'slug': org})
        .then((res) => {
            if (res.status === 200) {
                return res.data
            }
            return null
        })
}

export const TransferMembershipService = async (slug, formData) => {
    const res = await apiClient
        .post(`orgs/podcasts/${slug}/transfer`, {'requested_owner': formData});
    return res;
}

export function getConfirmTransferPodcastOwnershipService(slug, token) {
    const res = apiClient
        .get(`orgs/podcasts/${slug}/confirm/transfer/${token}`)
    return res;
}