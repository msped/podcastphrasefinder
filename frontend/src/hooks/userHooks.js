import { useState, useEffect } from 'react';
import { 
    getUserService,
    patchUserService
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