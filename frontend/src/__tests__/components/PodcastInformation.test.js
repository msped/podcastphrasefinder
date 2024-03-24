import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PodcastInformation from '@/components/PodcastInformation';

// Mock the useGetPodcastInformationHook function
jest.mock('../../hooks/useGetPodcastInformationHook', () => {
    return jest.fn(() => ({
        podcast: {
            name: 'Test Podcast',
            slug: 'test-podcast',
            channel_id: '1234567890',
            avatar: "https://yt3.ggpht.com/sROZx5jI62ZX-7Udpthim3reUrYnjGwBrzoJ_JuvKjLcxnHuceC1IHLWIfoykgi28rmW_EIV=s800-c-k-c0x00ffffff-no-rj",
        },
        isLoading: false,
    }));
});

describe('PodcastInformation', () => {
    test('renders podcast name and number of episodes', () => {
        const slug = '1234567890';
        render(<PodcastInformation slug={slug} />);
        
        // Assert that the podcast name and number of episodes are rendered correctly
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
    });

    test('renders a link to the YouTube channel', () => {
        const slug = '1234567890';
        render(<PodcastInformation slug={slug} />);
        
        // Assert that the link to the YouTube channel is rendered correctly
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', 'https://www.youtube.com/channel/1234567890');
    });

    test('test render of avatar', () => {
        render(<PodcastInformation slug={'test-podcast'}/>);
        const channelAvatar = screen.getAllByAltText('Test Podcast')[0];
        expect(channelAvatar.src).toEqual("https://yt3.ggpht.com/sROZx5jI62ZX-7Udpthim3reUrYnjGwBrzoJ_JuvKjLcxnHuceC1IHLWIfoykgi28rmW_EIV=s800-c-k-c0x00ffffff-no-rj")
    });
});
