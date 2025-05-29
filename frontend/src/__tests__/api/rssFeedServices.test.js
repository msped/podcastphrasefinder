import apiClient from "@/api/apiClient";
import {
    getFeedsService,
    postFeedService,
    deleteFeedService,
    getEpisodeReleaseDaysService,
    postEpisodeReleaseDaysService,
    deleteEpisodeReleaseDaysService
} from "@/api/podcastServices"; // Assuming your services are in podcastServices.js

// Mock the apiClient
jest.mock("../../api/apiClient", () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

describe("Podcast Service Functions", () => {
    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });

    describe("getFeedsService", () => {
        it("should call apiClient.get with the correct URL and return data", async () => {
            const mockPodcastSlug = "test-podcast";
            const mockResponseData = [{ id: 1, url: "http://example.com/feed.xml" }];
            apiClient.get.mockResolvedValue({ data: mockResponseData });

            const result = await getFeedsService(mockPodcastSlug);

            expect(apiClient.get).toHaveBeenCalledWith(`orgs/podcasts/${mockPodcastSlug}/rss-feeds`);
            expect(result).toEqual(mockResponseData);
        });
    });

    describe("postFeedService", () => {
        it("should call apiClient.post with the correct URL and payload, and return data", async () => {
            const mockPodcast = { id: 1, slug: "test-podcast" };
            const mockFeedUrl = "http://example.com/new-feed.xml";
            const mockResponseData = { id: 2, url: mockFeedUrl };
            apiClient.post.mockResolvedValue({ data: mockResponseData });

            const result = await postFeedService(mockPodcast, mockFeedUrl);

            expect(apiClient.post).toHaveBeenCalledWith(
                `orgs/podcasts/${mockPodcast.slug}/rss-feeds`,
                {
                    podcast_id: mockPodcast.id,
                    rss_feed_url: mockFeedUrl
                }
            );
            expect(result).toEqual(mockResponseData);
        });
    });

    describe("deleteFeedService", () => {
        it("should call apiClient.delete with the correct URL and return data", async () => {
            const mockPodcastSlug = "test-podcast";
            const mockFeedId = 123;
            const mockResponseData = { message: "Feed deleted successfully" };
            apiClient.delete.mockResolvedValue({ data: mockResponseData });

            const result = await deleteFeedService(mockPodcastSlug, mockFeedId);

            expect(apiClient.delete).toHaveBeenCalledWith(`orgs/podcasts/${mockPodcastSlug}/rss-feeds/${mockFeedId}`);
            expect(result).toEqual(mockResponseData);
        });
    });

    describe("getEpisodeReleaseDaysService", () => {
        it("should call apiClient.get with the correct URL and return data", async () => {
            const mockPodcastSlug = "another-podcast";
            const mockResponseData = [{ day: "Monday" }];
            apiClient.get.mockResolvedValue({ data: mockResponseData });

            const result = await getEpisodeReleaseDaysService(mockPodcastSlug);

            expect(apiClient.get).toHaveBeenCalledWith(`orgs/podcasts/${mockPodcastSlug}/schedule`);
            expect(result).toEqual(mockResponseData);
        });
    });

    describe("postEpisodeReleaseDaysService", () => {
        it("should call apiClient.post with the correct URL and payload, and return data", async () => {
            const mockPodcast = { id: 2, slug: "another-podcast" };
            const mockDay = { day_of_week: 1, name: "Monday" }; // Assuming 'day' is an object
            const mockResponseData = { id: 1, day: mockDay };
            apiClient.post.mockResolvedValue({ data: mockResponseData });

            const result = await postEpisodeReleaseDaysService(mockPodcast, mockDay);

            expect(apiClient.post).toHaveBeenCalledWith(
                `orgs/podcasts/${mockPodcast.slug}/schedule`,
                {
                    podcast_id: mockPodcast.id,
                    day: mockDay
                }
            );
            expect(result).toEqual(mockResponseData);
        });
    });

    describe("deleteEpisodeReleaseDaysService", () => {
        it("should call apiClient.delete with the correct URL and return data", async () => {
            const mockPodcast = { id: 2, slug: "another-podcast" };
            const mockDay = { id: 5, day_of_week: 1, name: "Monday" }; // Assuming 'day' has an 'id'
            const mockResponseData = { message: "Schedule day deleted successfully" };
            apiClient.delete.mockResolvedValue({ data: mockResponseData });

            const result = await deleteEpisodeReleaseDaysService(mockPodcast, mockDay);

            expect(apiClient.delete).toHaveBeenCalledWith(`orgs/podcasts/${mockPodcast.slug}/schedule/${mockDay.id}`);
            expect(result).toEqual(mockResponseData);
        });
    });
});
