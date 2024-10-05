import React, { useState, useEffect} from 'react'
import { useRouter } from 'next/router';
import { 
    Button,
    Box,
    Grid,
    Stack,
    Backdrop,
    TextField,
    IconButton,
    Avatar,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LoadingSpinner from '@/components/LoadingSpinner';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import usePostPodcastFormHook from '../_hooks/usePostPodcastFormHook';

import toast from 'react-hot-toast';

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
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
        '&:hover': {
            opacity: 1,
        },
    },
};

export default function CreatePodcastForm() {
    const router = useRouter();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [formDataState, setFormDataState] = useState(null);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null)

    const { response, status, isLoading, error } = usePostPodcastFormHook(formDataState);
    
    useEffect(() => {
        if (status >= 200 && status < 300) {
            toast.success('Podcast created!');
            setTimeout(() => {
                router.push(`/creator/podcasts/${response.slug}`);
            }, 1250)
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

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setAvatar(file);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <LoadingSpinner />
            </Backdrop>
            <Grid container spacing={3} pt={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" fontWeight={600} gutterBottom textAlign='center'>
                        Create your podcast
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3} sx={styles.container}>
                    <Box sx={styles.avatarContainer}>
                        <Avatar
                            src={avatar ? URL.createObjectURL(avatar) : ''}
                            alt="Thumbnail"
                            label="Upload Logo"
                            sx={{ width: 90, height: 90 }}
                        />
                        {!avatar && (
                            <IconButton component="label" sx={styles.uploadButton}>
                                <FileUploadOutlinedIcon />
                                <VisuallyHiddenInput
                                    type="file"
                                    required
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                />
                            </IconButton>
                        )}
                    </Box>
                    {avatar ? (
                        <Button 
                            startIcon={<CloseOutlinedIcon />} 
                            onClick={() => setAvatar(null)}
                            variant='text'
                            color='error'
                        >
                            Remove
                        </Button>
                    ): (
                        <Typography variant='caption' fontWeight={600} mt={1}>
                            Upload your logo
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField
                        required
                        value={name}
                        id="name"
                        type="text"
                        name="name"
                        label="Podcast Name"
                        helperText="Make sure to name it exactly as everywhere else, it will help people find you!"
                        fullWidth
                        inputProps={{ 'aria-label': 'Podcast Name' }}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                <Stack direction='row' spacing={2}>
                    <Button 
                        variant='contained'
                        type="submit"
                        sx={{ mt: 2 }} 
                        disabled={isButtonDisabled}
                    >
                        Create
                    </Button>
                </Stack>
            </Box>
        </Box>
    )

}
