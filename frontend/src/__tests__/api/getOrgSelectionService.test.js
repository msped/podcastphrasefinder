import apiClient from '@/api/apiClient';
import { getOrgSelectionService } from '@/api/membershipServices';

jest.mock('../../api/apiClient');

describe('getOrgSelectionService', () => {
    it('should call apiClient.get with the correct URL', () => {
        const expectedUrl = 'orgs/memberships/user';
        const mockResponse = { data: { slug: 'test-org' }, status: 200 };
        apiClient.get.mockResolvedValue(mockResponse);

        getOrgSelectionService();

        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return the correct data when apiClient.get resolves with a 200 status', async () => {
        const mockResponse = { status: 200, data: { slug: 'test-org' } };
        apiClient.get.mockResolvedValue(mockResponse);

        const result = await getOrgSelectionService();

        expect(result).toEqual(mockResponse.data);
    });

    it('should return null when apiClient.get resolves with a non-200 status', async () => {
        const mockResponse = { status: 404, data: {} };
        apiClient.get.mockResolvedValue(mockResponse);

        const result = await getOrgSelectionService();

        expect(result).toBeNull();
    });

    it('should handle exceptions and throw accordingly', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(getOrgSelectionService()).rejects.toThrow('Network error');
    });
});
