import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import { useConfirmDeletePodcastHook } from '@/hooks/membershipHooks';
import { getConfirmDeletePodcastService } from "@/api/membershipServices";

// Mock the service
jest.mock('../../api/membershipServices', () => ({
    getConfirmDeletePodcastService: jest.fn(),
}));

const TestComponent = () => {
    const { status, error, isLoading, setSlug, setToken } = useConfirmDeletePodcastHook();

    return (
        <div>
            <span data-testid="status">{status}</span>
            <span data-testid="error">{error?.error}</span>
            <span data-testid="isLoading">{isLoading ? 'loading' : 'loaded'}</span>
            <button onClick={() => setSlug('test-slug')} data-testid="setSlugButton">Set Slug</button>
            <button onClick={() => setToken('test-token')} data-testid="setTokenButton">Set Token</button>
        </div>
    );
};

describe('useConfirmDeletePodcastHook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have initial states', () => {
        const { getByTestId } = render(<TestComponent />);

        expect(getByTestId('status').textContent).toBe('');
        expect(getByTestId('error').textContent).toBe('');
        expect(getByTestId('isLoading').textContent).toBe('loading');
    });

    it('should fetch and update status on success', async () => {
        const mockStatus = 200;
        getConfirmDeletePodcastService.mockResolvedValue({ status: mockStatus });

        const { getByTestId } = render(<TestComponent />);

        await act(async () => {
            fireEvent.click(getByTestId('setSlugButton'));
            fireEvent.click(getByTestId('setTokenButton'));
        });

        await waitFor(() => expect(getByTestId('isLoading').textContent).toBe('loaded'));


        expect(getConfirmDeletePodcastService).toHaveBeenCalledWith('test-slug', 'test-token');
        expect(getByTestId('status').textContent).toBe(mockStatus.toString());
        expect(getByTestId('error').textContent).toBe('');
        expect(getByTestId('isLoading').textContent).toBe('loaded');
    });

    it('should handle an error correctly', async () => {
        getConfirmDeletePodcastService.mockRejectedValue({ response: { status: 404, data: { 'error': 'Podcast does not exist.'}}});

        const { getByTestId } = render(<TestComponent />);

        await act(async () => {
            fireEvent.click(getByTestId('setSlugButton'));
            fireEvent.click(getByTestId('setTokenButton'));
        });

        await waitFor(() => expect(getByTestId('isLoading').textContent).toBe('loaded'));

        expect(getConfirmDeletePodcastService).toHaveBeenCalledWith('test-slug', 'test-token');
        expect(getByTestId('status').textContent).toBe('404');
        expect(getByTestId('error').textContent).toBe('Podcast does not exist.');
        expect(getByTestId('isLoading').textContent).toBe('loaded');
    });
});
