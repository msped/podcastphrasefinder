import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RandomEpisodeGenerator from '@/components/RandomEpisodeGenerator';
import useGetRandomEpisodeHook from '@/hooks/useGetRandomEpisodeHook';

jest.mock('../../hooks/useGetRandomEpisodeHook', () => ({
    __esModule: true, 
    default: jest.fn()
}));

describe('RandomEpisodeGenerator', () => {
    const mockEpisode = {
        id: 1,
        title: 'Test Episode Title',
    };

    beforeEach(() => {
        useGetRandomEpisodeHook.mockReturnValue({
            episode: null,
            isLoading: false,
            fetchRandomEpisode: jest.fn(),
        });
    });

    it('renders "Random Episode" button initially', () => {
        render(<RandomEpisodeGenerator slug="test-slug" />);
        const buttonElement = screen.getByRole('button', { name: /Random Episode/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('calls fetchRandomEpisode when button is clicked', () => {
        const fetchRandomEpisodeMock = jest.fn();
        useGetRandomEpisodeHook.mockReturnValue({
            episode: null,
            isLoading: false,
            fetchRandomEpisode: fetchRandomEpisodeMock,
        });

        render(<RandomEpisodeGenerator slug="test-slug" />);
        const buttonElement = screen.getByRole('button', { name: /Random Episode/i });
        fireEvent.click(buttonElement);

        expect(fetchRandomEpisodeMock).toHaveBeenCalledTimes(1);
    });

    it('displays loading indicator while fetching episode', () => {
        useGetRandomEpisodeHook.mockReturnValue({
            episode: null,
            isLoading: true,
            fetchRandomEpisode: jest.fn(),
        });

        render(<RandomEpisodeGenerator slug="test-slug" />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays episode title after fetching', () => {
        useGetRandomEpisodeHook.mockReturnValue({
            episode: mockEpisode,
            isLoading: false,
            fetchRandomEpisode: jest.fn(),
        });

        render(<RandomEpisodeGenerator slug="test-slug" />);
        expect(screen.getByText(mockEpisode.title)).toBeInTheDocument();
    });

    it('changes button text to "Try again" after fetching episode', () => {
        useGetRandomEpisodeHook.mockReturnValue({
            episode: mockEpisode,
            isLoading: false,
            fetchRandomEpisode: jest.fn(),
        });

        render(<RandomEpisodeGenerator slug="test-slug" />);
        expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
    });
});
