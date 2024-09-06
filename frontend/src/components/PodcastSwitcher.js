import React, { useContext, useState } from 'react';
import {
    Box,
    Skeleton,
    Button,
    Divider,
    Typography,
    Stack,
    Grid,
    Avatar,
} from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useGetPodcastOrgsHook from '@/hooks/useGetPodcastOrgsHook';
import { PodcastContext } from '@/context/PodcastContext';

const PodcastSwitcher = () => {
    const [open, setOpen] = useState(false);
    const { selectedPodcastOrg, handlePodcastOrgChange } = useContext(PodcastContext);
    const { podcasts, isLoading } = useGetPodcastOrgsHook();

    if (isLoading) {
        return <Skeleton variant='rectangular' sx={{ borderRadius: '5px' }} data-testid='podcast-switcher-skeleton' width={140} height={40}/>;
    }

    const handleSwitchOpen = () => {
        setOpen(!open);
    }

    const filteredPodcasts = podcasts && podcasts.length > 0 ? podcasts.filter(item => item.slug !== selectedPodcastOrg?.slug): null;

    return (
        <>
            <Button 
                onClick={handleSwitchOpen}
                endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                sx={{
                    color: '#fff',
                    border: '1px solid rgba(81, 81, 81, 1)',
                    borderRadius: '5px',
                }}
            >
                {!podcasts || podcasts.length === 0 ? 'Select a podcast' : selectedPodcastOrg?.name}
            </Button>
            {open && (
                <ClickAwayListener onClickAway={handleSwitchOpen}>
                    <Box sx={{
                        zIndex: 1,
                        position: 'absolute',
                        padding: 1,
                        backgroundColor: '#2E2E2E',
                        borderRadius: '7.5px',
                        width: '230px',
                        maxHeight: '350px',
                        overflowY: 'auto'
                    }}>
                        <Stack direction='column' spacing={1}>
                        {filteredPodcasts && filteredPodcasts.map(item => (
                            <Box 
                                key={item.id} 
                                onClick={() => {
                                    handlePodcastOrgChange(item.podcast.slug)
                                    handleSwitchOpen()
                                
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    alignItems: 'center',
                                    padding: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(171, 71, 188, 0.08)'
                                    }
                                }}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <Avatar
                                            alt={item.podcast.name}
                                            src={item.podcast.avatar}
                                            sx={{ marginRight: 1, width: 35, height: 35 }}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Stack direction='column' spacing={0}>
                                            <Typography noWrap fontWeight={500}>
                                                {item.podcast.name}
                                            </Typography>
                                            <Typography variant='caption' fontWeight={500} color='textSecondary'>
                                                {item.role}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        </Stack>

                        {filteredPodcasts && <Divider variant='middle' sx={{ paddingY: 1 }}/>}
                        
                        <Button sx={{ color: '#fff' }} startIcon={<AddIcon />} fullWidth>
                            Create a Podcast
                        </Button>

                    </Box>
                </ClickAwayListener>
            )}
        </>
    );
};

export default PodcastSwitcher;
