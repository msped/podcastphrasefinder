import { deleteUserService } from '@/api/userServices';
import apiClient from '@/api/apiClient';

jest.mock('../../api/apiClient', () => ({
    delete: jest.fn(),
}));

describe('deleteUserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call apiClient.delete with the correct URL', async () => {
        const mockResponse = { status: 204, data: null }; 
        apiClient.delete.mockResolvedValue(mockResponse);

        await deleteUserService();

        expect(apiClient.delete).toHaveBeenCalledTimes(1);
        expect(apiClient.delete).toHaveBeenCalledWith('auth/user/delete');
    });

    it('should return the response from apiClient.delete on successful deletion', async () => {
        const mockSuccessResponse = { status: 204, data: null };
        apiClient.delete.mockResolvedValue(mockSuccessResponse);

        const result = await deleteUserService();

        expect(result).toEqual(mockSuccessResponse);
    });

    it('should throw an error if apiClient.delete rejects', async () => {
        const mockError = new Error('Network Error');
        apiClient.delete.mockRejectedValue(mockError);

        // We expect the function to re-throw the error caught from apiClient
        await expect(deleteUserService()).rejects.toThrow('Network Error');
        expect(apiClient.delete).toHaveBeenCalledTimes(1);
        expect(apiClient.delete).toHaveBeenCalledWith('auth/user/delete');
    });

    it('should handle API errors (e.g., 403, 404) gracefully if apiClient.delete resolves with an error response', async () => {
        const mockApiErrorResponse = {
            status: 403,
            data: { error: 'Forbidden' },
            isAxiosError: true,
            response: {
                status: 403,
                data: { error: 'Forbidden' }
            }
        };

        apiClient.delete.mockResolvedValue(mockApiErrorResponse);

        const result = await deleteUserService();

        expect(result).toEqual(mockApiErrorResponse);
        expect(apiClient.delete).toHaveBeenCalledWith('auth/user/delete');
    });
});
