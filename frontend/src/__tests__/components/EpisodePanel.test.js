import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { formatDistance } from 'date-fns';
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
            "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            "no_of_episodes": 1
        },
        'published_date': '2023-08-25T20:55:33Z',
        "thumbnail": "https://test.url.mspe.me/eeTEdlsa",
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

    it("checks that the correct length of time is displayed", () => {
        render(<EpisodePanel episode={episode} />)
        const published_date = new Date(episode.published_date);
        const current_date_time = new Date();

        const component = screen.getByTestId('time-since-test-id')

        expect(component).toHaveTextContent(formatDistance(published_date, current_date_time));
    })

    it('renders the correct thumbnail', () => {
        render(<EpisodePanel episode={episode} />)
    
        const thumbnail = screen.getByAltText("Suella's speeding, Japan in focus, and what's the point of the G7? thumbnail")
    
        expect(thumbnail).toBeInTheDocument()
        expect(thumbnail.src).toEqual(episode.thumbnail)
    })
});
