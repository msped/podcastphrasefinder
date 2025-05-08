import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { useGetPodcastOrgsHook } from '@/hooks/membershipHooks';
import { getOrgSelectionService } from '@/api/membershipServices'; 

jest.mock('../../api/membershipServices', () => ({
    getOrgSelectionService: jest.fn(),
}));

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
        getOrgSelectionService.mockResolvedValue([]);
        const { getByTestId } = render(<TestComponent />);
        
        waitFor(() => expect(getByTestId('loading')).toHaveTextContent('Loading...'));
    });

    it('should set podcasts data after successful fetch', async () => {
        const mockPodcastData = [{ id: 1, name: 'Test Podcast Org' }];
        getOrgSelectionService.mockResolvedValue(mockPodcastData);

        const { getByTestId } = render(<TestComponent />);

        waitFor(() => expect(getByTestId('podcasts').textContent).toBe(JSON.stringify(mockPodcastData)));
    });
});
