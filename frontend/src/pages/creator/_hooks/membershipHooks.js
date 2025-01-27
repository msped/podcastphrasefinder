import { useState, useEffect } from "react";
import { 
    getMembershipsService,
    patchMembershipsService,
    postMembershipsService,
    deleteMembershipsService,
    TransferMembershipService,
    getConfirmTransferPodcastOwnershipService
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

export const useTransferMembershipHook = (slug, formData) => {
    const [response, setResponse] = useState([]);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const transferOwnership = async () => {
            try {
                const response = await TransferMembershipService(slug, formData);
                setResponse(response.data)
                setStatus(response.status);
                setError(null);
            } catch (err) {
                setError(err.response.data);
                setStatus(null);
            } finally {
                setIsLoading(false)
            }
        }
        if (formData !== null) {
            setIsLoading(true);
            transferOwnership();
        }
    }, [slug, formData])
    
    return { response, status, error, isLoading }
}

export const useGetConfirmTransferPodcastOwnershipHook = () => {
    const [slug, setSlug] = useState(null);
    const [token, setToken] = useState(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromService = async () => {
            setIsLoading(true);
            await getConfirmTransferPodcastOwnershipService(slug, token)
            .then(res => {
                setStatus(res.status);
                setError(null);
            })
            .catch(err => {
                setError(err.response.data);
                setStatus(err.response.status);
            })
            .finally(setIsLoading(false))
            
        };

        if (slug && token) {
            fetchDataFromService();
        }
    }, [slug, token]);

    return { status, error, isLoading, setSlug, setToken };
};