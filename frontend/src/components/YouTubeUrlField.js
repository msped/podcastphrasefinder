import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import LoadingSpinner from './LoadingSpinner';
import usePostYouTubeUrlHook from '@/hooks/usePostYouTubeUrlHook';

export default function YouTubeUrlField({ 
    handleIsButtonDisabled,
    handleTranscriptText,
    handleTranscriptError
}) {
    const [inputAdornment, setInputAdornment] = useState('');
    const [youtubeUrl, setYouTubeUrl] = useState('');
    const { transcript, status, isLoading } = usePostYouTubeUrlHook(youtubeUrl);
    const [helperText, setHelperText] = useState(null);

    const getAdornmentIcon = () => {
        if (isLoading && youtubeUrl !== '') return <LoadingSpinner />;
        if (transcript.error) {
            setHelperText("There was an error with this transcript. \
            You can still add it and we'll check for a transcript periodically.\
            Otherwise you can get a transcript via a third-party transcript \
            service.")
            return <CancelOutlinedIcon sx={{ color: 'red'}} />
        }
        switch(status) {
            case 200: return <CheckCircleOutlineIcon sx={{ color: 'green'}} />;
            case 226: 
            handleIsButtonDisabled(true);
                setHelperText('This episode is already exists.');
                return <ErrorOutlineIcon sx={{ color: 'orange'}}/>;
            default: return null
        }
    }

    const renderInputAdornment = () => (
        <InputAdornment position="end">{getAdornmentIcon()}</InputAdornment>
    );

    useEffect(() => {
        handleIsButtonDisabled(false);
        setHelperText(null)
        handleTranscriptError(transcript.error)
        if (!isLoading && transcript && !transcript.error) {
            handleTranscriptText(transcript.text)
        }
        setInputAdornment(renderInputAdornment());
    }, [transcript, status, isLoading]);

    return (
        <React.Fragment>
            <TextField
                required
                id="url"
                type="url"
                name="url"
                label="YouTube Video URL"
                fullWidth
                onChange={(e) => setYouTubeUrl(e.target.value)}
                InputProps={{
                    endAdornment: inputAdornment,
                    inputProps: {
                        'data-testid': 'youtube-url'
                    }
                }}
                helperText={helperText}
                aria-label='YouTube Video URL'
            />
        </React.Fragment>
    )
}
