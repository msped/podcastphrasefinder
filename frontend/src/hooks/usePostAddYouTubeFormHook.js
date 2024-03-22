import { useEffect, useState } from 'react'
import postAddYouTubeFormService from '@/api/postAddYouTubeFormService'

const usePostAddYouTubeFormHook = (formData) => {
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await postAddYouTubeFormService(formData)
            .then(res => {
                setStatus(res?.status);
                setIsLoading(true)
            }).catch((error) => {
                setError(error)
                setIsLoading(false)
            })
        }
        if (formData) {
            fetchDataFromService();
        }
    }, [formData])

    return { status, isLoading, error };
}

export default usePostAddYouTubeFormHook;