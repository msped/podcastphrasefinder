import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = () => {
    const defaultOptions = {
        baseURL: `${process.env.NEXT_PUBLIC_API_HOST}/api/`,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
    }
    
    const instance = axios.create(defaultOptions);

    instance.interceptors.request.use(async (request) => {
        const session = await getSession();
        if (session) {
            request.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return request;
    })

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.status === 401) {
                window.location.href = '/';
            }
            return Promise.reject(error)
        }
    )

    return instance;
}

export default apiClient();