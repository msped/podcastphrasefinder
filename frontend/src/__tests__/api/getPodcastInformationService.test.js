import getPodcastInformationService from '@/api/getPodcastInformationService';
import apiClient from '@/api/apiClient'

jest.mock('../../api/apiClient', () => ({
    get: jest.fn(),
}));

describe('getPodcastInformationService', () => {
    it('should call apiClient.get with the correct URL', () => {
        const channelId = 'abc123';
        const expectedUrl = `podcasts/${channelId}`;
        const mockResponse = { data: { podcastTitle: 'Test Podcast', episodes: [] }};
        apiClient.get.mockResolvedValue(mockResponse);

        getPodcastInformationService(channelId);
        
        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the correct data when apiClient.get resolves', async () => {
        const mockResponse = { data: { podcastTitle: 'Test Podcast', episodes: [] }};
        apiClient.get.mockResolvedValue(mockResponse);
        
        const channelId = 'abc123';
        const result = await getPodcastInformationService(channelId);

        expect(result).toEqual(mockResponse.data);
    });
});
