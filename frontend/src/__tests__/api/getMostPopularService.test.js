import apiClient from '@/api/apiClient';
import getMostPopularService from '@/api/getMostPopularService';

jest.mock('../../api/apiClient');

describe('getMostPopularService', () => {
    it('makes an API call with the correct arguments', async () => {
        const mockData = {
            "id": 1,
            "video_id": "b-UYSj6Q0Ao",
            "channel": {
                "id": 2,
                "name": "The Rest Is Politics",
                "channel_id": "UCsufaClk5if2RGqABb-09Uw",
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "times_clicked": 11
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        getMostPopularService();

        expect(apiClient.get).toHaveBeenCalledWith('podcasts/episode/popular');
    });

    it('returns the correct data', async () => {
        const mockData = {
            "id": 1,
            "video_id": "b-UYSj6Q0Ao",
            "channel": {
                "id": 2,
                "name": "The Rest Is Politics",
                "channel_id": "UCsufaClk5if2RGqABb-09Uw"
            },
            "title": "Suella's speeding, Japan in focus, and what's the point of the G7?",
            "times_clicked": 11
        }

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getMostPopularService();

        expect(result).toEqual(mockData);
    });

    it('throws an error if the API call fails', async () => {

        apiClient.get.mockRejectedValueOnce(new Error('API failed'));

        await expect(getMostPopularService()).rejects.toThrow('API failed');
    });
});
