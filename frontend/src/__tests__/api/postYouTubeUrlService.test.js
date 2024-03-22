import apiClient from "@/api/apiClient";
import postYouTubeUrlService from "@/api/postYouTubeUrlService";

jest.mock("../../api/apiClient", () => ({
    post: jest.fn()
}));

describe('postYouTubeUrlService', () => {
    const mockUrl = 'http://youtube.com/test-video';
    
    it('should successfully post the YouTube URL and return data and status', async () => {
        const mockResponse = { status: 200, data: { id: 1, title: 'Test Video' } };
        apiClient.post.mockResolvedValue(mockResponse);

        const response = await postYouTubeUrlService(mockUrl);

        expect(apiClient.post).toHaveBeenCalledWith('creator/youtube/add/check', {
            url: mockUrl
        });
        expect(response).toEqual({ data: mockResponse.data, status: mockResponse.status });
    });

    it('should handle exceptions and throw accordingly', async () => {
        const error = new Error('Network error');
        apiClient.post.mockRejectedValue(error);

        await expect(postYouTubeUrlService(mockUrl)).rejects.toThrow('Network error');

        expect(apiClient.post).toHaveBeenCalledWith('creator/youtube/add/check', {
        url: mockUrl
        });
    });
});
