import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import Add from '@/pages/creator/dashboard/episodes/add'; 

jest.mock('../../pages/creator/_forms/AddEpisodeFromYouTubeForm', () => () => <div>AddEpisodeFromYouTubeForm Component</div>);

describe('Add Component Tests', () => {
    test('renders Add an Episode header', () => {
        render(<Add />);
        const headerElement = screen.getByRole('heading', {
            name: /add an episode/i,
        });
        expect(headerElement).toBeInTheDocument();
    });

    test('renders TabPanel with correct tab selected', () => {
        render(<Add />);
        expect(screen.getByText("AddEpisodeFromYouTubeForm Component")).toBeVisible();

        const youtubeTabButton = screen.getByRole('tab', {
            name: /youtube/i,
        });
        expect(youtubeTabButton).toHaveAttribute('aria-selected', 'true');
    });

    test('handles tab change correctly', () => {
        render(<Add />);
        
        const transcriptTabButton = screen.getByRole('tab', {
            name: /get a transcript/i,
        });

        fireEvent.click(transcriptTabButton);
        expect(transcriptTabButton).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByText("AddEpisodeFromYouTubeForm Component")).toBeVisible();
    });
});
