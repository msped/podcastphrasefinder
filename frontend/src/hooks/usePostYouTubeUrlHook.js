import { useEffect, useState } from 'react'
import postYouTubeUrlService from '@/api/postYouTubeUrlService'

const usePostYouTubeUrlHook = (url) => {
    const [transcript, setTranscript] = useState([])
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await postYouTubeUrlService(url)
            .then(res => {
                setTranscript(res?.data);
                setStatus(res?.status);
            })
            setIsLoading(false)
        }
        if (url !== '') {
            fetchDataFromService();
        }
    }, [url])

    return { transcript, status, isLoading };
}

export default usePostYouTubeUrlHook;