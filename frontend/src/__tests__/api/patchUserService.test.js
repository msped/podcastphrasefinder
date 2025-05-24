import { patchUserService } from '@/api/userServices';
import apiClient from '@/api/apiClient';

// Mock the apiClient
jest.mock('../../api/apiClient', () => ({
    patch: jest.fn(),
}));

describe('patchUserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call apiClient.patch with the correct URL and formData', async () => {
        const mockFormData = new FormData();
        mockFormData.append('username', 'testuser');

        // Mock a successful response
        const mockResponse = { status: 200, data: { message: 'User updated successfully' } };
        apiClient.patch.mockResolvedValue(mockResponse);

        await patchUserService(mockFormData);

        expect(apiClient.patch).toHaveBeenCalledTimes(1);
        expect(apiClient.patch).toHaveBeenCalledWith('auth/user', mockFormData);
    });

    it('should return the response from apiClient.patch on success', async () => {
        const mockFormData = new FormData();
        mockFormData.append('email', 'test@example.com');

        const mockSuccessResponse = { status: 200, data: { id: 1, email: 'test@example.com' } };
        apiClient.patch.mockResolvedValue(mockSuccessResponse);

        const result = await patchUserService(mockFormData);

        expect(result).toEqual(mockSuccessResponse);
    });

    it('should throw an error if apiClient.patch rejects', async () => {
        const mockFormData = new FormData();
        mockFormData.append('bio', 'A new bio');

        const mockError = new Error('Network Error');
        apiClient.patch.mockRejectedValue(mockError);

        // We expect the function to re-throw the error caught from apiClient
        await expect(patchUserService(mockFormData)).rejects.toThrow('Network Error');
        expect(apiClient.patch).toHaveBeenCalledTimes(1);
        expect(apiClient.patch).toHaveBeenCalledWith('auth/user', mockFormData);
    });

    it('should handle API errors (e.g., 400, 500) gracefully if apiClient.patch resolves with an error response', async () => {
        const mockFormData = new FormData();
        mockFormData.append('password', 'newpassword123');

        const mockApiErrorResponse = {
            status: 400,
            data: { error: 'Invalid input' },
            isAxiosError: true, 
            response: {
                status: 400,
                data: { error: 'Invalid input' }
            }
        };

        apiClient.patch.mockResolvedValue(mockApiErrorResponse);

        const result = await patchUserService(mockFormData);

        expect(result).toEqual(mockApiErrorResponse);
        expect(apiClient.patch).toHaveBeenCalledWith('auth/user', mockFormData);
    });
});
