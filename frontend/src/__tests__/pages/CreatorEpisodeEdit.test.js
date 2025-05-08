import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Edit from '@/pages/creator/dashboard/episodes/[id]/edit';
import { useGetEpisodeHook } from '@/hooks/episodeHooks';
import '@testing-library/jest-dom';

jest.mock('../../pages/creator/_forms/EditEpisodeForm', () => () => <div>EditEpisodeForm Component</div>);
jest.mock('../../components/PodcastSwitcher', () => () => <div data-testid="podcast-switcher" />);


jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));
jest.mock('../../hooks/episodeHooks', () => ({
    useGetEpisodeHook: jest.fn(),
}));

describe('Edit Page', () => {
    const mockEpisode = {
        episode: {
            id: '1',
            title: 'Test Episode',
            published_date: '2023-10-12T00:00:00Z',
            exclusive: false,
            private_video: true,
            is_draft: true,
        },
        transcript: 'Test transcript'
    };

    beforeEach(() => {
        // Reset mocks before each test
        useRouter.mockReturnValue({
            isReady: true,
            query: { id: '1' },
        });
        useGetEpisodeHook.mockReturnValue({
            episode: null,
            isLoading: true,
            setEpisodeId: jest.fn(),
            setEpisode: jest.fn(),
        });
    });

    it('renders loading state initially', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Edit />
            </LocalizationProvider>
        );

        waitFor(() => {
            expect(screen.getByTestId('loading-spinner')).toBeVisible(); 
        })
    });

    it('fetches episode data when id is available', () => {
        const mockSetEpisodeId = jest.fn();
        useGetEpisodeHook.mockReturnValue({
            episode: null,
            isLoading: true,
            setEpisodeId: mockSetEpisodeId,
            setEpisode: jest.fn(),
        });

        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Edit />
            </LocalizationProvider>
        );

        expect(mockSetEpisodeId).toHaveBeenCalledWith('1');
    });

    it('render form when state loaded', () => {
        useGetEpisodeHook.mockReturnValue({
            episode: mockEpisode,
            isLoading: false,
            setEpisodeId: jest.fn(),
            setEpisode: jest.fn(),
        });

        render(
            <LocalizationProvider adapterLocale={AdapterDateFns}>
                <Edit />
            </LocalizationProvider>
        )
        expect(screen.getByText("EditEpisodeForm Component")).toBeVisible();
    })
});
