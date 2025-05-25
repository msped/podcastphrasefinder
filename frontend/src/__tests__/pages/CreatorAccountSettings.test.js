import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SettingsPage from '/Users/matthewedwards/Documents/Development/podfinder/frontend/src/pages/creator/settings/index.js';
import { useGetUserHook, usePatchUserHook } from '@/hooks/userHooks';


jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }) => {
            global.mockHeadChildren = children; 
            return <>{children}</>;
        },
    };
});

// Mock custom hooks
jest.mock('../../hooks/userHooks', () => ({
    useGetUserHook: jest.fn(),
    usePatchUserHook: jest.fn(() => 'mockedPatchUserHook'), // Return a simple identifiable value
}));

// Mock child components
jest.mock('../../pages/creator/_components/EditableField', () => {
    return {
        __esModule: true,
        default: jest.fn(({ children, fieldName, onSave, variant }) => (
            <div data-testid={`editable-field-${fieldName}`}>
                <span>{children}</span>
                <span>{`fieldName: ${fieldName}`}</span>
                <span>{`onSave: ${typeof onSave}`}</span>
                <span>{`variant: ${variant}`}</span>
            </div>
        )),
    };
});

jest.mock('../../pages/creator/_components/DeleteAccount', () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div data-testid="delete-account">DeleteAccount</div>),
    };
});

jest.mock('../../components/LoadingSpinner', () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div data-testid="loading-spinner">LoadingSpinner</div>),
    };
});


describe('SettingsPage', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        global.mockHeadChildren = null;
    });

    it('renders LoadingSpinner when isLoading is true', () => {
        useGetUserHook.mockReturnValue({ user: null, isLoading: true });
        render(<SettingsPage />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        expect(screen.queryByText('Account Settings')).not.toBeInTheDocument();
    });

    it('renders "User not found" when user is null and not loading', () => {
        useGetUserHook.mockReturnValue({ user: null, isLoading: false });
        render(<SettingsPage />);
        expect(screen.getByText('User not found')).toBeInTheDocument();
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    describe('when user data is available', () => {
        const mockUser = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
        };

        beforeEach(() => {
            useGetUserHook.mockReturnValue({ user: mockUser, isLoading: false });
            render(<SettingsPage />);
        });

        it('renders the correct page title', () => {
            const titleElement = global.mockHeadChildren.props.children;
            expect(titleElement).toBe('Account Settings | PodcastPhraseFinder');
        });

        it('renders the "Account Settings" heading', () => {
            expect(screen.getByText('Account Settings')).toBeInTheDocument();
        });

        it('renders EditableField for first name with correct props', () => {
            const firstNameField = screen.getByTestId('editable-field-first_name');
            expect(firstNameField).toBeInTheDocument();
            expect(screen.getByText(mockUser.first_name)).toBeInTheDocument();
            expect(screen.getByText('fieldName: first_name')).toBeInTheDocument();
            expect(screen.queryAllByText('onSave: function')[0]).toBeInTheDocument();
            expect(screen.queryAllByText('variant: subtitle1')[0]).toBeInTheDocument();
        });

        it('renders EditableField for last name with correct props', () => {
            const lastNameField = screen.getByTestId('editable-field-last_name');
            expect(lastNameField).toBeInTheDocument();
            expect(screen.getByText(mockUser.last_name)).toBeInTheDocument();
            expect(screen.getByText('fieldName: last_name')).toBeInTheDocument();
            expect(screen.queryAllByText('onSave: function')[1]).toBeInTheDocument();
            expect(screen.queryAllByText('variant: subtitle1')[1]).toBeInTheDocument();
        });

        it('renders the user email (non-editable)', () => {
            expect(screen.getByText(mockUser.email)).toBeInTheDocument();
            expect(screen.getByText('You cannot change your email address due to linking your account with Google.')).toBeInTheDocument();
        });

        it('renders the DeleteAccount component', () => {
            expect(screen.getByTestId('delete-account')).toBeInTheDocument();
            expect(screen.getByText('DeleteAccount')).toBeInTheDocument();
        });
    });
});

