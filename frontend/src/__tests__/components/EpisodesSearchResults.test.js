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
                    id: "1",
                    title: "Episode 1",
                    channel: {
                        name: "Channel A",
                        avatar: "https://www/example.com/"
                    },
                    published_date: '2023-08-25T20:55:33Z',
                    transcript: "Here we go, the first episode of this podcast"
                },
                {
                    id: "2",
                    title: "Episode 2",
                    channel: {
                        name: "Channel B",
                        avatar: "https://www/example.com/"
                    },
                    published_date: '2023-08-25T20:55:33Z',
                    transcript: "Welcome to the rest is politics with me, Rory Stewart"
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
