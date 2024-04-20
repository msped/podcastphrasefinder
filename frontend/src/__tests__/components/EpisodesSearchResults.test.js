import { render, screen } from "@testing-library/react";
import * as nextRouter from 'next/router'
import "@testing-library/jest-dom"
import EpisodesSearchResults from "@/components/EpisodesSearchResults";
import useGetEpisodesSearchHook from "@/hooks/useGetEpisodesSearchHook";

jest.mock("../..//hooks/useGetEpisodesSearchHook", () => jest.fn());

nextRouter.useRouter = jest.fn()
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))

describe("EpisodesSearchResults", () => {
    it("renders loading spinner when loading episodes", async () => {
        useGetEpisodesSearchHook.mockImplementation(() => ({
            results: [],
            isLoading: true,
        }))
        render(<EpisodesSearchResults query="test" />);

        const spinner = screen.getByTestId("loading-spinner");
        expect(spinner).toBeInTheDocument();
    });

    it("renders message when search query less than 3 characters long", async () => {
        useGetEpisodesSearchHook.mockImplementation(() => ({
            results: [],
            isLoading: true,
        }))
        render(<EpisodesSearchResults query="te" />);

        const message = screen.getByText(
        /Type the phrase you heard above to find the episode you heard it from./i
        );
        expect(message).toBeInTheDocument();
    });

    it("renders 'no results' message when there are no search results", async () => {
        useGetEpisodesSearchHook.mockImplementation(() => ({
            results: [],
            isLoading: false,
        }))
        render(<EpisodesSearchResults query="foo" />);

        const message = screen.getByText(/No results/i);
        expect(message).toBeInTheDocument();
    });

    it("renders episode panels when there are search results", async () => {
        useGetEpisodesSearchHook.mockImplementation(() => ({
            results: [
                {
                    episode: {
                        id: "1",
                        title: "Episode 1",
                        channel: {
                            name: "Channel A",
                            slug: "channel-a",
                            avatar: "https://www/example.com/"
                        },
                        published_date: '2020-08-03T07:59:59+00:00',
                    },
                    transcript: "Here we go, the first test episode of this podcast",
                    highlight: null
                },
                {
                    episode: {
                        id: "2",
                        title: "Episode 2",
                        channel: {
                            name: "Channel B",
                            slug: "channel-b",
                            avatar: "https://www/example.com/"
                        },
                        published_date: '2023-12-05T07:59:59+00:00',
                    },
                    transcript: "test for the rest is politics with me, Rory Stewart",
                    highlight: null
                },
            ],
            isLoading: false,
        }))
        render(<EpisodesSearchResults query="test" />);

        const episode1 = screen.getByText(/Episode 1/i);
        const episode2 = screen.getByText(/Episode 2/i);
        expect(episode1).toBeInTheDocument();
        expect(episode2).toBeInTheDocument();
    });
});
