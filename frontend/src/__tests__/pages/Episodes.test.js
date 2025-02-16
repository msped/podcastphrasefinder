import React from 'react';
import "@testing-library/jest-dom";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import mockRouter from 'next-router-mock';

import EpisodeSearch from '../../components/EpisodeSearch'

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

// Mock the EpisodessSearchResults component
jest.mock('src/components/EpisodesSearchResults', () => {
    return function MockEpisodesSearchResults(props) {
        const results = JSON.stringify(props)
        return <div data-testid="search-results">{results.query}</div>;
    };
});

describe('Episodes', () => {
    beforeEach(() => {
        mockRouter.push('/episodes')
    })

    test('updates the search query when typing', () => {
        render(<EpisodeSearch />);
        const input = screen.getByRole('searchbox');
        input.value = 'React';
        expect(input.value).toBe('React');
    });

    test('renders the search results component with the correct query prop', () => {
        render(<EpisodeSearch />);
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
        render(<EpisodeSearch />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test query' } });
        waitFor(() => expect(searchInput.value).toBe('test query'));
    });

    test('Test that the URL is being updated', () => {
        render(<EpisodeSearch />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        waitFor(() => expect(global.window.location.href).toContain('/episodes?q=test'));
    });

    test('Loading with query already in URL returns results', () => {
        global.window = { location: { pathname: '/episodes', search: 'q=javascript' } };
        render(<EpisodeSearch />);
        waitFor(() => expect(
            screen.getByTestId('search-results').textContent
        ).toBe('JavaScript'));
    })
});