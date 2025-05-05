import React, { useContext } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import TransferOwnership from '@/pages/creator/_components/TransferOwnership';
import { PodcastContext } from '@/context/PodcastContext';
import '@testing-library/jest-dom'
import { SessionProvider } from 'next-auth/react';
import { useTransferMembershipHook } from '@/hooks/membershipHooks';
import toast from 'react-hot-toast';
import { debug } from 'jest-preview';

jest.mock('../../hooks/membershipHooks', () => ({
    useTransferMembershipHook: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));


describe('TransferOwnership Component', () => {
    const mockMembers = [
        { user: { id: 1, full_name: 'John Doe', email: 'john@example.com' }, role: 'Owner' },
        { user: { id: 2, full_name: 'Jane Smith', email: 'jane@example.com' }, role: 'Member' }
    ];

    const mockSession = [
        { user: { pk: 1, full_name: 'John Doe', email: 'john@example.com'}},
        { user: { pk: 2, full_name: 'Jane Smith', email: 'jane@example.com'}}
    ];

    const mockSetMemberships = jest.fn();

    beforeEach(() => {
        useTransferMembershipHook.mockReturnValue({
            response: null,
            status: null,
            error: null
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (sessionOverride, membersOverride = mockMembers) => {

        const sessionValue = sessionOverride ?? [null, "unauthenticated"];
        render(
            <SessionProvider session={sessionValue[0]}>
                <PodcastContext.Provider value={{ selectedPodcastOrg: { slug: 'test-slug' } }}>
                    <TransferOwnership members={membersOverride} setMemberships={mockSetMemberships} />
                </PodcastContext.Provider>
            </SessionProvider>
        );
    }

    it('renders the component with initial state', () => {
        renderComponent([mockSession[1], "authenticated"]);
        expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent("Transfer Ownership");
        expect(screen.getByRole('button', { name: /Transfer Ownership/i })).toBeDisabled();
    });

    it('should enable transfer button when current user is owner and members exist', () => {
        renderComponent([mockSession[0], "authenticated"])
        waitFor(() => {
            expect(screen.getByRole('button', { name: /Transfer Ownership/i })).toBeEnabled();
        })
    });

    it('opens dialog on clicking transfer button when enabled', async () => {
        renderComponent([mockSession[0], "authenticated"])

        waitFor(() => {
            expect(screen.getByRole('button', { name: /Transfer Ownership/i })).toBeEnabled();
        })

        fireEvent.click(screen.getByRole('button', { name: /Transfer Ownership/i }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeVisible();
            expect(screen.getByRole('heading', { name: "Transfer Ownership", level: 2 })).toBeVisible();
        })
    });

    it('submits the form and calls the appropriate hook', async () => {
        renderComponent([mockSession[0], "authenticated"])

        fireEvent.click(screen.getByRole('button', { name: /Transfer Ownership/i }));
        const checkbox = await screen.findAllByRole('checkbox');
        fireEvent.change(checkbox[1], { target: { checked: true } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(useTransferMembershipHook).toHaveBeenCalled()
        });
    });

    it('displays toast messages for successful responses', async () => {
        useTransferMembershipHook.mockReturnValue({
            status: 200,
            error: null
        });
        renderComponent([mockSession[0], "authenticated"])
        debug();
        // Im not entirely sure whats going on in this test? The dialog should need to be opened.
        // fireEvent.click(screen.getByRole('button', { name: /Transfer Ownership/i }));
        const checkbox = await screen.findAllByRole('checkbox');
        fireEvent.change(checkbox[1], { target: { checked: true } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(`A confirmation email has been sent, please check your inbox.`);
        });
    })

    it('should display toast for error response with object data', async () => {
        useTransferMembershipHook.mockReturnValueOnce({
            response: null,
            status: 400,
            error: { response: { data: { email: ["Error occurred"] } } }
        });

        renderComponent([mockSession[0], "authenticated"])

        fireEvent.click(screen.getByRole('button', { name: /Transfer Ownership/i }));
        const checkbox = await screen.findAllByRole('checkbox');
        fireEvent.change(checkbox[1], { target: { checked: true } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error occurred");
        });
    });

    it('should display toast for error response with string data', async () => {
        useTransferMembershipHook.mockReturnValueOnce({
            response: null,
            status: 400,
            error: { response: { data: "Error occurred" } }
        });
        renderComponent([mockSession[0], "authenticated"])


        fireEvent.click(screen.getByRole('button', { name: /Transfer Ownership/i }));
        const checkbox = await screen.findAllByRole('checkbox');
        fireEvent.change(checkbox[1], { target: { checked: true } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it('should display toast for unexpected error', async () => {
        useTransferMembershipHook.mockReturnValueOnce({
            response: null,
            status: 400,
            error: { response: { data: 123 } }
        });
        renderComponent([mockSession[0], "authenticated"])

        fireEvent.click(screen.getByRole('button', { name: /Transfer Ownership/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Transfer/i })).toBeVisible();
        })
        const checkbox = await screen.findAllByRole('checkbox');
        fireEvent.change(checkbox[1], { target: { checked: true } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));


        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred.");
        });
    });

    it('should disable transfer button if no other members exist', async () => {
        const mockMembers = [
            { user: { id: 1, full_name: 'John Doe', email: 'john@example.com' }, role: 'Owner' },
        ];
        renderComponent([mockSession[0], "authenticated"], mockMembers);
        expect(screen.getByRole('button', { name: /Transfer Ownership/i })).toBeDisabled();
    })

    it('should display correct message if no other members exist', async () => {
        const mockMembers = [
            { user: { id: 1, full_name: 'John Doe', email: 'john@example.com' }, role: 'Owner' },
        ];
        renderComponent([mockSession[0], "authenticated"], mockMembers);
        expect(screen.getByRole('button', { name: /Transfer Ownership/i })).toBeDisabled();
    })
});
