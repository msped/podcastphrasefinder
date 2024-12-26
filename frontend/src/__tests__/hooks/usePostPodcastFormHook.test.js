import apiClient from "@/api/apiClient";
import postPodcastFormService from "@/pages/creator/_api/postPodcastFormService";

jest.mock("../../api/apiClient", () => ({
    post: jest.fn()
}));

describe('postPodcastFormService', () => {
    const mockFormData = new FormData(); 
    
    it('should successfully post the form data and return data and status', async () => {
        const mockResponse = { status: 201, data: { id: 1, name: 'Test Podcast' } };
        apiClient.post.mockResolvedValue(mockResponse);

        const response = await postPodcastFormService(mockFormData);

        expect(apiClient.post).toHaveBeenCalledWith('orgs/podcasts', mockFormData);
        expect(response).toEqual({ data: mockResponse.data, status: mockResponse.status });
    });

    it('should handle exceptions and throw accordingly', async () => {
        const error = new Error('Network error');
        apiClient.post.mockRejectedValue(error);

        await expect(postPodcastFormService(mockFormData)).rejects.toThrow('Network error');

        expect(apiClient.post).toHaveBeenCalledWith('orgs/podcasts', mockFormData);
    });
});

