import { useEffect, useState } from 'react'
import postPodcastFormHook from '@/pages/creator/_api/postPodcastFormService';

const usePostPodcastFormHook = (formData) => {
    const [response, setResponse] = useState([])
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await postPodcastFormHook(formData)
            .then(res => {
                setResponse(res?.data);
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

    return { response, status, isLoading, error };
}

export default usePostPodcastFormHook;