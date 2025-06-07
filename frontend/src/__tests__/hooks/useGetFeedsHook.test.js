import { renderHook, waitFor } from '@testing-library/react';
import { useGetFeedsHook } from '@/hooks/podcastHooks';
import { getFeedsService } from '@/api/podcastServices';

jest.mock('../../api/podcastServices', () => ({
    getFeedsService: jest.fn(),
}));

describe('podcastHooks', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('useGetFeedsHook', () => {
        it('should return initial state correctly', () => {
            const { result } = renderHook(() => useGetFeedsHook(null));

            expect(result.current.feeds).toEqual([]);
            expect(result.current.isLoading).toBe(true);
            expect(getFeedsService).not.toHaveBeenCalled();
        });

        it('should not fetch feeds if podcastSlug is not provided', () => {
            renderHook(() => useGetFeedsHook(null));
            expect(getFeedsService).not.toHaveBeenCalled();
        });

        it('should fetch feeds and update state when podcastSlug is provided', async () => {
            const mockPodcastSlug = 'test-podcast';
            const mockFeedsData = [{ id: 1, url: 'http://example.com/feed1.xml' }];
            getFeedsService.mockResolvedValue(mockFeedsData);

            const { result } = renderHook(() => useGetFeedsHook(mockPodcastSlug));

            expect(result.current.isLoading).toBe(true);
            expect(getFeedsService).toHaveBeenCalledWith(mockPodcastSlug);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.feeds).toEqual(mockFeedsData);
        });

        it('should handle API errors gracefully for getFeedsService', async () => {
            const mockPodcastSlug = 'test-podcast-error';
            const errorMessage = 'Network Error';
            getFeedsService.mockRejectedValue(new Error(errorMessage));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useGetFeedsHook(mockPodcastSlug));

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.feeds).toEqual([]);
            consoleErrorSpy.mockRestore();
        });
    });
});