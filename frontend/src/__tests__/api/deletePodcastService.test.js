import apiClient from "@/api/apiClient";
import deletePodcastService from "@/pages/creator/_api/deletePodcastService";

jest.mock("../../api/apiClient");

describe("deletePodcastService", () => {
    it("should make a DELETE request to the correct endpoint", async () => {
        const slug = "test-slug";
        const mockStatus = 200;

        apiClient.delete.mockResolvedValue({ status: mockStatus });

        const response = await deletePodcastService(slug);

        expect(apiClient.delete).toHaveBeenCalledWith(`orgs/podcasts/${slug}`)
        expect(response.status).toBe(mockStatus);
    });


    it("should handle and return the API client errors", async () => {
        const slug = "test-slug-error";
        const mockError = new Error("Mock API error");

        apiClient.delete.mockRejectedValue(mockError);
        try {
            await deletePodcastService(slug);
        } catch (error) {
            expect(error).toBe(mockError);
        }

        expect(apiClient.delete).toHaveBeenCalledWith(`orgs/podcasts/${slug}`);
    });



    it("should handle API errors with status codes", async () => {
        const slug = "another-test-slug";
        const mockStatus = 404;
        const mockResponse = { status: mockStatus, data: {error: "Not Found"}}


        apiClient.delete.mockResolvedValue({ status: mockStatus, data: mockResponse.data }); 
        const res = await deletePodcastService(slug);

        expect(res.status).toBe(mockStatus);
        expect(res.data.error).toBe("Not Found");
        expect(apiClient.delete).toHaveBeenCalledWith(`orgs/podcasts/${slug}`);
    });
});

