import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PodcastInformation from '@/components/PodcastInformation';

// Mock the useGetPodcastInformationHook function
jest.mock('../../hooks/useGetPodcastInformationHook', () => {
    return jest.fn(() => ({
        podcast: { name: 'Test Podcast', no_of_episodes: 10 },
        isLoading: false,
    }));
});

describe('PodcastInformation', () => {
    test('renders podcast name and number of episodes', () => {
        const channelId = '1234567890';
        render(<PodcastInformation channelId={channelId} />);
        
        // Assert that the podcast name and number of episodes are rendered correctly
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
        expect(screen.getByText('Number of Episodes: 10')).toBeInTheDocument();
    });

    test('renders a link to the YouTube channel', () => {
        const channelId = '1234567890';
        render(<PodcastInformation channelId={channelId} />);
        
        // Assert that the link to the YouTube channel is rendered correctly
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', 'https://www.youtube/channel/1234567890');
    });
});
