import React from 'react';
import { render, waitFor } from '@testing-library/react';
import useGetPodcastOrgsHook from '@/hooks/useGetPodcastOrgsHook';
import getPodcastOrgsService from '@/api/getPodcastOrgsService'; 

jest.mock('../../api/getPodcastOrgsService');

function TestComponent() {
    const { podcasts, isLoading } = useGetPodcastOrgsHook();
    
    return (
        <div>
            {isLoading ? (
                <span data-testid="loading">Loading...</span>
            ) : (
                <div data-testid="podcasts">{JSON.stringify(podcasts)}</div>
            )}
        </div>
    );
}

describe('useGetPodcastOrgsHook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should start with loading state and an empty podcasts array', async () => {
        getPodcastOrgsService.mockResolvedValue([]);
        const { getByTestId } = render(<TestComponent />);
        
        waitFor(() => expect(getByTestId('loading')).toHaveTextContent('Loading...'));
    });

    it('should set podcasts data after successful fetch', async () => {
        const mockPodcastData = [{ id: 1, name: 'Test Podcast Org' }];
        getPodcastOrgsService.mockResolvedValue(mockPodcastData);

        const { getByTestId, queryByTestId } = render(<TestComponent />);

        await waitFor(() => expect(queryByTestId('loading')).toBeNull());

        waitFor(() => expect(getByTestId('podcasts').textContent).toBe(JSON.stringify(mockPodcastData)));
    });
});
