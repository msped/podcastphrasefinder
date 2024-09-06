import React from 'react'
import withDashboardLayout from '../../_components/withDashboardLayout'
import {
    Box,
    Paper,
    Link,
    Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import useGetCreatorEpisodesHook from '../../_hooks/useGetCreatorEpisodesHook';

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
                    <Link href={`to/do`} color='inherit'> {/* handle delete */}
                        {<DeleteIcon />}
                    </Link>
                </Stack>
            )
        },
    },
];

function EpisodesDashboard() {
    const { results, isLoading } = useGetCreatorEpisodesHook();
    // const apiRef = useGridApiRef(); for row selection

    return (
        <Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={results}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } }
                    }}
                    disableSelectionOnClick
                    autoHeight
                    // checkboxSelection
                    loading={isLoading}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton',
                        },
                    }}
                />
            </Paper>
        </Box>
    )
}

export default withDashboardLayout(EpisodesDashboard)
