import { useState, useEffect } from 'react';
import { 
    getUserService,
    patchUserService,
    deleteUserService
} from '@/api/userServices';

export const useGetUserHook = () => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getUserService()
            .then(setUser);
            setIsLoading(false);
        }
        fetchDataFromService();
    }, [])

    return { user, isLoading };
}

export const usePatchUserHook = (urlParam = null, formData) => {
    const [status, setStatus] = useState(null)
    const [isPutLoading, setIsPutLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const patchDataToService = async () => {
            setIsPutLoading(true)
            await patchUserService(formData)
            .then(res => {
                setStatus(res?.status);
            }).catch(error => {
                setError(error)
            }).finally(() => {
                setIsPutLoading(false)
            })
        }
        if (formData) {
            patchDataToService();
        }
    }, [formData])

    return { status, isPutLoading, error };
}

export const useDeleteUserHook = (trigger) => {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const deleteUser = async () => {
            setIsLoading(true);
            try {
                const res = await deleteUserService();
                setStatus(res.status);
                setError(null);
            } catch (err) {
                setError(err.response?.data || err.message);
                setStatus(null);
            } finally {
                setIsLoading(false);
            }
        };
        if (trigger) {
            deleteUser();
        }
    }, [trigger]);

    return { status, error, isLoading };
};