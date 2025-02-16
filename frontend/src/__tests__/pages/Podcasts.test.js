import React from 'react';
import "@testing-library/jest-dom";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import mockRouter from 'next-router-mock';

import PodcastSearch from '../../components/PodcastSearch';

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

// Mock the PodcastsSearchResults component
jest.mock('src/components/PodcastsSearchResults', () => {
    return function MockPodcastsSearchResults(props) {
        const results = JSON.stringify(props)
        return <div data-testid="search-results">{results.query}</div>;
    };
});

describe('Podcasts', () => {
    beforeEach(() => {
        mockRouter.push('/podcasts')
    })

    test('updates the search query when typing', () => {
        render(<PodcastSearch />);
        const input = screen.getByRole('searchbox');
        input.value = 'React';
        expect(input.value).toBe('React');
    });

    test('renders the search results component with the correct query prop', () => {
        render(<PodcastSearch />);
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
        render(<PodcastSearch />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test query' } });
        waitFor(() => expect(searchInput.value).toBe('test query'));
    });

    test('Test that the URL is being updated', () => {
        render(<PodcastSearch />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        waitFor(() => expect(global.window.location.href).toContain('/episodes?q=test'));
    });

    test('Loading with query already in URL returns results', () => {
        global.window = { location: { pathname: '/podcasts', search: 'q=javascript' } };
        render(<PodcastSearch />);
        waitFor(() => expect(
            screen.getByTestId('search-results').textContent
        ).toBe('JavaScript'));
    })
});