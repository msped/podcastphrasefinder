import apiClient from "@/api/apiClient";
import patchEditEpisodeFormService from "@/pages/creator/_api/patchEditEpisodeFormService";

jest.mock("../../api/apiClient", () => ({
    patch: jest.fn(),
}));

describe("patchEditEpisodeFormService", () => {
    const episodeId = 1;
    const formData = {
        title: "Updated Episode Title",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should make a PATCH request with the correct URL and data", async () => {
        const mockResponse = { status: 200 };
        apiClient.patch.mockResolvedValue(mockResponse);

        await patchEditEpisodeFormService(episodeId, formData);

        expect(apiClient.patch).toHaveBeenCalledWith(
            `creator/episodes/${episodeId}`,
            formData
        );
    });

    it("should return the response object on success", async () => {
        const mockResponse = { status: 200, data: { message: "Success!" } };
        apiClient.patch.mockResolvedValue(mockResponse);

        const response = await patchEditEpisodeFormService(episodeId, formData);

        expect(response).toEqual(mockResponse);
    });

    it("should handle and throw errors from the API call", async () => {
        const errorMessage = "Something went wrong!";
        apiClient.patch.mockRejectedValue(new Error(errorMessage));

        await expect(
            patchEditEpisodeFormService(episodeId, formData)
        ).rejects.toThrow(errorMessage);
    });
});

