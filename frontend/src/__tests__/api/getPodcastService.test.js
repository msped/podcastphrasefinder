import getPodcastService from '@/api/getPodcastService';
import apiClient from '@/api/apiClient'

jest.mock('../../api/apiClient', () => ({
    get: jest.fn(),
}));

describe('getPodcastService', () => {
    it('should call apiClient.get with the correct URL', () => {
        const channelId = 'abc123';
        const expectedUrl = `podcasts/${channelId}`;
        const mockResponse = { data: { podcastTitle: 'Test Podcast', episodes: [] }};
        apiClient.get.mockResolvedValue(mockResponse);

        getPodcastService(channelId);
        
        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the correct data when apiClient.get resolves', async () => {
        const mockResponse = { data: { podcastTitle: 'Test Podcast', episodes: [] }};
        apiClient.get.mockResolvedValue(mockResponse);
        
        const channelId = 'abc123';
        const result = await getPodcastService(channelId);

        expect(result).toEqual(mockResponse.data);
    });
});
