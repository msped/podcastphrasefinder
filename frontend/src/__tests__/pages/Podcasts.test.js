import React from 'react';
import "@testing-library/jest-dom";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import {  useRouter } from 'next/router';

import Podcasts from '../../pages/podcasts/index';

// Mock the PodcastsSearchResults component
jest.mock('src/components/PodcastsSearchResults', () => {
    return function MockPodcastsSearchResults(props) {
        const results = JSON.stringify(props)
        return <div data-testid="search-results">{results.query}</div>;
    };
});

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe('Podcasts', () => {
    test('renders the title and subtitle', () => {
        useRouter.mockReturnValue({ route: '/podcasts', isReady: true, push: jest.fn() })
        render(<Podcasts />);
        expect(screen.getAllByText(/Podcasts/i)[0]).toBeInTheDocument;
        expect(
            screen.getAllByText(
                /see all the podcasts and the amount of episodes we have transcripts for/i
            )[1]
        ).toBeInTheDocument;
    });

    test('updates the search query when typing', () => {
        useRouter.mockReturnValue({ route: '/podcasts', isReady: true, push: jest.fn() })
        render(<Podcasts />);
        const input = screen.getByRole('searchbox');
        input.value = 'React';
        expect(input.value).toBe('React');
    });

    test('renders the search results component with the correct query prop', () => {
        useRouter.mockReturnValue({ route: '/podcasts', isReady: true, push: jest.fn() })
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

    test('updates searchQuery state on input change', () => {
        useRouter.mockReturnValue({ route: '/podcasts', isReady: true, push: jest.fn() })
        render(<Podcasts />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test query' } });
        waitFor(() => expect(searchInput.value).toBe('test query'));
    });

    test('Test that the URL is being updated', () => {
        useRouter.mockReturnValue({ route: '/podcasts', isReady: true, push: jest.fn() })
        render(<Podcasts />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        waitFor(() => expect(global.window.location.href).toContain('/episodes?q=test'));
    });

    test('Loading with query already in URL returns results', () => {
        useRouter.mockReturnValue({ route: '/podcasts', isReady: true, push: jest.fn() })
        global.window = { location: { pathname: '/podcasts', search: 'q=javascript' } };
        render(<Podcasts />);
        waitFor(() => expect(
            screen.getByTestId('search-results').textContent
        ).toBe('JavaScript'));
    })
});