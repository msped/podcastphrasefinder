import { renderHook, waitFor } from '@testing-library/react';
import { useGetEpisodeReleaseDaysHook } from '@/hooks/podcastHooks';
import { getEpisodeReleaseDaysService } from '@/api/podcastServices';

jest.mock('../../api/podcastServices', () => ({
    getEpisodeReleaseDaysService: jest.fn(),
}));

describe('podcastHooks', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('useGetEpisodeReleaseDaysHook', () => {
        it('should return initial state correctly', () => {
            const { result } = renderHook(() => useGetEpisodeReleaseDaysHook(null));

            expect(result.current.releaseDays).toEqual([]);
            expect(result.current.isLoading).toBe(true);
            expect(getEpisodeReleaseDaysService).not.toHaveBeenCalled();
        });

        it('should not fetch release days if podcastSlug is not provided', () => {
            renderHook(() => useGetEpisodeReleaseDaysHook(null));
            expect(getEpisodeReleaseDaysService).not.toHaveBeenCalled();
        });

        it('should fetch release days and update state when podcastSlug is provided', async () => {
            const mockPodcastSlug = 'another-podcast';
            const mockReleaseDaysData = [{ day: 'Monday' }, { day: 'Wednesday' }];
            getEpisodeReleaseDaysService.mockResolvedValue(mockReleaseDaysData);

            const { result } = renderHook(() => useGetEpisodeReleaseDaysHook(mockPodcastSlug));

            expect(result.current.isLoading).toBe(true);
            expect(getEpisodeReleaseDaysService).toHaveBeenCalledWith(mockPodcastSlug);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.releaseDays).toEqual(mockReleaseDaysData);
        });

        it('should handle API errors gracefully for getEpisodeReleaseDaysService', async () => {
            const mockPodcastSlug = 'test-podcast-error-days';
            const errorMessage = 'API Failure';
            getEpisodeReleaseDaysService.mockRejectedValue(new Error(errorMessage));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useGetEpisodeReleaseDaysHook(mockPodcastSlug));

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.releaseDays).toEqual([]);
            consoleErrorSpy.mockRestore();
        });
    });
});