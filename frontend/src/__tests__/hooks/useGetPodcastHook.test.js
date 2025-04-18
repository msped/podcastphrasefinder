import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import useGetPodcastHook from '@/hooks/useGetPodcastHook';
import getPodcastService from '@/api/getPodcastService';
import '@testing-library/jest-dom';

jest.mock('../../api/getPodcastService');

function TestComponent({ channelId }) {
    const { podcast, isLoading } = useGetPodcastHook(channelId);
    
    return (
        <div>
            {isLoading ? (
                <span data-testid="loading">Loading...</span>
            ) : (
                <div data-testid="podcast">{JSON.stringify(podcast)}</div>
            )}
        </div>
    );
}

describe('useGetPodcastInformationHook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should start with loading state and an empty podcast array', async () => {
        getPodcastService.mockResolvedValue([]);
        const { getByTestId } = render(<TestComponent channelId="channelId" />);
        
        waitFor(() => expect(getByTestId('loading')).toHaveTextContent('Loading...'));
    });

    it('should set podcast data after successful fetch', async () => {
        const mockPodcastData = { episodes: [], title: 'Test Podcast' };
        getPodcastService.mockResolvedValue(mockPodcastData);

        const { getByTestId, queryByTestId } = render(
            <TestComponent channelId="channelId" />
        );

        await waitFor(() => expect(queryByTestId('loading')).toBeNull());

        waitFor(() => expect(getByTestId('podcast').textContent).toBe(JSON.stringify(mockPodcastData)));
    });
});
