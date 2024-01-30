import { renderHook, waitFor, act } from '@testing-library/react';
import getPodcastsSearchService from '@/api/getPodcastsSearchService';
import useGetPodcastsSearchHook from '@/hooks/useGetPodcastsSearchHook';

jest.mock('../../api/getPodcastsSearchService');

describe('useGetPodcastsSearchHook', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('fetches data when query length is >=3 and results are empty', () => {
        const query = 'test';
        const mockData = {
            isLoading: true,
            results: [{ id: 1, name: 'Test Podcast' }]
        }

        getPodcastsSearchService.mockResolvedValueOnce(mockData);

        const { result, rerender } = renderHook(() =>
            useGetPodcastsSearchHook(query)
        );

        waitFor(() => expect(result.current.results).toEqual([]));
        waitFor(() => expect(result.current.isLoading).toBe(true));

        rerender();

        waitFor(() => expect(result.current.results).toEqual(mockData));
        waitFor(() =>expect(result.current.isLoading).toBe(false));
    });

    it('fetches data when query length is 0 and isLoading is true and results are empty', () => {
        const query = '';
        const mockData = {
            isLoading: true,
            results: []
        }

        getPodcastsSearchService.mockResolvedValueOnce(mockData);

        const { result, rerender } = renderHook(() =>
            useGetPodcastsSearchHook(query)
        );

        waitFor(() => expect(result.current.results).toEqual([]));
        waitFor(() => expect(result.current.isLoading).toBe(true));

        rerender();

        waitFor(() => expect(result.current.results).toEqual(mockData));
        waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('debounces the API call for queries longer than 2 characters', async () => {
        let query = 'test';
        const mockData = {
            isLoading: true,
            results: []
        }

        getPodcastsSearchService.mockResolvedValueOnce(mockData);

        const { result, rerender } = renderHook(() =>
            useGetPodcastsSearchHook(query)
        );

        waitFor(() => expect(result.current.results).toEqual([]));
        waitFor(() => expect(result.current.isLoading).toBe(true));

        rerender();

        getPodcastsSearchService.mockResolvedValueOnce([]);

        act(() => {
            query = 'new query'
        });

        waitFor(() => expect(result.current.results).toEqual(mockData));
        waitFor(() => expect(result.current.isLoading).toBe(true));

        rerender();

        waitFor(() => expect(result.current.results).toEqual([]));
        waitFor(() => expect(result.current.isLoading).toBe(false));
    });
});
