import React, { useState, useEffect } from 'react'
import {
    Grid,
    Avatar,
    Box,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditableField from './EditableField';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import toast from 'react-hot-toast';
import { usePatchPodcastHook } from '@/hooks/podcastHooks';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        display: 'flex',
        position: 'relative',
        width: 90,
    },
    uploadButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 90,
        height: 90,
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
        '&:hover': {
            opacity: 1,
        },
    },
};

export default function PodcastSettings({ podcast }) {
    const [open, setOpen] = useState(false);
    const [formDataState, setFormDataState] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const { status, isLoading, error } = usePatchPodcastHook(podcast.slug, formDataState);

    useEffect(() => {
        if (status >= 200 && status < 300) {
            podcast.avatar = URL.createObjectURL(avatar)
            toggleDialog();
            setAvatar(null);
            toast.success('Avatar updated!');
        } else if (error) {
            for (const [key, value] of Object.entries(error.response.data)) {
                toast.error(`${key} - ${value}`)
            }
        }
    }, [status, isLoading, error])

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setAvatar(file);
    };

    const toggleDialog = () => {
        setOpen(!open);
    };


    return (
        <>
            <Dialog
                open={open}
                onClose={toggleDialog}
                maxWidth='sm'
                fullWidth
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        setFormDataState(formData)
                    },
                }}
            >
                <DialogTitle>Upload a new avatar</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        padding: 3,
                    }}>
                        <Avatar
                            src={podcast.avatar}
                            alt="Thumbnail"
                            label="current thumbnail"
                            sx={{ width: 90, height: 90 }}
                        />
                        <Box>
                            <ArrowForwardIcon fontSize='large' />
                        </Box>
                        <Box sx={styles.avatarContainer}>
                            <Avatar
                                src={avatar ? URL.createObjectURL(avatar) : null}
                                alt="Thumbnail"
                                label="image preview"
                                sx={{ width: 90, height: 90 }}
                            />
                            <IconButton component="label" sx={styles.uploadButton}>
                                <FileUploadOutlinedIcon />
                                <VisuallyHiddenInput
                                    type="file"
                                    required
                                    id="avatar"
                                    label="Upload Logo"
                                    accept="image/*"
                                    multiple={false}
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        onClick={toggleDialog}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant='contained' 
                        type="submit" 
                        startIcon={<SaveIcon/>}
                        disabled={!avatar}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={2}>
                <Grid item xs={3} sx={styles.container}>
                    <Box sx={styles.avatarContainer}>
                        <Avatar
                            src={podcast.avatar}
                            alt="Thumbnail"
                            label="Upload Logo"
                            sx={{ width: 90, height: 90 }}
                        />
                        <IconButton 
                            component="label"
                            sx={styles.uploadButton}
                            onClick={toggleDialog}
                        >
                            <FileUploadOutlinedIcon />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <EditableField 
                        onSave={usePatchPodcastHook} 
                        fieldName='name' 
                        urlParam={podcast.slug}
                        variant='h4'
                        fontWeight={500}
                    >
                        {podcast.name}
                    </EditableField>
                </Grid>
            </Grid>
        </>
    )
}
