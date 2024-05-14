import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import useGetPodcastOrgsHook from '@/hooks/useGetPodcastOrgsHook';

jest.mock("next-auth/react")
jest.mock("../../hooks/useGetPodcastOrgsHook", () => jest.fn())

describe('Header', () => {
    test('renders logo link', () => {
        useSession.mockReturnValue([false, false])
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(<Header />);
        const logoLink = screen.getByText(/PodcastPhraseFinder/i);
        expect(logoLink).toBeInTheDocument();
    });

    test('renders episodes link', () => {
        useSession.mockReturnValue({data: null, status: 'unauthenticated'})
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(<Header />);
        const episodesLink = screen.getByRole('link', { name: /Episodes/i });
        expect(episodesLink).toBeInTheDocument();
    });

    test('renders podcasts link', () => {
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        useSession.mockReturnValue({data: null, status: 'unauthenticated'})
        render(<Header />);
        const podcastsLink = screen.getByRole('link', { name: /Podcasts/i });
        expect(podcastsLink).toBeInTheDocument();
    });

    test('renders a sign in button, when no session', () => {
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        useSession.mockReturnValue({data: null, status: 'unauthenticated'})
        render(<Header />);
        const signInBtn = screen.getByRole('button', { name: /Sign in/i });
        expect(signInBtn).toBeInTheDocument();
    });

    test('renders a sign out button, when there is a session', async () => {
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        useSession.mockReturnValue({
            data: {
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
                user: { username: "admin" }
            },
            status: 'authenticated'
        })
        render(<Header />);
        const accountMenuBtn = screen.getByLabelText(/account settings/i);
        userEvent.click(accountMenuBtn);

        await waitFor(() => {
            expect(screen.getByRole('menu')).toBeInTheDocument();
        })

        const signOutOption = screen.getByText(/sign out/i);
        expect(signOutOption).toBeInTheDocument();
    });

    it('renders the AccountMenu when there is a session', () => {
        useSession.mockReturnValue({
            data: { user: { name: 'User', email: 'user@example.com' }},
            status: 'authenticated'
        });
        useGetPodcastOrgsHook.mockReturnValueOnce({})

        render(<Header />);
        const accountMenuBtn = screen.getByLabelText(/account settings/i);
        expect(accountMenuBtn).toBeInTheDocument();
    });
});
