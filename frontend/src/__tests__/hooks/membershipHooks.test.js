import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {
    useGetMembershipsHook,
    usePostMembershipHook,
    usePatchMembershipHook,
    useDeleteMembershipHook
} from '@/pages/creator/_hooks/membershipHooks'; 


jest.mock('../../pages/creator/_api/membershipServices', () => ({
    getMembershipsService: jest.fn(),
    patchMembershipsService: jest.fn(),
    postMembershipsService: jest.fn(),
    deleteMembershipsService: jest.fn(),
}));

describe('Membership Hooks', () => {
    const { 
        getMembershipsService, 
        patchMembershipsService, 
        postMembershipsService, 
        deleteMembershipsService 
    } = require('../../pages/creator/_api/membershipServices');

    afterEach(() => {
        jest.clearAllMocks();
    });

    const TestComponent = ({ hook, args = [] }) => {
        const hookResult = hook(...args);
        return <div data-testid="hook-result">{JSON.stringify(hookResult)}</div>;
    };

    describe('useGetMembershipsHook', () => {
        it('should fetch memberships on mount', async () => {
            const mockData = [{ id: 1, name: 'Gold' }];
            getMembershipsService.mockResolvedValueOnce(mockData);

            const { getByTestId } = render(<TestComponent hook={useGetMembershipsHook} />);

            await waitFor(() => {
                expect(
                    getByTestId('hook-result').textContent
                ).toContain(JSON.stringify({ 
                    memberships: mockData,
                    isLoading: false
                }));
            });
        });
    });

    describe('usePostMembershipHook', () => {
        it('should post membership data', async () => {
            const formData = { name: 'Platinum' };
            const mockResponse = { data: { id: 2, name: 'Platinum' }, status: 201 };
            postMembershipsService.mockResolvedValueOnce(mockResponse);

            const { getByTestId } = render(<TestComponent hook={usePostMembershipHook} args={[formData]} />);

            await waitFor(() => {
                expect(getByTestId('hook-result').textContent).toContain(JSON.stringify({ response: mockResponse.data, status: mockResponse.status, error: null }));
            });
        });

        it('should handle post error', async () => {
            const formData = { name: 'Silver' };
            const mockError = new Error('Network error');
            postMembershipsService.mockRejectedValueOnce({ response: { data: mockError } });

            const { getByTestId } = render(<TestComponent hook={usePostMembershipHook} args={[formData]} />);

            await waitFor(() => {
                expect(getByTestId('hook-result').textContent).toContain(JSON.stringify({ response: [], status: null, error: mockError }));
            });
        });
    });

    describe('usePatchMembershipHook', () => {
        it('should patch membership data', async () => {
            const formData = { id: 3, name: 'Diamond' };
            const mockResponse = { data: { id: 3, name: 'Diamond Updated' }, status: 200 };
            patchMembershipsService.mockResolvedValueOnce(mockResponse);

            const { getByTestId } = render(<TestComponent hook={usePatchMembershipHook} args={[formData]} />);

            await waitFor(() => {
                expect(getByTestId('hook-result').textContent).toContain(JSON.stringify({ response: mockResponse.data, status: mockResponse.status, error: null }));
            });
        });

        it('should handle patch error', async () => {
            const formData = { id: 4 };
            const mockError = new Error('Server error');
            patchMembershipsService.mockRejectedValueOnce(mockError);

            const { getByTestId } = render(<TestComponent hook={usePatchMembershipHook} args={[formData]} />);

            await waitFor(() => {
                expect(getByTestId('hook-result').textContent).toContain(JSON.stringify({ response: [], status: null, error: mockError }));
            });
        });
    });

    describe('useDeleteMembershipHook', () => {
        it('should delete membership successfully', async () => {
            const memberId = 5;
            const mockResponse = { status: 204 };
            deleteMembershipsService.mockResolvedValueOnce(mockResponse);

            const { getByTestId } = render(<TestComponent hook={useDeleteMembershipHook} args={[memberId]} />);

            await waitFor(() => {
                expect(getByTestId('hook-result').textContent).toContain(JSON.stringify({ status: mockResponse.status, error: null }));
            });
        });

        it('should handle delete error', async () => {
            const memberId = 6;
            const mockError = new Error('Not Found');
            deleteMembershipsService.mockRejectedValueOnce({ response: { data: mockError } });

            const { getByTestId } = render(<TestComponent hook={useDeleteMembershipHook} args={[memberId]} />);

            await waitFor(() => {
                expect(getByTestId('hook-result').textContent).toContain(JSON.stringify({ status: null, error: mockError }));
            });
        });
    });
});
