import { useState, useEffect } from 'react';
import { 
    getPodcastService,
    getPodcastsSearchService,
    deletePodcastService,
    patchPodcastService,
    postPodcastFormService,
    getFeedsService,
    postFeedService,
    deleteFeedService,
    getEpisodeReleaseDaysService
} from '@/api/podcastServices';

export const useGetPodcastHook = (slug) => {
    const [podcast, setPodcast] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getPodcastService(slug)
            .then(setPodcast)
            setIsLoading(false)
        }
        if (slug) {
            fetchDataFromService();
        
        }
    }, [slug])

    return { podcast, isLoading };
}

export const useGetPodcastsSearchHook = (query) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            return;
        }
    
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            if (query.length >= 3) {
                fetchDataFromService();
            }
        }, 750);
    
        function fetchDataFromService() {
            getPodcastsSearchService(query)
                .then(data => {
                    setResults(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setIsLoading(false);
                });
        }
    
        return () => clearTimeout(timeoutId); 
    }, [query]);

    return { results, isLoading };
}

export const usePatchPodcastHook = (podcastSlug, formData) => {
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

export const useDeletePodcastHook = (slug) => {
    const [status, setStatus] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const deletePodcast = async () => {
            await deletePodcastService(slug)
            .then(res => {
                setStatus(res.status);
                setError(null);
            })
            .catch(err => {
                setError(err.response.data);
                setStatus(err.response.status);
            })
        }
        if (slug) {
            deletePodcast();
        }
    }, [slug])

    return { status, error }
}

export const usePostPodcastFormHook = (formData) => {
    const [response, setResponse] = useState([])
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await postPodcastFormService(formData)
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

export const useGetFeedsHook = (podcastSlug) => {
    const [feeds, setFeeds] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getFeedsService(podcastSlug)
            .then(setFeeds)
            .catch((error) => {
                setError(error);
                setFeeds([]);
            }).finally(() => {
                setIsLoading(false)
            })
            setIsLoading(false)
        }
        if (podcastSlug) {
            fetchDataFromService();
        }
    }, [podcastSlug])

    return { feeds, isLoading, error, setFeeds };
}


export const useGetEpisodeReleaseDaysHook = (podcastSlug) => {
    const [releaseDays, setReleaseDays] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDataFromService = async () => {
            await getEpisodeReleaseDaysService(podcastSlug)
            .then(setReleaseDays)
            .catch((error) => {
                setError(error);
                setReleaseDays([]);
            }).finally(() => {
                setIsLoading(false)
            })
        }
        if (podcastSlug) {
            fetchDataFromService();
        }
    }, [podcastSlug])

    return { releaseDays, isLoading, error, setReleaseDays };
}
