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
            "avatar": "https://yt3.ggpht.com/sROZx5jI62ZX-7Udpthim3reUrYnjGwBrzoJ_JuvKjLcxnHuceC1IHLWIfoykgi28rmW_EIV=s800-c-k-c0x00ffffff-no-rj"
        },
        'published_date': '2023-08-25T20:55:33Z',
        "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
        "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        "times_clicked": 11,
        "highlight": [
            'test1',
            'test2',
            'test3',
            'test4',
            'test5',
        ]
    };

    const episodeNoHighlight = {
        "id": 2,
        "video_id": "b-UYEj6Q0Ao",
        "channel": {
            "id": 2,
            "name": "The Rest Is Politics",
            "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            "avatar": "https://yt3.ggpht.com/sROZx5jI62ZX-7Udpthim3reUrYnjGwBrzoJ_JuvKjLcxnHuceC1IHLWIfoykgi28rmW_EIV=s800-c-k-c0x00ffffff-no-rj"
        },
        'published_date': '2023-08-25T20:55:33Z',
        "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
        "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        "times_clicked": 11,
        "highlight": null
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
        const youtubeURL = `https://www.youtube.com/watch?v=${episode.video_id}`
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

    it('renders the avatar', () => {
        render(<EpisodePanel episode={episode} />)
    
        const avatar = screen.getByAltText("The Rest Is Politics logo")
    
        expect(avatar).toBeInTheDocument()
    })

    it('YouTube channel link is rendered', () => {
        render(<EpisodePanel episode={episode} />)
        const channelLink = screen.getByText('The Rest Is Politics');
        expect(channelLink.href).toEqual(`https://www.youtube.com/channel/${episode.channel.channel_id}`)
    })

    // test highlight not open (should be unmounted i.e. not in the doc)
    it('Render episode panel with highlight accordion collasped', () => {
        render(<EpisodePanel episode={episode} />)
        const highlightDropdownText = screen.queryByText('test1');
        expect(highlightDropdownText).not.toBeInTheDocument();
    })

    // test highlight open and see 1
    it('Test opening highlight show first item in the array', () => {
        render(<EpisodePanel episode={episode} />)
        const accordionToggleButton = screen.getByText('See transcript matches');
        fireEvent.click(accordionToggleButton);
        const getFirstMatch = screen.queryByText('test1');
        expect(getFirstMatch).toBeInTheDocument();
    })

    // test highlight open and cycle
    it('Open highlight and cycle through the matches', () => {
        render(<EpisodePanel episode={episode} />)
        const accordionToggleButton = screen.getByText('See transcript matches');
        fireEvent.click(accordionToggleButton);
        const nextMatchButton = screen.getByLabelText('next match')
        for(let i = 0; i < episode.highlight.length; i++){
            if (i !== 0){
                fireEvent.click(nextMatchButton);
            }
            expect(screen.queryByText(episode.highlight[i])).toBeInTheDocument();
        }
    })

    // test highlight not showing when null
    it('Test not highlight shows with no highlight', () => {
        render(<EpisodePanel episode={episodeNoHighlight} />)
        const highlightDropdownText = screen.queryByText('See transcript matches');
        expect(highlightDropdownText).not.toBeInTheDocument();
    })
});
