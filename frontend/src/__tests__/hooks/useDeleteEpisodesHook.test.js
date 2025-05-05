import { renderHook, act } from '@testing-library/react';
import { useDeleteEpisodesHook } from '@/hooks/episodeHooks';
import { deleteEpisodesService } from '@/api/episodeServices';

jest.mock('../../api/episodeServices', () => ({
    deleteEpisodesService: jest.fn(),
}));

describe('useDeleteEpisodesHook', () => {
    it('should initialize with null statusResponse and isLoading false', () => {
        const { result } = renderHook(() => useDeleteEpisodesHook());
        expect(result.current.statusResponse).toBe(null);
        expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to true while deleting episodes', async () => {
        deleteEpisodesService.mockResolvedValue({});
        const { result } = renderHook(() => useDeleteEpisodesHook());
        
        act(() => {
            result.current.deleteEpisodes(123);
        });
        
        expect(result.current.isLoading).toBe(true);
    });

    it('should call deleteEpisodesService with the correct episodeId', async () => {
        deleteEpisodesService.mockResolvedValue({});
        const { result } = renderHook(() => useDeleteEpisodesHook());
        
        await act(async () => {
            await result.current.deleteEpisodes(456);
        });
        
        expect(deleteEpisodesService).toHaveBeenCalledWith(456);
    });

    it('should set statusResponse on successful deletion', async () => {
        const mockResponse = { status: 200 };
        deleteEpisodesService.mockResolvedValue(mockResponse);
        const { result } = renderHook(() => useDeleteEpisodesHook());
        
        await act(async () => {
            await result.current.deleteEpisodes(789);
        });
        expect(result.current.statusResponse).toBe(mockResponse);
    });
});