import apiClient from "@/api/apiClient"; 
import patchPodcastService from "@/pages/creator/_api/patchPodcastService";

jest.mock("../../api/apiClient");

describe("patchPodcastService", () => {
    const podcastSlug = "test-podcast";
    const formData = { name: "Updated Podcast Name" };

    it("should make a PATCH request with the correct URL and data", async () => {
        const mockResponse = { status: 200 }; 
        apiClient.patch.mockResolvedValue(mockResponse);

        const response = await patchPodcastService(podcastSlug, formData);

        expect(apiClient.patch).toHaveBeenCalledWith(
            `orgs/podcasts/${podcastSlug}`,
            formData,
            {"headers": {"Content-Type": "multipart/form-data"}}
        );
        expect(response).toEqual(mockResponse);
    });

    it("should handle errors from the API client", async () => {
        const mockError = new Error("API request failed");
        apiClient.patch.mockRejectedValue(mockError);

        await expect(patchPodcastService(podcastSlug, formData)).rejects.toThrow(
            mockError
        );
        expect(apiClient.patch).toHaveBeenCalledWith(
            `orgs/podcasts/${podcastSlug}`,
            formData,
            {"headers": {"Content-Type": "multipart/form-data"}}
        );
    });
});
