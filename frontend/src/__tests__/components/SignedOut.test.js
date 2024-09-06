import { render, screen } from '@testing-library/react';
import SignedOut from '@/components/SignedOut'; 
import * as nextAuthReact from 'next-auth/react';
import '@testing-library/jest-dom';

jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

describe('SignedOut component', () => {
    it('renders nothing when there is a session', () => {
        nextAuthReact.useSession.mockReturnValue({ data: { user: { name: 'Alice' } }, status: 'authenticated' });

        const childContent = 'Public content';

        const consoleSpy = jest.spyOn(console, 'error');

        render(<SignedOut>{childContent}</SignedOut>);

        expect(screen.queryByText(childContent)).not.toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('renders children when there is no session', () => {
        nextAuthReact.useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

        const childContent = 'Public content';

        render(<SignedOut>{childContent}</SignedOut>);

        expect(screen.getByText(childContent)).toBeInTheDocument();
    });
});
