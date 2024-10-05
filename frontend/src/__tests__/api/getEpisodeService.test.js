import apiClient from "@/api/apiClient";
import getEpisodeService from "@/pages/creator/_api/getEpisodeService";

jest.mock("../../api/apiClient", () => ({
    get: jest.fn(),
}));


describe("getEpisodeService", () => {
    const episodeId = 1;
    const mockData = {
        "id": episodeId,
        "channel": {
            "id": 1,
            "name": "Have a Word",
            "slug": "have-a-word",
            "avatar": "https://bigoldtesturl.com/avatar.jpg"
        },
        "title": "Mark Nelson | Have A Word Podcast #265",
        "published_date": "2024-02-26T00:00:27Z",
        "private_video": false,
        "is_draft": false,
        "exclusive": false
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return the status code and data when get request is successful", async () => {
        apiClient.get.mockResolvedValue({ data: mockData });

        const response = await getEpisodeService(episodeId);

        expect(response).toEqual(mockData);
        expect(apiClient.get).toHaveBeenCalledWith(`creator/episodes/${episodeId}`);
    });

    it("should propagate the error when the get request fails", async () => {
        const errorMessage = "Request failed";
        apiClient.get.mockRejectedValue(new Error(errorMessage));

        await expect(getEpisodeService(episodeId)).rejects.toThrow(errorMessage);
        expect(apiClient.get).toHaveBeenCalledWith(`creator/episodes/${episodeId}`);
    });
});
