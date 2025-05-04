import { useEffect, useState } from 'react'
import { patchPodcastService } from '@/api/podcastServices'

const usePatchPodcastHook = (podcastSlug, formData) => {
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const patchDataToService = async () => {
            setIsLoading(true)
            await patchPodcastService(podcastSlug, formData)
            .then(res => {
                setStatus(res?.status);
            }).catch(error => {
                setError(error)
            }).finally(() => {
                setIsLoading(false)
            })
        }
        if (formData) {
            patchDataToService();
        }
    }, [formData])

    return { status, isLoading, error };
}

export default usePatchPodcastHook;