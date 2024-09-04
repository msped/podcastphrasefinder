import React, { useContext } from 'react';
import {
    MenuItem,
    Box,
    Select,
    Skeleton,
    Button,
} from '@mui/material';
import useGetPodcastOrgsHook from '@/hooks/useGetPodcastOrgsHook';
import { PodcastContext } from '@/context/PodcastContext';

const PodcastSwitcher = () => {
    const { selectedPodcastOrg, handlePodcastOrgChange } = useContext(PodcastContext);
    const { podcasts, isLoading } = useGetPodcastOrgsHook();

    if (isLoading) {
        return <Skeleton variant='rectangular' sx={{ borderRadius: '5px' }} width={140} height={40}/>;
    }

    if (!podcasts || podcasts.length === 0) {
        // This is a placeholder until I can get around to building it out.
        // Will need to decide if I should add this in as a page or a pop
        // up modal in the future. Will probably change with the creation
        // of the actual component instead of the select element.
        return <Button>Add your podcast</Button>;
    }

    return (
        <Box>
            <Select
                id="organisation-switcher"
                value={selectedPodcastOrg ? selectedPodcastOrg : 0}
                onChange={(e) => handlePodcastOrgChange(e.target.value)}
                size='small'
                defaultValue={0}
            >
                <MenuItem disabled value={0}>
                    Select a Podcast
                </MenuItem>
                {podcasts.map((org) => (
                    <MenuItem key={org.podcast.id} value={org.podcast.slug}>
                        {org.podcast.name}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

// This will need refactoring into an actual component in the future.
// For now this select will do the job. 

export default PodcastSwitcher;
