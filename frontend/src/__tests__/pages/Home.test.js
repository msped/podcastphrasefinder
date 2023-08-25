import React from 'react';
import "@testing-library/jest-dom"
import { screen, render, waitFor, fireEvent } from "@testing-library/react"
import mockRouter from 'next-router-mock';
import Home from '@/pages/index';
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';

jest.mock('next/router', () => require('next-router-mock'))

jest.mock('../../hooks/useGetMostPopularHook', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        episode: {
            id: 1,
            title: 'Episode 1',
            video_id: 'AZLU_4G8CY0',
            published_date: '2023-08-25T20:55:33Z',
            channel: {
                name: 'Dead Men Talking',
                channel_id: 'UCuV8fchmNqEljq3wcTCjxeA'
            },
        },
        isLoading: false,
    })),
}));

describe('Home component', () => {
    it('renders "PodFinder" header text', () => {
        render(<Home />);
        expect(screen.queryAllByText(/PodFinder/i)[0]).toBeInTheDocument();
    });

    it('renders the episodes page from the home page', () => {
        mockRouter.push('/')

        const { getByRole } = render(<Home />)
        expect(mockRouter).toMatchObject({
            pathname: '/'
        })

        fireEvent.click(getByRole('link', { name: /Go to Episodes/i }))

        expect(screen.getByText('Search for an Episode')).toBeInTheDocument();
        waitFor(() => {
            expect(mockRouter).toMatchObject({
                pathname: '/episodes'
            })
        })
    })

    it('renders the podcasts page from the home page', () => {
        mockRouter.push('/')

        const { getByRole } = render(<Home />)
        expect(mockRouter).toMatchObject({
            pathname: '/'
        })

        fireEvent.click(getByRole('link', { name: /Go to Podcasts/i }))

        expect(screen.getByText('Search Podcasts')).toBeInTheDocument();
        waitFor(() => {
            expect(mockRouter).toMatchObject({
                pathname: '/podcasts'
            })
        })
    })

    it('renders the podcasts youtube page in the most popular card', () => {
        render(<Home />)
        expect(
            screen.getByRole('link', { name: /Dead Men Talking/i })
        ).toBeInTheDocument();
    })
    
});