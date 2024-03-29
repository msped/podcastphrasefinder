import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import PodcastsSearchResults from '@/components/PodcastsSearchResults';

describe('PodcastsSearchResults', () => {
    it('renders the podcast search results', () => {
        jest.mock('../../hooks/useGetPodcastsSearchHook', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                results: [
                    {
                        id: 1,
                        name: 'Test Podcast 1',
                        channel_id: 'abtT4429vjlsdm'
                    },
                    {
                        id: 2,
                        name: 'Test Podcast 2',
                        channel_id: 'DFvfneifvn3058'
                    }
                ],
                isLoading: false
            }))
        }));
        render(<PodcastsSearchResults query="test" />);
        const podcastNames = screen.findAllByText(/Test Podcast/i);
        waitFor(() => expect(podcastNames.length).toEqual(2));
    });

    it('displays a loading spinner while fetching data', () => {
        jest.mock('../../hooks/useGetPodcastsSearchHook', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                results: [],
                isLoading: true
            }))
        }));
        render(<PodcastsSearchResults query="test" />);

        const loadingSpinner = screen.findByRole('progressbar');
        waitFor(() => expect(loadingSpinner).toBeInTheDocument());
    });

    it('displays a message when there are no search results', async () => {
        jest.mock('../../hooks/useGetPodcastsSearchHook', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                results: [],
                isLoading: false
            }))
        }));
        render(<PodcastsSearchResults query="invalid-query" />);

        const noResultsMessage = await screen.findByText('No results');
        expect(noResultsMessage).toBeInTheDocument();
    });

    it('displays a message when the search query is too short', async () => {
        jest.mock('../../hooks/useGetPodcastsSearchHook', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                results: [],
                isLoading: true
            }))
        }));
        render(<PodcastsSearchResults query="a" />);

        const searchMessage = await screen.findByText(/Search to see if we have your favourite podcasts!/i);
        expect(searchMessage).toBeInTheDocument();
    });
});
