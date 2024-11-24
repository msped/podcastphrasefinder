import { createContext, useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import getOrgSelectionService from '@/api/getOrgSelectionService';
import postOrgSelectionService from "@/api/postOrgSelectionService";

const PodcastContext = createContext(null);

const PodcastProvider = ({ children }) => {
    const { data: session } = useSession();
    const [selectedPodcastOrg, setSelectedPodcastOrg] = useState(null);
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const fetchDataFromService = async () => {
            try {
                const fetchedOrg = await getOrgSelectionService();
                const primaryOrg = fetchedOrg.find(org => org.is_primary === true)
                if (primaryOrg) {
                    setSelectedPodcastOrg(primaryOrg.podcast);    
                }
                setIsFetched(true);
            } catch (err) {
                console.log(err);
            }
        };

        if (session && !isFetched && selectedPodcastOrg === null) {
            fetchDataFromService();
        }
    }, [session]); 

    const handlePodcastOrgChange = async (org) => {
        try {
            const orgResponse = await postOrgSelectionService(org);
            if (orgResponse) {
                setSelectedPodcastOrg(orgResponse.podcast);
            }
        } catch (err) {
            console.error("Error updating organization selection:", err);
        }
    };

    const value = { selectedPodcastOrg, handlePodcastOrgChange };

    return (
        <PodcastContext.Provider value={value}>
            {children}
        </PodcastContext.Provider>
    );
};

export { PodcastContext, PodcastProvider };
