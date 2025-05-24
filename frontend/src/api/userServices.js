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