import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react';
import SignIn from '@/components/SignIn'; 
import { useSession } from "next-auth/react";
import * as nextAuthReact from 'next-auth/react';
import '@testing-library/jest-dom';

jest.mock('next-auth/react');
jest.mock('../../components/AccountMenu', () => () => <div>AccountMenuMock</div>);

describe('<SignIn />', () => {
    it('renders the AccountMenu when there is a session', () => {
        useSession.mockReturnValue({
            data: { user: { name: 'User', email: 'user@example.com' }},
            status: 'authenticated'
        });

        render(<SignIn />);
        
        expect(screen.getByText('AccountMenuMock')).toBeInTheDocument();
    });

    it('renders the sign-in button when there is no session', () => {
        useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    
        render(<SignIn />);
        const signInButton = screen.getByRole('button', { name: /Sign in/i });

        expect(signInButton).toBeInTheDocument();

        const signInSpy = jest.spyOn(nextAuthReact, 'signIn');
        fireEvent.click(signInButton);
        expect(signInSpy).toHaveBeenCalledWith('google');

        signInSpy.mockRestore();
    });
});
