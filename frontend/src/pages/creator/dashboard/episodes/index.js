import React, { useState } from 'react';
import withDashboardLayout from '../../_components/withDashboardLayout';
import {
    Box,
    Link,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DraftsIcon from '@mui/icons-material/Drafts';
import PublishIcon from '@mui/icons-material/Publish';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import useGetCreatorEpisodesHook from '@/pages/creator/_hooks/useGetCreatorEpisodesHook';
import {useDeleteEpisodesHook} from '@/hooks/episodeHooks';

const iconFontSize = 18;

const columns = [
    { field: 'title', headerName: 'Title', minWidth: 400 },
    {
        field: '',
        headerName: '',
        disableColumnMenu: true,
        minWidth: 100,
        headerAlign: 'center',
        sortable: false,
        display: 'flex',
        renderCell: (params) => {
            const { is_draft, exclusive, private_video } = params.row;
            return (
                <Stack direction='row' spacing={2}>
                    <Tooltip title={private_video ? 'Private Transcript' : 'Public Transcript'}>
                        {private_video ? <VisibilityOffIcon style={{ fontSize: iconFontSize }}/> : <VisibilityIcon style={{ fontSize: iconFontSize }}/>}
                    </Tooltip>
                    <Tooltip title={exclusive ? 'Paid Exclusive': 'Publicily Available'}>
                        {exclusive ? <LockIcon style={{ fontSize: iconFontSize }}/> : <LockOpenIcon style={{ fontSize: iconFontSize }}/>}
                    </Tooltip>
                    <Tooltip title={is_draft ? 'Draft' : 'Published'}>
                        {is_draft ? <DraftsIcon style={{ fontSize: iconFontSize }}/> : <PublishIcon style={{ fontSize: iconFontSize }}/>}
                    </Tooltip>
                </Stack>
            )
        }
    },
    {
        field: 'published_date',
        headerName: 'Published Date',
        headerAlign: 'center',
        minWidth: 125,
        align: 'center',
        valueGetter: (params) => {
            const date = new Date(params).toLocaleDateString('en-GB');
            return date
        },
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 75,
        renderCell: ({ id }) => {
            return (
                <Link href={`episodes/${id}/edit`} color='inherit'>
                    {<EditIcon />}
                </Link>
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
                    disableColumnSelector
                    disableColumnFilter
                    disableDensitySelector
                    slots={{ toolbar: GridToolbarQuickFilter }}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton',
                        },
                    }}
                    sx={{
                        '&  .MuiDataGrid-columnHeader--moving': {
                            backgroundColor: 'inherit',
                        }
                    }}
                />
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
