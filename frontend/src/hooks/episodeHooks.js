import { useEffect, useState } from 'react';
import { patchEditEpisodeFormService } from '@/api/episodeServices'

export const usePatchEditEpisodeFormHook = (episodeId, formData) => {
    const [status, setStatus] = useState(null)
    const [isPutLoading, setIsPutLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const patchDataToService = async () => {
            setIsPutLoading(true)
            await patchEditEpisodeFormService(episodeId, formData)
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