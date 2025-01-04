import apiClient from "../../../api/apiClient";

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

export const TransferMembershipService = async (formData) => {
    const res = await apiClient
        .post('orgs/podcasts/transfer/ownership', {'requested_owner': formData});
    return res;
}