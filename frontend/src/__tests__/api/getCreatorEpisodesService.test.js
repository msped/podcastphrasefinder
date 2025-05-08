import apiClient from '@/api/apiClient';
import { getCreatorEpisodeService } from '@/api/episodeServices';

jest.mock('../../api/apiClient');

describe('getCreatorEpisodeService', () => {
    it('should call apiClient.get with the correct URL', () => {
        const selectedPodcastOrg = 'test-org';
        const expectedUrl = `creator/${selectedPodcastOrg}/episodes`;
        const mockResponse = { data: [{ id: 1, title: 'Test Episode' }] };
        apiClient.get.mockResolvedValue(mockResponse);

        getCreatorEpisodeService(selectedPodcastOrg);

        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the correct data when apiClient.get resolves with a 200 status', async () => {
        const selectedPodcastOrg = 'test-org';
        const mockResponse = { status: 200, data: [{ id: 1, title: 'Test Episode' }] };
        apiClient.get.mockResolvedValue(mockResponse);

        const result = await getCreatorEpisodeService(selectedPodcastOrg);

        expect(result).toEqual(mockResponse.data);
    });

    it('should handle exceptions and throw accordingly', async () => {
        const selectedPodcastOrg = 'test-org';
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(getCreatorEpisodeService(selectedPodcastOrg)).rejects.toThrow('Network error');
    });
});
