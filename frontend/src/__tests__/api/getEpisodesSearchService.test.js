import apiClient from '@/api/apiClient';
import getEpisodesSearchService from '@/api/getEpisodesSearchService';

jest.mock('../../api/apiClient');

describe('getEpisodesSearchService', () => {
    it('makes an API call with the correct arguments', async () => {
        const query = 'test';
        const mockData = {
            "id": 1,
            "video_id": "b-UYSj6Q0Ao",
            "channel": {
                "id": 2,
                "name": "The Rest Is Politics",
                "slug": "the-rest-is-politics",
                "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getEpisodesSearchService(query);

        expect(apiClient.get).toHaveBeenCalledWith('podcasts/episode/search', {
            params: { q: query }
        });
    });

    it('makes an API call with the correct arguments including channel id', async () => {
        const query = 'test';
        const channelId = 'UCsufaClk5if2RGqABb-09Uw'
        const mockData = {
            "id": 1,
            "video_id": "b-UYSj6Q0Ao",
            "channel": {
                "id": 2,
                "name": "The Rest Is Politics",
                "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getEpisodesSearchService(query, channelId);

        expect(apiClient.get).toHaveBeenCalledWith('podcasts/episode/search', {
            params: { q: query, c: channelId }
        });
    });

    it('returns the correct data', async () => {
        const query = 'test';
        const mockData = {
            "id": 1,
            "video_id": "b-UYSj6Q0Ao",
            "channel": {
                "id": 2,
                "name": "The Rest Is Politics",
                "slug": "the-rest-is-politics",
                "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getEpisodesSearchService(query);

        expect(result).toEqual(mockData);
    });

    it('returns the correct data with channel slug', async () => {
        const query = 'test';
        const slug = 'the-rest-is-politics';
        const mockData = {
            "id": 1,
            "video_id": "b-UYSj6Q0Ao",
            "channel": {
                "id": 2,
                "name": "The Rest Is Politics",
                "slug": "the-rest-is-politics",
                "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getEpisodesSearchService(query, slug);

        expect(result).toEqual(mockData);
    });

    it('throws an error if the API call fails', async () => {
        const query = 'ferrari';

        apiClient.get.mockRejectedValueOnce(new Error('API failed'));

        await expect(getEpisodesSearchService(query)).rejects.toThrow('API failed');
    });
});
