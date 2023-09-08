import React from 'react';
import "@testing-library/jest-dom";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import { useRouter } from 'next/router';

import Episodes from '../../pages/episodes/index'

// Mock the EpisodessSearchResults component
jest.mock('src/components/EpisodesSearchResults', () => {
    return function MockEpisodesSearchResults(props) {
        const results = JSON.stringify(props)
        return <div data-testid="search-results">{results.query}</div>;
    };
});

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe('Episodes', () => {
    test('renders the title, subtitle and link', () => {
        useRouter.mockReturnValue({ route: '/episodes', isReady: true, push: jest.fn() })
        render(<Episodes />);
        expect(screen.getAllByText(/Search for an Episode/i)).toBeInTheDocument;
        expect(
            screen.getAllByText(
                /You can see the Podcasts we have and the amount of episodes on/i
            )[1]
        ).toBeInTheDocument;
        expect(screen.getByRole('link', { name: 'this page' })).toHaveAttribute('href', '/podcasts')
    });

    test('updates the search query when typing', () => {
        useRouter.mockReturnValue({ route: '/episodes', isReady: true, push: jest.fn() })
        render(<Episodes />);
        const input = screen.getByRole('searchbox');
        input.value = 'React';
        expect(input.value).toBe('React');
    });

    test('renders the search results component with the correct query prop', () => {
        useRouter.mockReturnValue({ route: '/episodes', isReady: true, push: jest.fn() })
        render(<Episodes />);
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
        useRouter.mockReturnValue({ route: '/episodes', isReady: true, push: jest.fn() })
        render(<Episodes />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test query' } });
        waitFor(() => expect(searchInput.value).toBe('test query'));
    });

    test('Test that the URL is being updated', () => {
        useRouter.mockReturnValue({ route: '/episodes', isReady: true, push: jest.fn() })
        render(<Episodes />);
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        waitFor(() => expect(global.window.location.href).toContain('/episodes?q=test'));
    });

    test('Loading with query already in URL returns results', () => {
        useRouter.mockReturnValue({ route: '/episodes', isReady: true, push: jest.fn() })
        global.window = { location: { pathname: '/episodes', search: 'q=javascript' } };
        render(<Episodes />);
        waitFor(() => expect(
            screen.getByTestId('search-results').textContent
        ).toBe('JavaScript'));
    })
});