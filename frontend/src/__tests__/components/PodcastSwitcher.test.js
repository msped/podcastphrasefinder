import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PodcastSwitcher from '@/components/PodcastSwitcher';
import { PodcastContext } from '@/context/PodcastContext';
import { useGetPodcastOrgsHook } from '@/hooks/membershipHooks';

jest.mock('../../hooks/membershipHooks', () => ({
    useGetPodcastOrgsHook: jest.fn(),
}));

const mockPodcasts = [
    {
        id: 1,
        is_primary: true,
        podcast: {
            name: 'Podcast 1',
            avatar: 'avatar1.jpg',
            slug: 'podcast-1',
        },
        user: {
            id: 1,
            username: 'user1',
        }
    },
    {
        id: 2,
        is_primary: false,
        podcast: {
            name: 'Podcast 2',
            avatar: 'avatar2.jpg',
            role: 'Member',
        },
        user: {
            id: 1,
            username: 'user1',
        }
    }
];

describe('PodcastSwitcher', () => {
    const mockHandlePodcastOrgChange = jest.fn();

    it('renders loading state initially', () => {
        useGetPodcastOrgsHook.mockReturnValue({ isLoading: true });
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: null, handlePodcastOrgChange: mockHandlePodcastOrgChange }}>
                <PodcastSwitcher />
            </PodcastContext.Provider>
        );
        
        expect(screen.getByTestId('podcast-switcher-skeleton')).toBeInTheDocument();
    });

    it('renders button with selected podcast name', async () => {
        useGetPodcastOrgsHook.mockReturnValue({ podcasts: mockPodcasts, isLoading: false });
        const selectedPodcastOrg = mockPodcasts[0];

        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg, handlePodcastOrgChange: mockHandlePodcastOrgChange }}>
                <PodcastSwitcher />
            </PodcastContext.Provider>
        );

        waitFor(() => {
            expect(screen.getByText(selectedPodcastOrg.podcast.name)).toBeInTheDocument();
        })

    });

    it('opens and closes the podcast switcher dropdown when button is clicked', async () => {
        useGetPodcastOrgsHook.mockReturnValue({ podcasts: mockPodcasts, isLoading: false });
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: mockPodcasts[0], handlePodcastOrgChange: mockHandlePodcastOrgChange }}>
                <PodcastSwitcher />
            </PodcastContext.Provider>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText('Create a Podcast')).toBeVisible());

        fireEvent.click(button);
        await waitFor(() => expect(screen.queryByText('Create a Podcast')).not.toBeInTheDocument());
    });
});
