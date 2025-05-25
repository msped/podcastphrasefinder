
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteAccount from '@/pages/creator/_components/DeleteAccount';
import { useDeleteUserHook } from '@/hooks/userHooks';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

jest.mock('../../hooks/userHooks' , () => ({
    useDeleteUserHook: jest.fn(),
}));
jest.mock('next-auth/react');
jest.mock('react-hot-toast');
jest.mock('../../components/LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);

describe('DeleteAccount Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        useDeleteUserHook.mockReturnValue({
            status: null,
            error: null,
            isLoading: false,
        });
        toast.success.mockClear();
        toast.error.mockClear();
        signOut.mockClear();
    });

    test('renders initial state correctly', () => {
        render(<DeleteAccount />);
        expect(screen.getByRole('heading', { name: 'Delete Account' })).toBeInTheDocument();
        expect(screen.getByText('Deleting your account is permanent and cannot be undone. All your data will be removed.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete Account' })).toBeInTheDocument();
    });

    test('opens and closes the confirmation dialog', async () => {
        render(<DeleteAccount />);
        const deleteButton = screen.getByRole('button', { name: 'Delete Account' });
        fireEvent.click(deleteButton);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete your account? This action cannot be undone.')).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    test('handles successful account deletion', async () => {
        useDeleteUserHook.mockReturnValue({
            status: 204,
            error: null,
            isLoading: false,
        });

        render(<DeleteAccount />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));

        const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
        fireEvent.click(confirmDeleteButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Account deleted successfully.');
        });
        await waitFor(() => {
            expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
        });
    });

    test('handles account deletion failure (409 conflict)', async () => {
        useDeleteUserHook.mockReturnValueOnce({
            status: null,
            error: null,
            isLoading: false,
        }).mockReturnValueOnce({
            status: 409,
            error: null,
            isLoading: false,
        });

        render(<DeleteAccount />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('You cannot delete your account while you have active memberships.');
        });
    });

    test('handles account deletion failure (403 forbidden)', async () => {
        useDeleteUserHook.mockReturnValueOnce({
            status: null,
            error: null,
            isLoading: false,
        }).mockReturnValueOnce({
            status: 403,
            error: null,
            isLoading: false,
        });

        render(<DeleteAccount />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('You are not authorized to perform this action.');
        });
    });

    test('handles account deletion failure (generic error with detail)', async () => {
        const errorWithMessage = { detail: 'Something went wrong on the server.' };
        useDeleteUserHook.mockReturnValueOnce({
            status: null,
            error: null,
            isLoading: false,
        }).mockReturnValueOnce({
            status: 500,
            error: errorWithMessage,
            isLoading: false,
        });

        render(<DeleteAccount />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(errorWithMessage.detail);
        });
    });

    test('handles account deletion failure (generic error string)', async () => {
        const errorString = 'Network error';
        useDeleteUserHook.mockReturnValueOnce({
            status: null,
            error: null,
            isLoading: false,
        }).mockReturnValueOnce({
            status: null,
            error: errorString,
            isLoading: false,
        });

        render(<DeleteAccount />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(errorString);
        });
    });

    test('shows loading spinner and disables delete button when isLoading is true', async () => {
        useDeleteUserHook.mockReturnValue({
            status: null,
            error: null,
            isLoading: true,
        });

        render(<DeleteAccount />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));

        await waitFor(() => {
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
            expect(screen.queryByRole('button', { name: 'Delete'})).not.toBeInTheDocument();
        })
    });
});
