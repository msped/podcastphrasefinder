import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PodcastContext } from '@/context/PodcastContext';
import getOrgSelectionService from '@/api/getOrgSelectionService';
import Settings from '@/pages/creator/podcast/settings';

jest.mock('../../pages/creator/_components/withDashboardLayout', () => (Component) => Component);
jest.mock('../../pages/creator/_components/PodcastSettings');
jest.mock('../../pages/creator/_components/UserManagement')
jest.mock('../../api/getOrgSelectionService', );
jest.mock('../../components/LoadingSpinner');

describe('settings Component', () => {
    const mockPodcast = {
        podcast: {
            slug: 'test-podcast',
            name: 'Test Podcast',
            avatar: 'test-avatar.jpg'
        },
        is_primary: true
    };

    const mockResponse = {
        data: mockPodcast,
        status: 200
    }

    beforeEach(() => {
        jest.clearAllMocks();
        getOrgSelectionService.mockResolvedValue([mockResponse]);
    });

    it('renders loading spinner when selectedPodcastOrg is null', () => {
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: null }}>
                <Settings />
            </PodcastContext.Provider>
        );

        waitFor(() => {
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        })
    });

    it('renders PodcastSettings when selectedPodcastOrg is available', async () => {
        

        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: mockPodcast }}>
                <Settings />
            </PodcastContext.Provider>
        );
        waitFor(() => {expect(screen.getByText('Test Podcast')).toBeInTheDocument()})
        waitFor(() => {expect(screen.getByAltText('Test Podcast').src).toContain('test-avatar.jpg')})
    });
});

