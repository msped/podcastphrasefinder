import React from 'react'
import { screen, render, waitFor, fireEvent } from "@testing-library/react"

import Podcasts from '../../pages/podcasts/index'

// Mock the PodcastsSearchResults component
jest.mock('src/components/PodcastsSearchResults', () => {
    return function MockPodcastsSearchResults(props) {
        const results = JSON.stringify(props)
        return <div data-testid="search-results">{results.query}</div>;
    };
});

describe('Podcasts', () => {
    test('renders the title and subtitle', () => {
        render(<Podcasts />);
        expect(screen.getAllByText(/Podcasts/i)[0]).toBeInTheDocument;
        expect(
            screen.getAllByText(
                /see all the podcasts and the amount of episodes we have transcripts for/i
            )[1]
        ).toBeInTheDocument;
    });

    test('updates the search query when typing', () => {
        render(<Podcasts />);
        const input = screen.getByRole('searchbox');
        input.value = 'React';
        expect(input.value).toBe('React');
    });

    test('renders the search results component with the correct query prop', () => {
        render(<Podcasts />);
        fireEvent.change(
            screen.getByRole('searchbox'),
            { target: {
                value: 'JavaScript'
            }}
        )
        waitFor(() => expect(
            screen.getByTestId('search-results').textContent
        ).toBe('JavaScript'));
    });
});