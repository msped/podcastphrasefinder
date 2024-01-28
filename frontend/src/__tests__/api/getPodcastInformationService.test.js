// Import the module we want to test
import getPodcastInformationService from '@/api/getPodcastInformationService';
import apiClient from '@/api/apiClient'

// Mock the apiClient module
jest.mock('../../api/apiClient', () => ({
    get: jest.fn(),
}));

describe('getPodcastInformationService', () => {
    it('should call apiClient.get with the correct URL', () => {
        // Arrange: set up the channelId and the API path
        const channelId = 'abc123';
        const expectedUrl = `podcasts/${channelId}`;
        const mockResponse = { data: { podcastTitle: 'Test Podcast', episodes: [] }};
        apiClient.get.mockResolvedValue(mockResponse);
        
        // Act: invoke the service
        getPodcastInformationService(channelId);
        
        // Assert: the apiClient.get method has been called with the correct URL
        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the correct data when apiClient.get resolves', async () => {
        // Arrange: Create a mock response object and resolve value
        const mockResponse = { data: { podcastTitle: 'Test Podcast', episodes: [] }};
        apiClient.get.mockResolvedValue(mockResponse);
        
        // Act: Call the service
        const channelId = 'abc123';
        const result = await getPodcastInformationService(channelId);

        // Assert: The returned value should be the same as the data in the resolved promise
        expect(result).toEqual(mockResponse.data);
    });
});
