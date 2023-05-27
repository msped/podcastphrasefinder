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
                "channel_link": "https://www.youtube.com/@restispolitics",
                "no_of_episodes": 1
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
            "times_clicked": 11
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getEpisodesSearchService(query);

        expect(apiClient.get).toHaveBeenCalledWith('podcasts/episode/search', {
            params: { q: query }
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
                "channel_link": "https://www.youtube.com/@restispolitics",
                "no_of_episodes": 1
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "transcript": "This is a test transcript of a podcast from the Rest is Politics.",
            "times_clicked": 11
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getEpisodesSearchService(query);

        expect(result).toEqual(mockData);
    });

    it('throws an error if the API call fails', async () => {
        const query = 'ferrari';

        apiClient.get.mockRejectedValueOnce(new Error('API failed'));

        await expect(getEpisodesSearchService(query)).rejects.toThrow('API failed');
    });
});
