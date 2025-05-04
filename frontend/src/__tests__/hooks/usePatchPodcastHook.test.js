import { render, waitFor } from '@testing-library/react';

import { patchPodcastService } from '@/api/podcastServices';
import usePatchPodcastHook from '@/pages/creator/_hooks/usePatchPodcastHook';

jest.mock('../../api/podcastServices', () => ({
    patchPodcastService: jest.fn(),
}));

const TestComponent = ({podcastSlug, formData}) => {
    const { status, isLoading, error } = usePatchPodcastHook(podcastSlug, formData);

    return (
        <div>
            <div data-testid="status">{status}</div>
            <div data-testid="isLoading">{isLoading.toString()}</div>
            <div data-testid="error">{error?.message}</div>
        </div>
    );
};

describe('usePatchPodcastHook', () => {
    const podcastSlug = '123';
    const formData = { name: 'Updated Podcast Name' };

    it('should update podcast information and set status on success', async () => {
        const mockResponse = { status: 200 };
        patchPodcastService.mockResolvedValue(mockResponse); 

        const { getByTestId } = render(<TestComponent podcastSlug={podcastSlug} formData={formData} />);

        await waitFor(() => {
            expect(patchPodcastService).toHaveBeenCalledWith(podcastSlug, formData);
        })

        await waitFor(() => expect(getByTestId('status').textContent).toBe('200'));
        await waitFor(() => expect(getByTestId('isLoading').textContent).toBe('false'));
    });

    it('should handle errors from the API call', async () => {
        const mockError = new Error('API request failed');
        patchPodcastService.mockRejectedValue(mockError);

        const { getByTestId } = render(<TestComponent podcastSlug={podcastSlug} formData={formData} />);

        await waitFor(() => expect(getByTestId('isLoading').textContent).toBe('false'));
        await waitFor(() => expect(getByTestId('error').textContent).toBe(mockError.message));
    });
});
