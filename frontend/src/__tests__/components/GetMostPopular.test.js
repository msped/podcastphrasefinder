// Import the necessary modules for testing
import React from 'react';
import * as nextRouter from 'next/router'
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import GetMostPopular from '@/components/GetMostPopular';

nextRouter.useRouter = jest.fn()
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))

describe('GetMostPopular', () => {
    it('renders the most popular podcast when not loading', () => {
        jest.mock('../../hooks/useGetMostPopularHook', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                episode: {
                    id: 1,
                    title: 'Episode 1',
                    video_id: 'AZLU_4G8CY0',
                    channel: {
                        name: 'Dead Men Talking',
                        channel_id: 'UCuV8fchmNqEljq3wcTCjxeA'
                    },
                },
                isLoading: false,
            })),
        }));

        render(<GetMostPopular />);
        
        // Assert that the text appears on the screen
        waitFor(() => expect(screen.getByText('The most popular podcast on PodcastPhraseFinder')).toBeInTheDocument());

        // Assert that EpisodePanel component is rendered
        waitFor(() => expect(screen.getByText('Episode 1')).toBeInTheDocument());
        waitFor(() => expect(screen.getByText('Dead Men Talking')).toBeInTheDocument());
    });

    it('renders the skeleton when loading', () => {
        jest.clearAllMocks();
        jest.mock('../../hooks/useGetMostPopularHook', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                episode: {},
                isLoading: true,
            })),
        }));

        render(<GetMostPopular />);

        // Assert that EpisodePanelSkeleton component is rendered
        expect(screen.queryByText('Episode 1')).toBeNull();
    });
});
