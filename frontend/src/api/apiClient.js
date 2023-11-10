import axios from "axios";

const apiClient = axios.create({
    baseURL: `${process.env.API_HOST}/api/`,
    headers: {"Content-Type": "application/json",
        accept: "application/json",
    },
});

export default apiClient;