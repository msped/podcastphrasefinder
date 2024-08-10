import apiClient from '@/api/apiClient';
import getPodcastOrgsService from '@/api/getPodcastOrgsService';

jest.mock('../../api/apiClient');

describe('getPodcastOrgsService', () => {
    it('should call apiClient.get with the correct URL', () => {
        const expectedUrl = 'auth/org/memberships';
        const mockResponse = { data: [{ slug: 'test-org' }] };
        apiClient.get.mockResolvedValue(mockResponse);

        getPodcastOrgsService();

        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the correct data when apiClient.get resolves with a 200 status', async () => {
        const mockResponse = { status: 200, data: [{ slug: 'test-org' }] };
        apiClient.get.mockResolvedValue(mockResponse);

        const result = await getPodcastOrgsService();

        expect(result).toEqual(mockResponse.data);
    });

    it('should handle exceptions and throw accordingly', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(getPodcastOrgsService()).rejects.toThrow('Network error');
    });
});
