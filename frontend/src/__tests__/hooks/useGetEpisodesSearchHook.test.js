import { renderHook, waitFor, act } from '@testing-library/react';
import getEpisodesSearchService from '@/api/getEpisodesSearchService';
import useGetEpisodesSearchHook from '@/hooks/useGetEpisodesSearchHook';

jest.mock('../../api/getEpisodesSearchService');

describe('useGetEpisodesSearchHook', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('fetches data when query length is >=3 and results are empty', () => {
        const query = 'test';
        const mockData = {
            isLoading: true,
            results: [{
                "id": 1,
                "video_id": "b-UYSj6Q0Ao",
                "channel": {
                    "id": 2,
                    "name": "The Rest Is Politics",
                    "channel_id": "UCsufaClk5if2RGqABb-09Uw"
                },
                "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            }]
        }

        getEpisodesSearchService.mockResolvedValueOnce(mockData);

        const { result, rerender } = renderHook(() =>
            useGetEpisodesSearchHook(query)
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

        getEpisodesSearchService.mockResolvedValueOnce(mockData);

        const { result, rerender } = renderHook(() =>
            useGetEpisodesSearchHook(query)
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

        getEpisodesSearchService.mockResolvedValueOnce(mockData);

        const { result, rerender } = renderHook(() =>
            useGetEpisodesSearchHook(query)
        );

        waitFor(() => expect(result.current.results).toEqual([]));
        waitFor(() => expect(result.current.isLoading).toBe(true));

        rerender();

        getEpisodesSearchService.mockResolvedValueOnce([]);

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
