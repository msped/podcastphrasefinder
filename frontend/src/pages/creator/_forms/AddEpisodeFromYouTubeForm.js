import React, { useState, useEffect } from 'react'
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
import toast from 'react-hot-toast';

import usePostAddYouTubeFormHook from '@/hooks/usePostAddYouTubeFormHook';

import YouTubeUrlField from '@/components/YouTubeUrlField';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AddEpisodeFromYouTubeForm() {
    const router = useRouter();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [transcriptText, setTranscriptText] = useState('');
    const [transcriptError, setTranscriptError] = useState(false);
    const [formDataState, setFormDataState] = useState(null);
    const [isDraft, setIsDraft] = useState(false)

    const { status, isLoading, error } = usePostAddYouTubeFormHook(formDataState);

    
    
    useEffect(() => {
        if (status >= 200 && status < 300) {
            router.push('/dashboard');
        } else if (error) {
            for (const [key, value] of Object.entries(error.response.data)) {
                toast.error(`${key} - ${value}`)
            }
            setIsButtonDisabled(false)
        }
    }, [status, isLoading, error, router])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsButtonDisabled(true);

        const formData = new FormData(event.target);
        setFormDataState(formData);
    }

    const handleIsButtonDisabled = (disabled) => {
        setIsButtonDisabled(disabled);
    }

    const handleTranscriptText = (returnedText) => {
        setTranscriptText(returnedText);
    }

    const handleTranscriptError = (returnedError) => {
        setTranscriptError(returnedError);
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <LoadingSpinner />
            </Backdrop>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <YouTubeUrlField 
                        handleIsButtonDisabled={handleIsButtonDisabled}
                        handleTranscriptText={handleTranscriptText}
                        handleTranscriptError={handleTranscriptError}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="title"
                        type="text"
                        name="title"
                        label="Episode Title"
                        fullWidth
                        inputProps={{ 'aria-label': 'Episode Title' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="Published Date"
                        required
                        name="published_date"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        labelPlacement="start"
                        control={<Switch name="exclusive" />}
                        label="Exclusive Episode"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="transcript"
                        type="text"
                        name="transcript"
                        label="Transcript"
                        fullWidth
                        multiline
                        rows={20}
                        value={transcriptText ? transcriptText : ''}
                        disabled={transcriptError}
                    />
                </Grid>
            </Grid>
            <input 
                type="hidden"
                name="error_occurred" 
                id="error_occurred" 
                value={transcriptError ? "true": ""}
            />
            <input 
                type="hidden"
                name="is_draft" 
                id="is_draft" 
                value={isDraft ? "true": ""}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                <Stack direction='row' spacing={2}>
                    <Button 
                        variant='contained'
                        type="submit"
                        sx={{ mt: 2 }} 
                        disabled={isButtonDisabled}
                    >
                        Submit
                    </Button>
                    <Button 
                        variant='contained'
                        type="button"
                        color='info'
                        sx={{ mt: 2 }}
                        onClick={() => setIsDraft(true)}
                    >
                        Save as draft
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}
