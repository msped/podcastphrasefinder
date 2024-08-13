import { render, screen, act } from '@testing-library/react';
import { SessionProvider } from "next-auth/react";
import "@testing-library/jest-dom"
import { PodcastProvider, PodcastContext } from '@/context/PodcastContext';
import getCreatorEpisodeService from '@/pages/creator/_api/getCreatorEpisodeService';
import useGetCreatorEpisodesHook from '@/pages/creator/_hooks/useGetCreatorEpisodesHook';
import apiClient from '@/api/apiClient';

jest.mock('../../pages/creator/_api/getCreatorEpisodeService');
jest.mock('../../api/apiClient');

describe('useGetCreatorEpisodesHook', () => {
    let Wrapper;

    beforeEach(() => {
        jest.clearAllMocks();
        Wrapper = ({ children, selectedPodcastOrg, mockSession }) => {
            return (
                <SessionProvider session={mockSession}>
                    <PodcastProvider selectedPodcastOrg={selectedPodcastOrg}>
                        {children}
                    </PodcastProvider>
                </SessionProvider>
            );
        };
    });

    it('should fetch episodes when selectedPodcastOrg is available', async () => {
        const mockPodcastOrg = 'test-org';
        const mockEpisodes = [{ id: 1, title: 'Test Episode' }];
        const mockSession = { data: { user: { id: 1 } } };
        getCreatorEpisodeService.mockResolvedValueOnce(mockEpisodes);

        render(
        <Wrapper selectedPodcastOrg={mockPodcastOrg} mockSession={mockSession}>
            <div data-testid="test-container" />
        </Wrapper>
        );
        
        const result = await getCreatorEpisodeService();

        expect(getCreatorEpisodeService).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockEpisodes);
    });

    it('should not fetch episodes when selectedPodcastOrg is null', async () => {
        const mockSession = { data: { user: { id: 1 } } };
        render(
        <Wrapper selectedPodcastOrg={null} mockSession={mockSession}>
            <div data-testid="test-container" />
        </Wrapper>
        );

        // Wait for the useEffect to complete
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(getCreatorEpisodeService).not.toHaveBeenCalled();
    });
});
