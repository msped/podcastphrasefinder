import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import '@testing-library/jest-dom'
import Link from '@/components/Link';

jest.mock('next/router', () => require('next-router-mock'));

describe('Link', () => {
    it('renders a link with the specified href', () => {
        mockRouter.push("/about")
        const { getByRole } = render(<Link href="/about">About</Link>);
        const link = getByRole('link', { name: /About/i });
        expect(link).toHaveAttribute('href', '/about');
    });

    it('adds the active class to the link when on the current page', () => {
        const { getByRole } = render(
            <Link href="/about" activeClassName="active">
                About
            </Link>
        );
        const link = getByRole('link', { name: /About/i });
        expect(link).toHaveClass('active');
    });

    it('renders the podcasts page from the home', () => {
        // set initial url
        mockRouter.push("/")

        // render component
        const { getByRole } = render(<Link href="/podcasts">Podcasts</Link>)
        expect(mockRouter).toMatchObject({
            pathname: "/",
        })

        // click the link button
        fireEvent.click(getByRole('link', { name: /Podcasts/i }))

        // check the router was updated
        waitFor(()=> {
            expect(mockRouter).toMatchObject({
            pathname: "/podcasts"
            })
        })
    })
});
