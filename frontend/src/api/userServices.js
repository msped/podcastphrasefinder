import apiClient from "./apiClient"

export const getUserService = async () => {
    return await apiClient
        .get(`auth/user`)
        .then((res) => res.data)
}

export const patchUserService = async (formData) => {
    return await apiClient
        .patch(`auth/user`, formData)
        .then((res) => res)
}

export const deleteUserService = async () => {
    return await apiClient
        .delete(`auth/user/delete`)
        .then((res) => res)
}