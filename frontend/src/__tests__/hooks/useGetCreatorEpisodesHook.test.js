import { renderHook, act } from '@testing-library/react';
import { useGetCreatorEpisodesHook } from '@/hooks/episodeHooks';
import { getCreatorEpisodeService } from '@/api/episodeServices';
import { PodcastContext } from '@/context/PodcastContext';

jest.mock('../../api/episodeServices', () => ({
    getCreatorEpisodeService: jest.fn(),
}));

describe('useGetCreatorEpisodesHook', () => {
    const mockEpisodes = [{ id: 1, title: 'Test Episode' }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch episodes when selectedPodcastOrg is available', async () => {
        const mockPodcastOrg = { slug: 'test-org' };
        getCreatorEpisodeService.mockResolvedValueOnce(mockEpisodes);

        const wrapper = ({ children }) => (
            <PodcastContext.Provider value={{ selectedPodcastOrg: mockPodcastOrg }}>
                {children}
            </PodcastContext.Provider>
        );

        const { result } = renderHook(() => useGetCreatorEpisodesHook(), { wrapper });

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); 
        });

        expect(getCreatorEpisodeService).toHaveBeenCalledWith(mockPodcastOrg.slug);
        expect(result.current.results).toEqual(mockEpisodes);
        expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch episodes when selectedPodcastOrg is null', async () => {
        const wrapper = ({ children }) => (
            <PodcastContext.Provider value={{ selectedPodcastOrg: null }}>
                {children}
            </PodcastContext.Provider>
        );

        const { result } = renderHook(() => useGetCreatorEpisodesHook(), { wrapper });

        expect(result.current.isLoading).toBe(false);
        expect(getCreatorEpisodeService).not.toHaveBeenCalled();
    });
});
