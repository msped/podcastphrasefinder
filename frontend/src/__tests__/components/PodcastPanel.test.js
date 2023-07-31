import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import PodcastPanel from '@/components/PodcastPanel';

describe('PodcastPanel', () => {
    const podcast = {
        name: 'Test Podcast',
        no_of_episodes: 10,
        channel_id: 'dvm402rvn3553'
    };

    it('renders the podcast name', () => {
        render(<PodcastPanel podcast={podcast} />);
        const podcastName = screen.getByText(/Test Podcast/i);
        expect(podcastName).toBeInTheDocument();
    });

    it('renders the number of episodes', () => {
        render(<PodcastPanel podcast={podcast} />);
        const episodeNumber = screen.getByText(/No. 10/i);
        expect(episodeNumber).toBeInTheDocument();
    });

    it('has a link to the podcast channel', () => {
        render(<PodcastPanel podcast={podcast} />);
        const link = screen.getByRole('link', { name: /Test Podcast/i });
        expect(link).toHaveAttribute('href', 'https://www.youtube.com/channel/dvm402rvn3553');
        expect(link).toHaveAttribute('target', '_blank');
    });
});
