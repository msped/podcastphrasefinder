import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CreatePodcastForm from '../../pages/creator/_forms/CreatePodcastForm';
import { usePostPodcastFormHook } from '@/hooks/podcastHooks';
import mockRouter from 'next-router-mock';
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('../../hooks/podcastHooks', () => ({
    usePostPodcastFormHook: jest.fn(),
}));

describe('CreatePodcastForm', () => {
    jest.useFakeTimers();
    window.URL.createObjectURL = jest.fn();

    beforeEach(() => {
        usePostPodcastFormHook.mockReturnValue({
            response: null,
            status: null,
            isLoading: false,
            error: null,
        });

        mockRouter.push('/')

        window.URL.createObjectURL.mockReturnValue('www.localhost.com/api/media/test.jpg');
    });

    it('renders the form correctly', () => {
        render(<CreatePodcastForm />);
        expect(screen.getByLabelText('Podcast Name')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        const mockFormData = new FormData();
        mockFormData.append('name', 'Test Podcast');
        mockFormData.append('avatar', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));

        usePostPodcastFormHook.mockReturnValue({
            response: { slug: 'test-podcast' },
            status: 201,
            isLoading: true,
            error: null,
        });

        render(<CreatePodcastForm />);

        const input = screen.getByLabelText('Podcast Name');
        fireEvent.change(input, { target: { value: 'Test Podcast' } });

        const fileInput = screen.getByRole('button', { name: '' })
        fireEvent.change(fileInput, {
            target: {
                files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })],
            },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        act(() => jest.runAllTimers());

        await waitFor(() => {
            expect(mockRouter).toMatchObject({
                pathname: "/creator/dashboard/episodes",
            })
        });
    });

    it('handles form errors', async () => {
        usePostPodcastFormHook.mockReturnValue({
            response: null,
            status: 400,
            isLoading: false,
            error: {
                response: {
                    data: {
                        name: ['This field is required.'],
                    },
                },
            },
        });

        render(<CreatePodcastForm />);

        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await waitFor(() => {
            expect(screen.getByText('Create')).toBeEnabled();
        });
    });

    it('handles avatar upload and removal', async () => {
        render(<CreatePodcastForm />);

        const fileInput = screen.getByRole('button', { name: '' })
        const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        userEvent.upload(fileInput, mockFile);

        await waitFor(() => {
            const avatarImg = screen.getByAltText('Thumbnail');
            expect(avatarImg).toBeInTheDocument();
            expect(avatarImg.src).toContain('www.localhost.com/api/media/test.jpg');
        });

        const removeButton = screen.getByRole('button', { name: 'Remove' });
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
        });
    });
});

