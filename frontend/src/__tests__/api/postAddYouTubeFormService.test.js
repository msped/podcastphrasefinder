import apiClient from "@/api/apiClient";
import postAddYouTubeFormService from "@/api/postAddYouTubeFormService";

jest.mock("../../api/apiClient", () => ({
    post: jest.fn()
}));

describe('postAddYouTubeFormService', () => {
    const mockData = {
        url: 'https://www.youtube.com/watch?v=test1234',
        title: 'Test title',
        published_date: '02/25/2024',
        exclusive: '',
        transcript: 'Test ',
        error_occurred: '',
        is_draft: ''
    };
    
    it('should successfully post the YouTube URL and return data and status', async () => {
        const mockResponse = { status: 200 };
        apiClient.post.mockResolvedValue(mockResponse);

        const response = await postAddYouTubeFormService(mockData);

        expect(apiClient.post).toHaveBeenCalledWith('creator/youtube/add', mockData);
        expect(response).toEqual({ status: mockResponse.status });
    });

    it('should handle exceptions and throw accordingly', async () => {
        const error = new Error('Network error');
        apiClient.post.mockRejectedValue(error);

        await expect(postAddYouTubeFormService(mockData)).rejects.toThrow('Network error');

        expect(apiClient.post).toHaveBeenCalledWith('creator/youtube/add', mockData);
    });
});
