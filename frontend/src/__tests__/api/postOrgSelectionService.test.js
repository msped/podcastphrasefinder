import apiClient from '@/api/apiClient';
import { postOrgSelectionService } from '@/api/membershipServices';

jest.mock('../../api/apiClient');

describe('postOrgSelectionService', () => {
    it('should call apiClient.post with the correct URL and data', () => {
        const expectedUrl = '/orgs/memberships/user';
        const expectedData = { slug: 'test-org' };
        const mockResponse = { data: { slug: 'test-org' } };
        apiClient.post.mockResolvedValue(mockResponse);

        postOrgSelectionService('test-org');

        expect(apiClient.post).toHaveBeenCalledWith(expectedUrl, expectedData);
    });

    it('should return the correct data when apiClient.post resolves with a 200 status', async () => {
        const mockResponse = { status: 200, data: { slug: 'test-org' } };
        apiClient.post.mockResolvedValue(mockResponse);

        const result = await postOrgSelectionService('test-org');

        expect(result).toEqual(mockResponse.data);
    });

    it('should return null when apiClient.post resolves with a non-200 status', async () => {
        const mockResponse = { status: 404, data: {} };
        apiClient.post.mockResolvedValue(mockResponse);

        const result = await postOrgSelectionService('test-org');

        expect(result).toBeNull();
    });

    it('should handle exceptions and throw accordingly', async () => {
        const error = new Error('Network error');
        apiClient.post.mockRejectedValue(error);

        await expect(postOrgSelectionService('test-org')).rejects.toThrow('Network error');
    });
});
