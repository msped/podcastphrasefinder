import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TransferPodcastOwnershipConfirmationPage from '@/pages/creator/podcast/[slug]/confirm/transfer/[token]/index';
import { useGetConfirmTransferPodcastOwnershipHook } from '@/pages/creator/_hooks/membershipHooks';
import mockRouter from 'next-router-mock';
import { toast } from 'react-hot-toast';
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('../../pages/creator/_hooks/membershipHooks', () => ({
    useGetConfirmTransferPodcastOwnershipHook: jest.fn()
}));
jest.mock('react-hot-toast');
jest.mock('../../pages/creator/_components/withDashboardLayout', () => (Component) => Component);
jest.mock('../../components/PodcastSwitcher')

describe('TransferPodcastOwnershipConfirmationPage', () => {
    const setSlugMock = jest.fn();
    const setTokenMock = jest.fn();
    const pushMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockRouter.push(
            '/creator/podcast/test-podcast/confirm/transfer/test-token',
            { shallow: false }
        );
        mockRouter.query = { slug: 'test-podcast', token: 'test-token' };
        mockRouter.isReady = true;
        useGetConfirmTransferPodcastOwnershipHook.mockReturnValue({
            status: null,
            error: null,
            isLoading: false,
            setSlug: setSlugMock,
            setToken: setTokenMock
        });

        mockRouter.push = pushMock;
    });

    it('should call setSlug and setToken with query params', async () => {

        render(<TransferPodcastOwnershipConfirmationPage />);

        await waitFor(() => {
            expect(setSlugMock).toHaveBeenCalledWith('test-podcast');
            expect(setTokenMock).toHaveBeenCalledWith('test-token');
        });
    });

    it('should show loading spinner when isLoading is true', () => {
        useGetConfirmTransferPodcastOwnershipHook.mockReturnValueOnce({
            isLoading: true,
            status: null,
            error: null,
            setSlug: jest.fn(),
            setToken: jest.fn()
        });

        render(<TransferPodcastOwnershipConfirmationPage />);

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should handle successful deletion', async () => {

        useGetConfirmTransferPodcastOwnershipHook.mockReturnValueOnce({
            status: 200,
            isLoading: false,
            error: null,
            setSlug: jest.fn(),
            setToken: jest.fn()
        });

        render(<TransferPodcastOwnershipConfirmationPage />);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Podcast has been successfully transferred.');
            expect(pushMock).toHaveBeenCalledWith('/creator/podcast/settings');
        });
    });

    it('should handle bad request error (400)', async () => {
        useGetConfirmTransferPodcastOwnershipHook.mockReturnValueOnce({
            status: 400,
            isLoading: false,
            error: { error: 'Invalid request'},
            setSlug: jest.fn(),
            setToken: jest.fn()
        });

        render(<TransferPodcastOwnershipConfirmationPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid request');
            expect(pushMock).toHaveBeenCalledWith('/creator/podcast/settings');
        });
    });

    it('should handle not found error (404)', async () => {
        useGetConfirmTransferPodcastOwnershipHook.mockReturnValueOnce({
            status: 404,
            isLoading: false,
            error: null,
            setSlug: jest.fn(),
            setToken: jest.fn()
        });

        render(<TransferPodcastOwnershipConfirmationPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Podcast does not exist.');
            expect(pushMock).toHaveBeenCalledWith('/creator/podcast/settings');
        });
    });
});
