import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useDeleteUserHook } from '@/hooks/userHooks';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [triggerDelete, setTriggerDelete] = useState(false);
  const { status, error, isLoading } = useDeleteUserHook(triggerDelete);

  useEffect(() => {
    if (status === 204 || status === 200) {
      toast.success('Account deleted successfully.');
      signOut({ callbackUrl: '/' });
    } else if (status === 409) {
      toast.error('You cannot delete your account while you have active memberships.');
    } else if (status === 403) {
      toast.error('You are not authorized to perform this action.');
    } else if (error) {
      toast.error(error.detail || error);
    }
  }, [status, error]);

  const handleDelete = () => {
    setTriggerDelete(true);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box padding={2} my={2} sx={{ border: '2px solid rgb(225, 46, 33)', borderRadius: '8px' }}>
      <Typography fontWeight={500} variant='h6'>Delete Account</Typography>
      <Stack direction='column' spacing={1}>
        <Typography>
          Deleting your account is permanent and cannot be undone. All your data will be removed.
        </Typography>
        <Box display='flex' justifyContent='flex-end'>
          <Button
            variant='contained'
            color='error'
            size='small'
            onClick={handleOpen}
            sx={{ maxWidth: '250px' }}
          >
            Delete Account
          </Button>
        </Box>
      </Stack>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained'>Cancel</Button>
          <Button
            onClick={handleDelete}
            color='error'
            variant='contained'
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
