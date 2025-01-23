import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeletePodcast from '@/pages/creator/_components/DeletePodcast';
import useDeletePodcastHook from '@/pages/creator/_hooks/useDeletePodcastHook';
import useGetCreatorEpisodesHook from '@/pages/creator/_hooks/useGetCreatorEpisodesHook';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom';

jest.mock('../../pages/creator/_hooks/useDeletePodcastHook');
jest.mock('../../pages/creator/_hooks/useGetCreatorEpisodesHook');

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn()
}));

const mockPodcast = {
    slug: 'test-podcast-slug'
};

describe('DeletePodcast', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDeletePodcastHook.mockReturnValue({
            status: null,
            error: null
        });
        useGetCreatorEpisodesHook.mockReturnValue({
            results: [],
            isLoading: false
        });
    });

    it('should render delete button', () => {
        render(<DeletePodcast podcast={mockPodcast} />);
        expect(screen.getByText('Delete, forever')).toBeInTheDocument();
    });

    it('should open dialog on delete button click', () => {
        render(<DeletePodcast podcast={mockPodcast} />);
        const deleteButton = screen.getByText('Delete, forever');
        fireEvent.click(deleteButton);
        expect(screen.getByText('Delete Podcast')).toBeInTheDocument();
    });

    it('should close dialog on cancel button click', () => {
        render(<DeletePodcast podcast={mockPodcast} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete, forever' }));
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        expect(
            screen.queryByText("You're about to delete this podcast and all it's \
                associated episodes which cannot be undone.")).not.toBeInTheDocument();
    });

    it('should handle successful delete operation', async () => {
        useDeletePodcastHook.mockReturnValue({
            status: 200,
            error: null
        });
        render(<DeletePodcast podcast={mockPodcast} />);
        
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        })
        
        expect(toast.success).toHaveBeenCalledWith('A confirmation email has been sent. Please check your inbox.');
    });

    it('should handle delete error with detail', () => {
        useDeletePodcastHook.mockReturnValue({
            status: null,
            error: { detail: 'Error message' }
        });
        render(<DeletePodcast podcast={mockPodcast} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete, forever' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(toast.error).toHaveBeenCalledWith('Error message');
    });

    it('should handle delete error with response data', () => {
        useDeletePodcastHook.mockReturnValue({
            status: null,
            error: { response: { data: { reason: 'Cannot delete' } } }
        });
        render(<DeletePodcast podcast={mockPodcast} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete, forever' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(toast.error).toHaveBeenCalledWith('reason - Cannot delete');
    });

    it('should display episodes in dialog when available', () => {
        useGetCreatorEpisodesHook.mockReturnValue({
            results: [{ id: 1, title: 'Episode 1' }],
            isLoading: false
        });
        render(<DeletePodcast podcast={mockPodcast} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete, forever' }));
        expect(screen.getByText('Episode 1')).toBeInTheDocument();
    });

    it('should show loading spinner while fetching episodes', () => {
        useGetCreatorEpisodesHook.mockReturnValue({
            results: [],
            isLoading: true
        });
        render(<DeletePodcast podcast={mockPodcast} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete, forever' }));
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should indicate no episodes if none are found', () => {
        useGetCreatorEpisodesHook.mockReturnValue({
            results: [],
            isLoading: false
        });
        render(<DeletePodcast podcast={mockPodcast} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete, forever' }));
        expect(screen.getByText('This podcast has no episodes.')).toBeInTheDocument();
    });
});
