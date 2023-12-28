import React from 'react';
import "@testing-library/jest-dom"
import { screen, render, waitFor, fireEvent } from "@testing-library/react"
import mockRouter from 'next-router-mock';
import Home from '@/pages/index';

jest.mock('next/router', () => require('next-router-mock'))

describe('Home component', () => {
    it('renders "PodcastPhraseFinder" header text', () => {
        render(<Home />);
        expect(screen.queryAllByText(/PodcastPhraseFinder/i)[0]).toBeInTheDocument();
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
});