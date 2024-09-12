import React, { useState } from 'react';
import withDashboardLayout from '../../_components/withDashboardLayout';
import {
    Box,
    Paper,
    Link,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import useGetCreatorEpisodesHook from '@/pages/creator/_hooks/useGetCreatorEpisodesHook';
import useDeleteEpisodesHook from '@/pages/creator/_hooks/useDeleteEpisodesHook'


const renderIcon = (value) => value ? <CheckCircleIcon color='success'/> : <CancelIcon color='error'/>

const columns = [
    { field: 'title', headerName: 'Title', minWidth: 400 },
    { 
        field: 'exclusive',
        headerName: 'Exclusive',
        minWidth: 100,
        headerAlign: 'center',
        GridColDef: 'center',
        renderCell: (params) => (
            <Box display='flex' justifyContent='center' alignItems='center' pt={1}>
                {renderIcon(params.value)}
            </Box>
        ),
    },
    {
        field: 'published_date',
        headerName: 'Published Date',
        headerAlign: 'center',
        minWidth: 125,
        valueGetter: (params) => {
            const date = new Date(params).toLocaleDateString('en-GB');
            return date
        },
    },
    {
        field: 'private_video',
        headerName: 'Visibilitiy',
        headerAlign: 'center',
        renderCell: (params) => (
            <Box display='flex' justifyContent='center' alignItems='center' pt={1}>
                {params.value ? 'Private' : 'Public'}
            </Box>
        )
    },
    { 
        field: 'is_draft',
        headerName: 'Draft',
        headerAlign: 'center',
        renderCell: (params) => (
            <Box display='flex' justifyContent='center' alignItems='center' pt={1}>
                {renderIcon(params.value)}
            </Box>
        )
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: ({ id }) => {
            return (
                <Stack spacing={2} direction='row'>
                    <Link href={`creator/episodes/${id}/edit`} color='inherit'>
                        {<EditIcon />}
                    </Link>
                </Stack>
            )
        },
    },
];

function EpisodesDashboard() {
    const [open, setOpen] = useState(false)
    const { results, isLoading, setResults } = useGetCreatorEpisodesHook();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const {
        statusResponse,
        isLoading: isLoadingDelete,
        deleteEpisodes 
    } = useDeleteEpisodesHook()

    const toggleDialog = () => {
        setOpen(!open);
    }

    const handleDeleteEpisode = async () => {
        await deleteEpisodes(rowSelectionModel[0]);
        toggleDialog();
        if (statusResponse === 204) {
            setResults((prevResults) => 
                prevResults.filter((result) => result.id !== rowSelectionModel[0])
            );
            setRowSelectionModel([]);
        } else {
            alert("There was an error performing this action. Please try again.");
        }
    }

    return (
        <>
            <Box>
                <Stack direction='row' spacing={2} my={2}>
                    <Button 
                        startIcon={<DeleteIcon />} 
                        variant='contained' 
                        color='error' 
                        onClick={toggleDialog}
                        disabled={rowSelectionModel.length === 0}
                    >
                        Delete
                    </Button>
                </Stack>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <DataGrid
                        rows={results}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } }
                        }}
                        disableSelectionOnClick
                        disableMultipleRowSelection
                        autoHeight
                        checkboxSelection
                        loading={isLoading || isLoadingDelete}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                        }}
                    />
                </Paper>
            </Box>
            <Dialog
                open={open}
                onClose={toggleDialog}
                aria-labelledby="delete-confirmation-title"
                aria-describedby="delete-confirmation-dialog"
            >
                <DialogTitle id="delete-confirmation-title">
                    {"Are you sure?"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText id="delete-confirmation-description">
                            Are you sure you want to delete the selected episode? This action <b>cannot</b> be undone.
                        </DialogContentText>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={toggleDialog} disabled={isLoadingDelete}>Cancel</Button>
                    <Button variant='contained' onClick={handleDeleteEpisode} disabled={isLoadingDelete} color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default withDashboardLayout(EpisodesDashboard)
