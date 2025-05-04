import React from 'react';
import { render, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { PodcastContext, PodcastProvider } from '@/context/PodcastContext'; 
import { getOrgSelectionService } from '@/api/membershipServices';
import postOrgSelectionService from "@/api/postOrgSelectionService";

// Mock next-auth useSession hook
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

// Mock service calls
jest.mock('../../api/membershipServices', () => ({
    getOrgSelectionService: jest.fn(),
}));
jest.mock('../../api/postOrgSelectionService');

describe('PodcastProvider', () => {
    const mockSession = {
        user: { name: 'Test User' },
    };

    beforeEach(() => {
        useSession.mockReturnValue({
            data: mockSession,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and sets selectedPodcastOrg on initial load', async () => {
        const mockResponse = [
            { podcast: {slug: 'test-podcast'}, is_primary: true},
            { podcast: {slug: 'test-podcast-2'}, is_primary: false},
            { podcast: {slug: 'test-podcast-3'}, is_primary: false},
            { podcast: {slug: 'test-podcast-4'}, is_primary: false},
        ];
        getOrgSelectionService.mockResolvedValue(mockResponse);

        let contextValue;
        await act(async () => {
            render(
                <PodcastProvider>
                    <PodcastContext.Consumer>
                        {value => {
                            contextValue = value;
                            return null;
                        }}
                    </PodcastContext.Consumer>
                </PodcastProvider>
            );
        });

        expect(getOrgSelectionService).toHaveBeenCalled();
        expect(contextValue.selectedPodcastOrg).toMatchObject({"slug": "test-podcast"});
    });

    test('handles organization change correctly', async () => {
        const mockInitialResponse = [
            { podcast: {slug: 'initial-podcast'}, is_primary: true },
            { podcast: {slug: 'test-podcast-2'}, is_primary: false},
            ];
        const mockChangeResponse = { podcast: { slug: 'changed-podcast' } };
        
        getOrgSelectionService.mockResolvedValue(mockInitialResponse);
        postOrgSelectionService.mockResolvedValue(mockChangeResponse);

        let contextValue;
        await act(async () => {
            render(
                <PodcastProvider>
                    <PodcastContext.Consumer>
                        {value => {
                            contextValue = value;
                            return null;
                        }}
                    </PodcastContext.Consumer>
                </PodcastProvider>
            );
        });

        // Ensure initial fetch happened
        expect(getOrgSelectionService).toHaveBeenCalled();
        expect(contextValue.selectedPodcastOrg.slug).toBe('initial-podcast');

        // Simulating org change
        await act(async () => {
            await contextValue.handlePodcastOrgChange('new-org');
        });

        expect(postOrgSelectionService).toHaveBeenCalledWith('new-org');
        expect(contextValue.selectedPodcastOrg).toMatchObject({slug: 'changed-podcast'});
    });
});
