import { renderHook, waitFor } from '@testing-library/react';
import useGetMostPopularHook from '@/hooks/useGetMostPopularHook';
import getMostPopularService from '@/api/getMostPopularService';

jest.mock('../../api/getMostPopularService', () => jest.fn());

describe('useGetMostPopularHook', () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    it('returns episode data and loading state', () => {
        getMostPopularService.mockResolvedValueOnce({
            isLoading: true,
            episode: []
        })

        const { result, rerender } = renderHook(() => useGetMostPopularHook());

        waitFor(() => expect(result.current.episode).toEqual([]));
        waitFor(() => expect(result.current.isLoading).toBe(true));

        getMostPopularService.mockResolvedValueOnce({
            isLoading: true,
            episode: [{
                id: 1,
                title: 'Episode 1'
            }]
        })

        rerender()

        waitFor(() => expect(result.current.episode).toEqual([{ id: 1, title: 'Episode 1' }]));
        waitFor(() => expect(result.current.isLoading).toBe(false));
        
        });
});
