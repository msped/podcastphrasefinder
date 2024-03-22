import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import useGetPodcastInformationHook from '@/hooks/useGetPodcastInformationHook';
import getPodcastInformationService from '@/api/getPodcastInformationService';
import '@testing-library/jest-dom';

jest.mock('../../api/getPodcastInformationService');

function TestComponent({ channelId }) {
    const { podcast, isLoading } = useGetPodcastInformationHook(channelId);
    
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
        getPodcastInformationService.mockResolvedValue([]);
        const { getByTestId } = render(<TestComponent channelId="channelId" />);
        
        waitFor(() => expect(getByTestId('loading')).toHaveTextContent('Loading...'));
    });

    it('should set podcast data after successful fetch', async () => {
        const mockPodcastData = { episodes: [], title: 'Test Podcast' };
        getPodcastInformationService.mockResolvedValue(mockPodcastData);

        const { getByTestId, queryByTestId } = render(
            <TestComponent channelId="channelId" />
        );

        await waitFor(() => expect(queryByTestId('loading')).toBeNull());

        waitFor(() => expect(getByTestId('podcast').textContent).toBe(JSON.stringify(mockPodcastData)));
    });
});
