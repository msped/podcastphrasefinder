import apiClient from "@/api/apiClient";
import postYouTubeUrlService from "@/api/postYouTubeUrlService";

// Mock the entire apiClient module
jest.mock("../../api/apiClient", () => ({
    post: jest.fn()
}));

describe('postYouTubeUrlService', () => {
    const mockUrl = 'http://youtube.com/test-video';
    
    it('should successfully post the YouTube URL and return data and status', async () => {
        // Setup a successful response
        const mockResponse = { status: 200, data: { id: 1, title: 'Test Video' } };
        apiClient.post.mockResolvedValue(mockResponse);

        // Call the service with our URL
        const response = await postYouTubeUrlService(mockUrl);

        // Assertions to check if the service returned correct response
        expect(apiClient.post).toHaveBeenCalledWith('creator/youtube/add/check', {
            url: mockUrl
        });
        expect(response).toEqual({ data: mockResponse.data, status: mockResponse.status });
    });

    it('should handle exceptions and throw accordingly', async () => {
        // Simulate an error on the POST request
        const error = new Error('Network error');
        apiClient.post.mockRejectedValue(error);

        // Expect the service to throw an error when calling it with the URL
        await expect(postYouTubeUrlService(mockUrl)).rejects.toThrow('Network error');

        // Check if the apiClient.post was called correctly even on failure
        expect(apiClient.post).toHaveBeenCalledWith('creator/youtube/add/check', {
        url: mockUrl
        });
    });

  // Additional tests could be here to handle other edge cases, such as:
  // - Testing for different HTTP status codes
  // - Testing for different shapes of response data
});
