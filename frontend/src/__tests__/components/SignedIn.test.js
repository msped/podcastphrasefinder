import { render, screen } from '@testing-library/react';
import SignedIn from '@/components/SignedIn'; 
import * as nextAuthReact from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock the useSession hook from next-auth/react
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

describe('SignedIn component', () => {
    it('renders children when there is a session', () => {
        nextAuthReact.useSession.mockReturnValue({ data: { user: { name: 'Alice' } }, status: 'authenticated' });

        const childContent = 'Protected content';

        render(<SignedIn>{childContent}</SignedIn>);

        expect(screen.getByText(childContent)).toBeInTheDocument();
    });

    it('renders nothing when there is no session', () => {
        nextAuthReact.useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

        const childContent = 'Protected content';
        const consoleSpy = jest.spyOn(console, 'error');

        render(<SignedIn>{childContent}</SignedIn>);

        expect(screen.queryByText(childContent)).not.toBeInTheDocument();

        consoleSpy.mockRestore();
    });
});
