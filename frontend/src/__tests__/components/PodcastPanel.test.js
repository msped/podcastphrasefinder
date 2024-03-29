import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import PodcastPanel from '@/components/PodcastPanel';

describe('PodcastPanel', () => {
    const podcast = {
        name: "Test Podcast",
        slug: "test-podcast",
        channel_id: "dvm402rvn3553",
        avatar: "https://yt3.ggpht.com/sROZx5jI62ZX-7Udpthim3reUrYnjGwBrzoJ_JuvKjLcxnHuceC1IHLWIfoykgi28rmW_EIV=s800-c-k-c0x00ffffff-no-rj"
    };

    it('renders the podcast name', () => {
        render(<PodcastPanel podcast={podcast} />);
        const podcastName = screen.getByText(/Test Podcast/i);
        expect(podcastName).toBeInTheDocument();
    });

    it('has a link to the podcast channel', () => {
        render(<PodcastPanel podcast={podcast} />);
        const link = screen.getByRole('link', { name: /Test Podcast/i });
        expect(link).toHaveAttribute('href', `/podcasts/${podcast.slug}`);
    });

    it('renders the channel avatar', () => {
        render(<PodcastPanel podcast={podcast} />)
        const avatar = screen.getByAltText('Test Podcast')
        expect(avatar.src).toEqual(podcast.avatar)
    });
});
