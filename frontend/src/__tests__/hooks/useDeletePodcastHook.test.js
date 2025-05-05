import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { deletePodcastService } from '@/api/podcastServices';
import { useDeletePodcastHook } from '@/hooks/podcastHooks';

jest.mock('../../api/podcastServices', () => ({
    deletePodcastService: jest.fn(),
}));

function TestComponent({ slug }) {
    const { status, error } = useDeletePodcastHook(slug);

    return (
        <div>
            <div data-testid="status">{status}</div>
            <div data-testid="error">{error?.error}</div>
        </div>
    );
}

describe('useDeletePodcastHook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call deletePodcastService with the correct slug and resolve with status on success', async () => {
        const mockSlug = 'test-slug';
        const mockStatus = 200;
        deletePodcastService.mockResolvedValue({ status: mockStatus });

        await act(async () => {
            render(<TestComponent slug={mockSlug} />)
        })

        expect(deletePodcastService).toHaveBeenCalledWith(mockSlug);
        expect(screen.getByTestId('status').textContent).toBe('200');
    });

    it('should handle API errors with status codes', async () => {
        const mockSlug = "test-slug-400";
        const mockStatus = 404;
        const mockError = { 'error': "Podcast not found" }



        deletePodcastService.mockRejectedValue({response: {data: mockError, status: mockStatus }});
        await act(async () => {
            render(<TestComponent slug={mockSlug} />)
        })

        expect(deletePodcastService).toHaveBeenCalledWith(mockSlug);

        expect(deletePodcastService).toHaveBeenCalledWith(mockSlug);
        expect(screen.getByTestId('status').textContent).toBe('404');
        expect(screen.getByTestId('error').textContent).toBe(mockError.error)
    });
});