import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserManagement from '@/pages/creator/_components/UserManagement';
import { useGetMembershipsHook, useDeleteMembershipHook, usePatchMembershipHook, usePostMembershipHook } from '@/pages/creator/_hooks/membershipHooks';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TransferOwnership from '@/pages/creator/_components/TransferOwnership';

jest.mock('../../pages/creator/_hooks/membershipHooks', () => ({
    useGetMembershipsHook: jest.fn(),
    useDeleteMembershipHook: jest.fn(),
    usePatchMembershipHook: jest.fn(),
    usePostMembershipHook: jest.fn(),
}));

jest.mock('../../pages/creator/_components/TransferOwnership', () => {
    const mockComponent = () => <div>TransferOwnership Component</div>
    return mockComponent;
})

let mockMemberships = [
    { id: 1, user: { full_name: 'John Doe', email: 'john.doe@example.com' }, role: 'Member' },
    { id: 2, user: { full_name: 'Jane Doe', email: 'jane.doe@example.com' }, role: 'Admin' },
];

describe('UserManagement Component', () => {

    beforeEach(() => {
        useGetMembershipsHook.mockReturnValue({
            memberships: mockMemberships,
            isLoading: false,
            setMemberships: jest.fn(),
        });

        usePostMembershipHook.mockReturnValue({
            response: null,
            status: null,
            error: null,
        })

        usePatchMembershipHook.mockReturnValue({
            response: null,
            status: null,
            error: null,
        })
        useDeleteMembershipHook.mockReturnValue({
            status: null,
            error: null
        })
    });

    it('renders the component and displays the users', () => {
        render(<UserManagement />);
        expect(screen.getByText('User Permissions')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('opens the add user dialog', () => {
        render(<UserManagement />);
        fireEvent.click(screen.getByRole('button', { name: 'Add User' }));
        expect(screen.getByRole('heading', { name: 'Add User' })).toBeVisible();
        expect(screen.getByLabelText('Email')).toBeVisible();
        expect(screen.getByLabelText('Role')).toBeVisible();
    });


    it('opens the edit user dialog and populates the fields', () => {
        render(<UserManagement />);
        fireEvent.click(screen.getAllByLabelText('edit')[0]);
        expect(screen.getByText('Edit User')).toBeVisible();
        expect(screen.getByLabelText('Email')).toHaveValue('john.doe@example.com');
        expect(screen.getByTestId('role-selector')).toHaveValue('Member');
    });


    describe('Testing the add user dialog and functionality', () => {

        beforeAll(() => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation(query => ({
                    matches: false,
                    media: query,
                    onchange: null,
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            });
        })

        beforeEach(() => {
            useGetMembershipsHook.mockReturnValue({ memberships: mockMemberships, isLoading: false, setMemberships: jest.fn() });
            usePostMembershipHook.mockReturnValue({ response: null, status: null, error: null });
        });
    
        it('opens the Add User dialog when clicking Add User button', () => {
            render(<UserManagement />);
            
            const addButton = screen.getByRole('button', { name: /add user/i });
            fireEvent.click(addButton);
    
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Add User' })).toBeInTheDocument();
        });
    
        it('should update the email field when typing', () => {
            render(<UserManagement />);
    
            const addButton = screen.getByRole('button', { name: /add user/i });
            fireEvent.click(addButton);
    
            const emailInput = screen.getByLabelText(/email/i);
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
            expect(emailInput.value).toBe('test@example.com');
        });
    
        it('submits the form when the Save button is clicked', async () => {
            usePostMembershipHook.mockReturnValue({
                status: 201,
                response: {
                    id: 3,
                    user: {
                        first_name: 'John',
                        last_name: 'Doe',
                        full_name: 'John Doe',
                        email: 'test@example.com'
                    },
                    role: "Member"
                }
            });
    
            render(
                <>
                    <Toaster />
                    <UserManagement />
                </>
            );
    
            const addButton = screen.getByRole('button', { name: /add user/i });
            fireEvent.click(addButton);
    
            const emailInput = screen.getByLabelText(/email/i);
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

            const roleSelector = screen.getByTestId('role-selector');
            fireEvent.change(roleSelector, { target: { value: 'Member' } });
    
            const saveButton = screen.getByRole('button', { name: /save/i });
            fireEvent.click(saveButton);
    
            expect(useGetMembershipsHook().setMemberships).toHaveBeenCalled();
            await waitFor(() => expect(screen.getByText(/John has been given Member role./i)).toBeInTheDocument())

        });

        it('should handle errors from the backend during user creation', async () => {
            usePostMembershipHook.mockReturnValue({
                status: 400,
                error: { response: { data: { "user.email": ["Invalid email"] } } },
            });


            render(
                <>
                    <Toaster />
                    <UserManagement />
                </>
            );
            fireEvent.click(screen.getByRole('button', { name: 'Add User' }));

            fireEvent.change(screen.getByLabelText('Email'), { target: { name: "user.email", value: 'invalid email' } });
            fireEvent.change(screen.getByTestId('role-selector'), { target: { value: 'Admin' } });

            await userEvent.click(screen.getByText('Save'));
            await waitFor(() => expect(screen.getByText(/user.email - Invalid email/i)).toBeInTheDocument())

        });

    });


    describe('Edit User Functionality', () => {
        it('should update the user info with edited values', async () => {
            const updatedMembership = { id: 1, user: { full_name: 'John Doe', email: 'john.updated@example.com' }, role: 'Admin' };

            usePatchMembershipHook.mockReturnValue({ response: updatedMembership, status: 200 });
            const mockSetMemberships = jest.fn();
            useGetMembershipsHook.mockReturnValue({ memberships: mockMemberships, isLoading: false, setMemberships: mockSetMemberships })

            render(<UserManagement />);

            fireEvent.click(screen.getAllByLabelText('edit')[0]);

            fireEvent.change(screen.getByTestId('role-selector'), { target: { value: 'Admin' } });

            fireEvent.click(screen.getByRole('button', { name: 'Save' }));

            await waitFor(() => expect(mockSetMemberships).toHaveBeenCalled())
        });

        it("should handle errors when editing a user", async () => {
            usePatchMembershipHook.mockReturnValue({ status: 400, error: { response: { data: { role: ["Role is required"] } } } });
            const mockSetMemberships = jest.fn();
            useGetMembershipsHook.mockReturnValue({ memberships: mockMemberships, isLoading: false, setMemberships: mockSetMemberships })
            render(<UserManagement />);

            fireEvent.click(screen.getAllByLabelText('edit')[0]);
            fireEvent.change(screen.getByTestId('role-selector'), { target: { value: '' } });
            fireEvent.click(screen.getByText('Save'));
            await waitFor(() => { expect(mockSetMemberships).not.toHaveBeenCalled() })

        })
    });

    describe('Delete User Functionality', () => {
        it('should delete a user and close dialog', async () => {
            useDeleteMembershipHook.mockReturnValue({ status: 204 });
            const mockSetMemberships = jest.fn();
            useGetMembershipsHook.mockReturnValue({ memberships: mockMemberships, isLoading: false, setMemberships: mockSetMemberships })

            render(<UserManagement />);
            fireEvent.click(screen.getAllByLabelText('delete')[0]);

            await waitFor(() => expect(mockSetMemberships).toHaveBeenCalledWith(
                expect.not.arrayContaining([
                    expect.objectContaining({ id: 1 })
                ])
            ));
        });

        it("should handle errors when deleting", async () => {
            useDeleteMembershipHook.mockReturnValue({ status: 400, error: { response: { data: { detail: "Error deleting user." } } } });
            const mockSetMemberships = jest.fn();

            useGetMembershipsHook.mockReturnValue({ memberships: mockMemberships, isLoading: false, setMemberships: mockSetMemberships })
            render(<UserManagement />);
            fireEvent.click(screen.getAllByLabelText('delete')[0]);


            await waitFor(() => expect(mockSetMemberships).not.toHaveBeenCalled())
        })
    });
});