import { useState, useEffect } from "react";
import { 
    getMembershipsService,
    patchMembershipsService,
    postMembershipsService,
    deleteMembershipsService
} from "../_api/membershipServices";

export const useGetMembershipsHook = () => {
    const [memberships, setMemberships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMemberships = async () => {
            const data = await getMembershipsService();
            setMemberships(data);
            setIsLoading(false);
        }

        if (memberships.length === 0){
            fetchMemberships()
        }
    }, [])

    return { memberships, isLoading, setMemberships };
}

export const usePostMembershipHook = (formData) => {
    const [response, setResponse] = useState([]);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const postData = async () => {
            try {
                const data = await postMembershipsService(formData);
                setResponse(data.data);
                setStatus(data.status);
                setError(null);
            } catch (error) {
                setError(error.response.data);
                setStatus(null);
            }
        }
        if (formData) {
            postData();
        }
    }, [formData]);

    return { response, status, error };
}

export const usePatchMembershipHook = (formData) => {
    const [response, setResponse] = useState([]);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const patchData = async () => {
            try {
                const data = await patchMembershipsService(formData.id, formData);
                setResponse(data.data);
                setStatus(data.status);
                setError(null);
            } catch (error) {
                setError(error);
                setStatus(null);
            }
        }
        if (formData) {
            patchData();
        }
    }, [formData]);

    return { response, status, error };
}

export const useDeleteMembershipHook = (memberId) => {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null)

    useEffect(() => {
        const deleteData = async () => {
            try {
                const response = await deleteMembershipsService(memberId);
                setStatus(response.status);
                setError(null);
            } catch (err) {
                setError(err.response.data);
                setStatus(null);
            }
        }
        if (memberId) {
            deleteData();
        }
    }, [memberId])
    
    return { status, error }
}   