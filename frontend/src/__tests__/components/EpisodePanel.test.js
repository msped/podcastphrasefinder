import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import * as nextRouter from 'next/router'
import EpisodePanel from '@/components/EpisodePanel';
import postEpisodeIncrementService from '@/api/postEpisodeIncrementService';

nextRouter.useRouter = jest.fn()
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))

jest.mock("../../api/postEpisodeIncrementService");

describe('EpisodePanel', () => {
    const episode = {
        "id": 1,
        "video_id": "b-UYSj6Q0Ao",
        "channel": {
            "id": 2,
            "name": "The Rest Is Politics",
            "channel_link": "https://www.youtube.com/@restispolitics",
            "no_of_episodes": 1
        },
        "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
        "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        "times_clicked": 11
    };

    beforeEach(() => {
        postEpisodeIncrementService.mockReset()
    })

    it('renders the episode link', () => {
        render(<EpisodePanel episode={episode} />);
        const episodeName = screen.getByText(
            /Suella's speeding, Japan in focus, and what's the point of the G7?/i
        );
        expect(episodeName).toBeInTheDocument();
    });

    it('has a button link to episode on YouTube', () => {
        render(<EpisodePanel episode={episode} />);
        const youtubeURL = `http://www.youtube.com/watch?v=${episode.video_id}`
        const episodeListenButton = screen.getByLabelText(
            /listen to podcast/i);
        expect(episodeListenButton).toHaveAttribute('href', youtubeURL);
    });

    it('shows the podcast channel in the panel', () => {
        render(<EpisodePanel episode={episode} />);
        const channelName = screen.getByText(/The Rest Is Politics/i);
        expect(channelName).toBeInTheDocument();
    });

    it("calls postEpisodeIncrementService with correct episode ID on time click", async () => {
        render(<EpisodePanel episode={episode} />);
    
        const timeButton = screen.getByLabelText("listen to podcast");
        fireEvent.click(timeButton);
    
        expect(postEpisodeIncrementService).toHaveBeenCalledTimes(1);
        expect(postEpisodeIncrementService).toHaveBeenCalledWith(episode.id);
    });
});
