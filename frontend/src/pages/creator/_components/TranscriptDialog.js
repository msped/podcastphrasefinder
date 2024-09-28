import React, { useState } from 'react';
import {
    Box,
    Dialog,
    Button,
    Slide,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function TranscriptDialog({ transcript, setTranscript }) {
    const [open, setOpen] = useState(false);

    const handleDialogOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button startIcon={<EditIcon />} onClick={handleDialogOpen} variant='contained'>
                Edit Transcript
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleDialogClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleDialogClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Edit Transcript
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box width='100%'>
                    <Box sx={{ p: 3, width: '100%' }}>

                        <TextField
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            fullWidth
                            multiline
                            maxRows={Infinity}
                        />
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
