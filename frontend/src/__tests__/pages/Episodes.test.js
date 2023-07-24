import React from 'react'
import "@testing-library/jest-dom"
import { screen, render, waitFor, fireEvent } from "@testing-library/react"
import * as nextRouter from 'next/router'

import Episodes from '../../pages/episodes/index'

// Mock the EpisodessSearchResults component
jest.mock('src/components/EpisodesSearchResults', () => {
    return function MockEpisodesSearchResults(props) {
        const results = JSON.stringify(props)
        return <div data-testid="search-results">{results.query}</div>;
    };
});

nextRouter.useRouter = jest.fn()
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))

describe('Episodes', () => {
    test('renders the title, subtitle and link', () => {
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
        render(<Episodes />);
        const input = screen.getByRole('searchbox');
        input.value = 'React';
        expect(input.value).toBe('React');
    });

    test('renders the search results component with the correct query prop', () => {
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
});