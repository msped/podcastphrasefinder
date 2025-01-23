import apiClient from "@/api/apiClient";
import getConfirmDeletePodcastService from "@/pages/creator/_api/getConfirmDeletePodcastService";

jest.mock("../../api/apiClient");

describe("getConfirmDeletePodcastService", () => {
    it("should make a DELETE request to the correct endpoint", async () => {
        const slug = "test-slug";
        const token = "test-token";
        const mockStatus = 200;

        apiClient.get.mockResolvedValue({ status: mockStatus });

        const response = await getConfirmDeletePodcastService(slug, token);

        expect(apiClient.get).toHaveBeenCalledWith(`orgs/podcasts/${slug}/confirm/delete/${token}`)
        expect(response.status).toBe(mockStatus);
    });


    it("should handle and return the API client errors", async () => {
        const slug = "test-slug-error";
        const token = "test-token";
        const mockError = new Error("Mock API error");

        apiClient.get.mockRejectedValue(mockError);

        try {
            await getConfirmDeletePodcastService(slug, token);
        } catch (error) {
            expect(apiClient.get).toHaveBeenCalledWith(`orgs/podcasts/${slug}/confirm/delete/${token}`);
            expect(error).toBe(mockError);
        }
    });



    it("should handle API errors with status codes", async () => {
        const slug = "another-test-slug";
        const token = "test-token";
        const mockStatus = 404;
        const mockResponse = { status: mockStatus, data: {error: "Podcast does not exist."}}


        apiClient.get.mockResolvedValue({ status: mockStatus, data: mockResponse.data }); 
        const res = await getConfirmDeletePodcastService(slug, token);

        expect(res.status).toBe(mockStatus);
        expect(res.data.error).toBe("Podcast does not exist.");
        expect(apiClient.get).toHaveBeenCalledWith(`orgs/podcasts/${slug}/confirm/delete/${token}`);
    });
});

