import * as React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import AccountMenu from '@/components/AccountMenu';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import userEvent from '@testing-library/user-event'
import * as nextAuthReact from 'next-auth/react';
import '@testing-library/jest-dom'

// Mocks for Next.js functions and components
jest.mock('next/link', () => ({ children }) => children);
jest.mock('next-auth/react', () => ({
    signOut: jest.fn(),
    useSession: jest.fn(),
}));

const mockRouter = {
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
};

const mockSession = {
    data: {
        user: {
            username: 'testuser',
        },
        picture: '/path/to/test/image.jpg',
    },
    status: 'authenticated',
};

describe('<AccountMenu />', () => {
    beforeEach(() => {
        nextAuthReact.useSession.mockImplementation(() => mockSession);
    });

    it('opens menu and contains the Sign Out option', async () => {
        render(
            <RouterContext.Provider value={mockRouter}>
                <AccountMenu />
            </RouterContext.Provider>
        );

        const avatar = screen.getByLabelText(/account settings/i);


        await act( async () => userEvent.click(avatar));

        await waitFor(() => {
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });

        const signOutOption = screen.getByText(/sign out/i);
        
        expect(signOutOption).toBeInTheDocument();
        
    });

    it('calls the signOut method with the correct parameter on clicking Sign Out', async () => {
        render(
            <RouterContext.Provider value={mockRouter}>
                <AccountMenu />
            </RouterContext.Provider>
        );

        const avatar = screen.getByLabelText(/account settings/i);
        
        await act( async () => userEvent.click(avatar));

        await waitFor(() => {
            expect(screen.getByText(/sign out/i)).toBeVisible();
        });

        userEvent.click(screen.getByText(/sign out/i));

        await waitFor(() => {
            expect(nextAuthReact.signOut).toHaveBeenCalled();
        });
    });

    it('calls the signOut method with the correct parameter on clicking Sign Out', async () => {
        render(
            <RouterContext.Provider value={mockRouter}>
                <AccountMenu />
            </RouterContext.Provider>
        );

        const avatar = screen.getByLabelText(/account settings/i);
        
        await act( async () => userEvent.click(avatar));

        await waitFor(() => {
            expect(screen.getByText(/sign out/i)).toBeVisible();
        });

        userEvent.click(screen.getByText(/sign out/i));

        await waitFor(() => {
            expect(nextAuthReact.signOut).toHaveBeenCalled();
        });
    });
});
