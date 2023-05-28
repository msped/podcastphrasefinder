import apiClient from "@/api/apiClient";
import postEpisodeIncrementService from "@/api/postEpisodeIncrementService";

jest.mock('../../api/apiClient', () => ({
    post: jest.fn(),
}));

describe("postEpisodeIncrementService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls apiClient.post with correct endpoint and arguments", async () => {
        const episodeId = "abc123";
        const responseData = { success: true };
        apiClient.post.mockResolvedValueOnce({ data: responseData });

        const result = await postEpisodeIncrementService(episodeId);

        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith(
        `podcasts/episode/increment/${episodeId}`
        );
        expect(result).toEqual(responseData);
    });

    it("throws an error if apiClient.post throws an error", async () => {
        const episodeId = "abc123";
        const errorMessage = "Network Error";
        apiClient.post.mockRejectedValueOnce(new Error(errorMessage));

        await expect(postEpisodeIncrementService(episodeId)).rejects.toThrowError(
        errorMessage
        );

        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith(
        `podcasts/episode/increment/${episodeId}`
        );
    });
});
