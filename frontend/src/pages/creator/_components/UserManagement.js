import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    IconButton,
    FormHelperText
} from '@mui/material';
import LoadingSpinner from '@/components/LoadingSpinner';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
    useGetMembershipsHook,
    useDeleteMembershipHook,
    usePatchMembershipHook,
    usePostMembershipHook,
} from '../_hooks/membershipHooks';

import toast from 'react-hot-toast';

export default function UserManagement() {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [editedUser, setEditedUser] = useState({
        id: null,
        user: {
            first_name: '',
            last_name: '',
            email: ''
        },
        role: 'Member',
    });
    const { memberships, isLoading, setMemberships } = useGetMembershipsHook();

    const [postTrigger, setPostTrigger] = useState(null);
    const [patchTrigger, setPatchTrigger] = useState(null);
    const [deleteTrigger, setDeleteTrigger] = useState(null)
    const [formErrors, setFormErrors] = useState({});

    const { response: postResponse, status: postStatus, error: postError } = usePostMembershipHook(postTrigger);
    const { response: patchResponse, status: patchStatus, error: patchError } = usePatchMembershipHook(patchTrigger);
    const { status: deleteStatus, error: deleteError } = useDeleteMembershipHook(deleteTrigger);


    function handleResponse (status, response, error, mode) {
        if (status >= 200 && status < 300) {
            let toastMessage = '';
            switch (mode) {
                case 'add':
                    toastMessage = `${response.user.first_name} has been given ${response.role} role.`
                    setMemberships(prevMemberships => [...prevMemberships, response]);
                    break;
                case 'edit':
                    toastMessage = `${response.user.first_name} ${response.user.last_name} membership has been updated.`
                    setMemberships(prevMemberships => 
                        prevMemberships.map(membership => 
                            membership.id === response.id ? response : membership
                        )
                    );
                    break;
                case 'delete':
                    toastMessage = 'User has been deleted.'
                    setMemberships(prevMemberships => 
                        prevMemberships.filter(membership => membership.id !== deleteTrigger)
                    )
                    break;
                default:
                    break;
            }
            toast.success(toastMessage);
            handleCloseDialog();
            setEditedUser({
                id: null,
                user: {
                    email: '',
                },
                role: 'Member',
            });
            setDialogMode('');
        } else if (error) {
            for (const [key, value] of Object.entries(error.response.data)) {
                toast.error(`${key} - ${value}`)
            }
        }
    };
    
    useEffect(() => {
        if (postStatus) {
            handleResponse(postStatus, postResponse, postError, 'add');
            setPostTrigger(null);
        }
        if (patchStatus) {
            handleResponse(patchStatus, patchResponse, patchError, 'edit');
            setPatchTrigger(null);
        }
        if(deleteStatus) {
            handleResponse(deleteStatus, null, deleteError, 'delete')
            setDeleteTrigger(null);
        }
    }, [
        postStatus,
        postResponse,
        postError,
        patchStatus,
        patchResponse,
        patchError,
        deleteStatus,
        deleteError
    ]);

    const handleOpenDialog = (mode, user = null) => {
        setDialogMode(mode);
        if (mode === 'edit' && user) {
            setEditedUser(user);
        } else {
            setEditedUser({
                id: null,
                user: {
                    email: '',
                },
                role: 'Member',
            })
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setEditedUser((prevUser) => ({
                ...prevUser,
                [parentKey]: {
                    ...prevUser[parentKey],
                    [childKey]: value,
                },
            }));
        } else {
            setEditedUser((prevUser) => ({
                ...prevUser,
                [name]: value,
            }));
        }
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: null }))
    };

    const handleSaveMember = () => {
        if (dialogMode === 'add') {
            setPostTrigger(editedUser)
        } else {
            setPatchTrigger(editedUser)
        }
    };

    const handleDeleteMember = (memberId) => {
        setDeleteTrigger(memberId);        
    };

    return (
        <Box>
            <Box display='flex'>
                <Typography
                    fontWeight={500}
                    variant='h6'
                    sx={{ flexGrow: 1, paddingLeft: 1 }}
                >
                    User Permissions
                </Typography>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => handleOpenDialog('add')}
                >
                    Add User
                </Button>
            </Box>
            { isLoading ? <LoadingSpinner /> : (
            <TableContainer component={Paper}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {memberships ?  
                        memberships.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.user.full_name}</TableCell>
                            <TableCell>{item.user.email}</TableCell>
                            <TableCell>{item.role}</TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => handleOpenDialog('edit', item)}
                                    aria-label="edit"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteMember(item.id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        )): (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
                <DialogTitle>
                    {dialogMode === 'add' ? 'Add User' : 'Edit User'}
                </DialogTitle>
                <DialogContent>
                    {dialogMode !== 'add' && <Box display='flex'>
                        <TextField
                            margin="normal"
                            label="First Name"
                            value={editedUser.user?.first_name}
                            fullWidth
                            sx={{ paddingRight: 1 }}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            label="Last Name"
                            value={editedUser.user?.last_name}
                            fullWidth
                            sx={{ paddingLeft: 1 }}
                            disabled
                        />
                    </Box>}
                    <TextField
                        margin="normal"
                        label="Email"
                        name="user.email"
                        value={editedUser.user?.email}
                        onChange={handleInputChange}
                        fullWidth
                        error={Boolean(formErrors['user.email'])}
                        helperText={formErrors['user.email']}
                        disabled={dialogMode === 'edit'}
                    />

                    <FormControl fullWidth margin="normal" error={Boolean(formErrors.role)}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            label="Role"
                            name="role"
                            inputProps={{ 'data-testid': 'role-selector' }}
                            value={editedUser.role}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Member">Member</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Owner" disabled>Owner</MenuItem>
                        </Select>
                        {formErrors.role && (
                            <FormHelperText error>{formErrors.role}</FormHelperText>
                        )}
                    </FormControl>
                        <FormHelperText error={formErrors.detail}>{
                            formErrors.detail ? formErrors.detail :
                            'The user must have a PodcastPhrasefinder account.'}</FormHelperText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveMember} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
