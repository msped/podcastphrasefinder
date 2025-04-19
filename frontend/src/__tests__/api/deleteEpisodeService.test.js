import apiClient from "@/api/apiClient";
import { deleteEpisodesService } from "@/api/episodeServices";

jest.mock("../../api/apiClient", () => ({
    delete: jest.fn(),
}));

describe("deleteEpisodesService", () => {
    const episodeId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return the status code when delete request is successful", async () => {
        apiClient.delete.mockResolvedValue({ status: 200 });

        const status = await deleteEpisodesService(episodeId);

        expect(status).toBe(200);
        expect(apiClient.delete).toHaveBeenCalledWith(`creator/episodes/${episodeId}`);
    });

    it("should propagate the error when the delete request fails", async () => {
        const errorMessage = "Request failed";
        apiClient.delete.mockRejectedValue(new Error(errorMessage));

        await expect(deleteEpisodesService(episodeId)).rejects.toThrow(errorMessage);
        expect(apiClient.delete).toHaveBeenCalledWith(`creator/episodes/${episodeId}`);
    });
});
