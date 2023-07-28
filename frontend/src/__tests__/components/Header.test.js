import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Header from '@/components/Header';

describe('Header', () => {
    test('renders logo link', () => {
        render(<Header />);
        const logoLink = screen.getByText(/PodFinder/i);
        expect(logoLink).toBeInTheDocument();
    });

    test('renders episodes link', () => {
        render(<Header />);
        const episodesLink = screen.getByRole('link', { name: /Episodes/i });
        expect(episodesLink).toBeInTheDocument();
    });

    test('renders podcasts link', () => {
        render(<Header />);
        const podcastsLink = screen.getByRole('link', { name: /Podcasts/i });
        expect(podcastsLink).toBeInTheDocument();
    });
});
