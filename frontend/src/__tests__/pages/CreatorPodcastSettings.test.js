import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PodcastContext } from '@/context/PodcastContext';
import Settings from '@/pages/creator/podcast/settings';

jest.mock('../../pages/creator/_components/withDashboardLayout', () => (Component) => Component);
jest.mock('../../pages/creator/_components/PodcastSettings');
jest.mock('../../components/LoadingSpinner');

describe('settings Component', () => {
    // it('renders loading spinner when selectedPodcastOrg is null', () => {
    //     render(
    //         <PodcastContext.Provider value={{ selectedPodcastOrg: null }}>
    //             <Settings />
    //         </PodcastContext.Provider>
    //     );

    //     waitFor(() => {
    //         expect(screen.getByRole('progressbar')).toBeInTheDocument();
    //     })
    // });

    it('renders PodcastSettings when selectedPodcastOrg is available', () => {
        const mockPodcast = {
            podcast: {
                slug: 'test-podcast',
                name: 'Test Podcast',
                avatar: 'test-avatar.jpg'
            },
            is_primary: true
        };
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: mockPodcast }}>
                <Settings />
            </PodcastContext.Provider>
        );
        waitFor(() => {
            expect(screen.getByText('Test Podcast')).toBeInTheDocument();
            expect(screen.getByAltText('Test Podcast').src).toContain('test-avatar.jpg');
        })
    });
});

