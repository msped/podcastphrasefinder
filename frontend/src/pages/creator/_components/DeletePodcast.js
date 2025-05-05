import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Card,
    CardContent,
} from '@mui/material';
import { useGetCreatorEpisodesHook } from '@/hooks/episodeHooks';
import useDeletePodcastHook from '@/pages/creator/_hooks/useDeletePodcastHook';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function DeletePodcast({ podcast }) {
    const [open, setOpen] = useState(false);
    const [sendDeleteConfirmationRequestTrigger, setSendDeleteConfirmationRequestTrigger] = useState(null);

    const { status, error } = useDeletePodcastHook(sendDeleteConfirmationRequestTrigger);

    const toggleDialog = () => {
        setOpen(!open);
    };

    const handleDelete = () => {
        toggleDialog();
        setSendDeleteConfirmationRequestTrigger(podcast.slug);
    };

    const { results, isLoading } = useGetCreatorEpisodesHook();

    useEffect(() => {
        if (status >= 200 && status < 300) {
            toggleDialog();
            toast.success('A confirmation email has been sent. Please check your inbox.')
        } else if (error) {
            if (error.detail) {
                toast.error(error.detail)
            } else {
                for (const [key, value] of Object.entries(error.response.data)) {
                    toast.error(`${key} - ${value}`)
                }
        }
            toast.error(error.detail)
        }
    }, [status, error])

    return (
        <>
            <Box padding={1}> 
                <Typography
                    fontWeight={500}
                    variant='h6'
                >
                    Delete
                </Typography>
                <Box>
                    <Stack direction='column' spcaing={1}>
                        <Typography>
                            This will delete your podcast from the website, including all of its episodes. 
                            Any transcripts stored will also be deleted, this will not effect any transcripts obtain from 3rd party sources.
                            This action <b>cannot</b> be undone.
                        </Typography>
                        <Box display='flex' justifyContent='flex-end'>
                            <Button
                                variant='contained'
                                endIcon={<DeleteIcon />}
                                onClick={toggleDialog}
                                color='error'
                                size='small'
                                sx={{
                                    maxWidth: '250px'
                                }}
                            >
                                Delete, forever
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Dialog
                open={open}
                onClose={toggleDialog}
                maxWidth='md'
                fullWidth
            >
                <DialogTitle>Delete Podcast</DialogTitle>
                <DialogContent>
                    <Typography>
                        You're about to delete this podcast and all it's associated episodes which cannot be undone.
                    </Typography>

                    <Card sx={{ maxHeight: '35vh', marginY: 2, overflow: 'auto' }}>
                        <CardContent>
                            {isLoading && (
                                <Box sx={{ alignContent: 'center', justifyContent: 'center' }}>
                                    <LoadingSpinner />
                                </Box>)}
                            {!isLoading && results && results.length > 0 ?
                                results.map((episode) => {
                                    return <Typography variant='body2' key={episode.id}>
                                        {episode.title}
                                    </Typography>
                                })
                            : <Typography>This podcast has no episodes.</Typography>}
                        </CardContent>
                    </Card>
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
                        color='error'
                        onClick={handleDelete}
                        endIcon={<DeleteIcon/>}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
