import React, { useState, useEffect, useContext } from 'react'
import {
    Button,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material';
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PodcastContext } from '@/context/PodcastContext';
import { useTransferMembershipHook } from '@/pages/creator/_hooks/membershipHooks';
import { useSession } from 'next-auth/react';

const columns = [
    { field: 'full_name', headerName: 'Name', minWidth: 200, renderCell: (params) => params?.row?.user?.full_name },
    { field: 'email', headerName: 'Email', minWidth: 150, renderCell: (params) => params?.row?.user?.email },
    { field: 'role', headerName: 'Role', minWidth: 200 },
];

export default function TransferOwnership({ members }) {
    const { data: session } = useSession();
    const { selectedPodcastOrg } = useContext(PodcastContext);
    const [currentMember, setCurrentMember] = useState(null)
    const [isCurrentMemberOwner, setIsCurrentMemberOwner] = useState(null)
    const [open, setOpen] = useState(false);
    const [formDataState, setFormDataState] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const { response, status, error, isLoading } = useTransferMembershipHook(selectedPodcastOrg.slug, formDataState);


    const toggleDialog = () => {
        setOpen(!open);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const memberEmail = members.find(member => member.user.id === rowSelectionModel[0]);
        setFormDataState(memberEmail.user.email);
    };

    useEffect(() => {
        const findCurrentMember = async () => {
            if (members) {
                const foundMember = members.find(member => member.user.id === session?.user?.pk);
                setCurrentMember(foundMember);
                setIsCurrentMemberOwner(foundMember.role === 'Owner');
            }
        }

        findCurrentMember();
    }, [members, session?.user?.pk])

    // handle response
    useEffect(() => {
        if (status >= 200 && status < 300) {
            toggleDialog();
            toast.success(`A confirmation email has been sent, please check your inbox.`);
        } else if (error && error.response && error.response.data) { 
            if (typeof error.response.data === 'object') {
                let errorMessages = [];

                if (Array.isArray(error.response.data)) {
                    errorMessages = error.response.data;
                } else {
                    for (const key in error.response.data) {
                        if (Array.isArray(error.response.data[key])) {
                            errorMessages = errorMessages.concat(error.response.data[key]);
                        } else {
                            errorMessages.push(`${key}: ${error.response.data[key]}`);
                        }
                    }
                }
                errorMessages.forEach(message => toast.error(message));
            } else {
                toast.error("An unexpected error occurred.");
            }
            setFormDataState(null);
        } else if (error) {
            setFormDataState(null);
            toast.error("A network or other unexpected error occurred.");
        }
    }, [response, status, error])

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={toggleDialog}
                maxWidth='md'
                fullWidth
            >
                <DialogTitle>Transfer Ownership</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box>
                            <DataGrid
                                rows={members}
                                columns={columns}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } }
                                }}
                                disableSelectionOnClick
                                disableMultipleRowSelection
                                autoHeight
                                checkboxSelection
                                disableColumnSelector
                                disableColumnFilter
                                disableDensitySelector
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    setRowSelectionModel(newRowSelectionModel);
                                }}
                                getRowId={(row) => row.user.id}
                                rowSelectionModel={rowSelectionModel}
                                slotProps={{
                                    loadingOverlay: {
                                        variant: 'skeleton',
                                        noRowsVariant: 'skeleton',
                                    },
                                }}
                            />
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
                            color='error'
                            endIcon={<ArrowForwardIcon/>}
                            disabled={
                                rowSelectionModel.length === 0 ||
                                isLoading
                            }
                        >
                            Transfer
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Box padding={1}>
                <Typography
                    fontWeight={500}
                    variant='h6'
                >
                    Transfer Ownership
                </Typography>
                <Box>
                    <Stack direction='column' spcaing={1}>
                        <Typography>
                            This will transfer ownership of this podcast to another user who already 
                            has a membership. This action <b>cannot</b> be undone.
                        </Typography>
                        <Box display='flex' justifyContent='flex-end'>
                            <Button
                                onClick={toggleDialog}
                                variant='contained'
                                endIcon={<ArrowForwardIcon />}
                                color='error'
                                size='small'
                                sx={{
                                    maxWidth: '250px'
                                }}
                                disabled={members.length <= 1 || !isCurrentMemberOwner}
                            >
                                Transfer Ownership
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </React.Fragment>
    )
}
