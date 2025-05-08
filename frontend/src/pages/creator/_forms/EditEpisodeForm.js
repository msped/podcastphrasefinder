import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    TextField,
    Box,
    Grid,
    FormControlLabel,
    Switch,
    Stack,
    Backdrop,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';

import { usePatchEditEpisodeFormHook } from '@/hooks/episodeHooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import TranscriptDialog from '../_components/TranscriptDialog';

export default function EditEpisodeForm({ episode }) {
    const router = useRouter();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [formDataState, setFormDataState] = useState(null);
    
    const { 
        id,
        title: initialTitle,
        published_date: initialPublishedDate,
        exclusive: initialExclusive,
        private_video: initialPrivateVideo,
        is_draft: initialIsDraft,
    } = episode.episode || {};

    const { transcript: initialTranscript } = episode

    const [title, setTitle] = useState(initialTitle || '');
    const [publishedDate, setPublishedDate] = useState(initialPublishedDate ? new Date(initialPublishedDate) : null);
    const [exclusive, setExclusive] = useState(initialExclusive || false);
    const [privateVideo, setPrivateVideo] = useState(initialPrivateVideo || false);
    const [isDraft, setIsDraft] = useState(initialIsDraft || false);
    const [transcript, setTranscript] = useState(initialTranscript || '');

    const { status, isPutLoading, error } = usePatchEditEpisodeFormHook(id, formDataState);

    useEffect(() => {
        if (status >= 200 && status < 300) {
            toast.success('Episode updated!');
            setTimeout(() => {
                router.push('/creator/dashboard/episodes');
            }, 1250)
            
        } else if (error) {
            for (const [key, value] of Object.entries(error.response.data)) {
                toast.error(`${key} - ${value}`);
            }
            setIsButtonDisabled(false);
        }
    }, [status, isPutLoading, error, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsButtonDisabled(true);

        const updatedData = {};

        const episodeData = {};

        if (title !== initialTitle) {
            episodeData.title = title;
        }
        if (publishedDate !== initialPublishedDate) {
            episodeData.published_date = publishedDate; 
        }
        if (exclusive !== initialExclusive) {
            episodeData.exclusive = exclusive;
        }
        if (privateVideo !== initialPrivateVideo) {
            episodeData.private_video = !privateVideo;
        }
        if (isDraft !== initialIsDraft) {
            episodeData.is_draft = isDraft;
        }
        if (transcript !== initialTranscript) {
            updatedData.transcript = transcript;
        }

        if (Object.keys(episodeData).length > 0) {
            updatedData.episode = episodeData;
        }

        setFormDataState(updatedData); 
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isPutLoading}
            >
                <LoadingSpinner />
            </Backdrop>
            <Grid container spacing={3} sx={{ padding: 1 }}>
                <Grid item xs={12} md={12}>
                    {episode && <TranscriptDialog transcript={initialTranscript} setTranscript={setTranscript} />}
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField
                        required
                        id="title"
                        type="text"
                        name="title"
                        label="Episode Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        inputProps={{ 'aria-label': 'Episode Title' }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <DatePicker
                        label="Published Date"
                        required
                        name="published_date"
                        value={publishedDate}
                        onChange={(newValue) => setPublishedDate(newValue)} 
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        labelPlacement="start"
                        control={
                            <Switch 
                                name="exclusive" 
                                checked={exclusive} 
                                onChange={(e) => setExclusive(e.target.checked)} 
                            />
                        }
                        label="Paid Exclusive"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        labelPlacement="start"
                        control={
                            <Switch 
                                name="private_video" 
                                checked={!privateVideo} 
                                onChange={(e) => setPrivateVideo(!e.target.checked)} 
                            />
                        }
                        label="Publicly Available"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        labelPlacement="start"
                        control={
                            <Switch 
                                name="is_draft" 
                                checked={isDraft} 
                                onChange={(e) => setIsDraft(e.target.checked)} 
                            />
                        }
                        label="Draft"
                    />
                </Grid>
            </Grid>
            
            {isPutLoading ? (
                <LoadingSpinner />
            ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                <Stack direction='row' spacing={2}>
                    <Button 
                        variant='contained'
                        type="submit"
                        sx={{ mt: 2 }}
                        startIcon={<SaveIcon />}
                        disabled={isButtonDisabled}
                        data-testid="save-button"
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
            )}
        </Box>
    );
}
