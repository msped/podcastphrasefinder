import apiClient from "@/api/apiClient";
import {
    getMembershipsService,
    postMembershipsService,
    patchMembershipsService,
    deleteMembershipsService,
    TransferMembershipService
} from "@/pages/creator/_api/membershipServices";

jest.mock('../../api/apiClient');

describe("membershipServices", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getMembershipsService", () => {
        it("should fetch memberships successfully", async () => {
            const mockData = [{ id: 1, name: "Test Membership" }];
            apiClient.get.mockResolvedValue({ data: mockData });

            const result = await getMembershipsService();

            expect(apiClient.get).toHaveBeenCalledWith("/orgs/memberships");
            expect(result).toEqual(mockData);
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Network Error");
            apiClient.get.mockRejectedValue(mockError);

            await expect(getMembershipsService()).rejects.toThrow(mockError);
            expect(apiClient.get).toHaveBeenCalledWith("/orgs/memberships");
        });
    });


    describe("postMembershipsService", () => {
        const formData = { name: "New Membership" };

        it("should post membership data successfully", async () => {
            const mockResponse = { status: 201, data: { id: 2, name: "New Membership" } };
            apiClient.post.mockResolvedValue(mockResponse);

            const result = await postMembershipsService(formData);
            expect(result).toEqual(mockResponse);
            expect(apiClient.post).toHaveBeenCalledWith("/orgs/memberships", formData);
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Network Error");
            apiClient.post.mockRejectedValue(mockError);

            await expect(postMembershipsService(formData)).rejects.toThrow(
                mockError
            );
            expect(apiClient.post).toHaveBeenCalledWith("/orgs/memberships", formData);
        });
    });

    describe("patchMembershipsService", () => {
        const memberId = 1;
        const formData = { name: "Updated Membership" };

        it("should patch membership data successfully", async () => {
            const mockResponse = { status: 200, data: { id: 1, name: "Updated Membership" } };
            apiClient.patch.mockResolvedValue(mockResponse);

            const result = await patchMembershipsService(memberId, formData);

            expect(apiClient.patch).toHaveBeenCalledWith(`/orgs/memberships/${memberId}`, formData);
            expect(result).toEqual(mockResponse);
        });


        it("should handle errors correctly", async () => {
            const mockError = new Error("Network Error");
            apiClient.patch.mockRejectedValue(mockError);

            await expect(patchMembershipsService(memberId, formData)).rejects.toThrow(
                mockError
            );

            expect(apiClient.patch).toHaveBeenCalledWith(`/orgs/memberships/${memberId}`, formData);
        });
    });



    describe("deleteMembershipsService", () => {
        const memberId = 1;

        it("should delete membership successfully", async () => {

            const mockResponse = { status: 204 };
            apiClient.delete.mockResolvedValue(mockResponse);

            const result = await deleteMembershipsService(memberId);

            expect(apiClient.delete).toHaveBeenCalledWith(`/orgs/memberships/${memberId}`);
            expect(result).toEqual(mockResponse);
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Network Error");
            apiClient.delete.mockRejectedValue(mockError);


            await expect(deleteMembershipsService(memberId)).rejects.toThrow(
                mockError
            );
            expect(apiClient.delete).toHaveBeenCalledWith(`/orgs/memberships/${memberId}`);
        });
    });

    describe(("TransferOwnershipService"), () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should make a POST request to the correct URL with the correct data', async () => {
            const formData = 'newOwner@example.com';
            const expectedResponse = { data: 'success' };
            
            apiClient.post.mockResolvedValue(expectedResponse);
    
            const response = await TransferMembershipService(formData);

            expect(apiClient.post).toHaveBeenCalledWith(
                'orgs/podcasts/transfer/ownership',
                { 'requested_owner': formData }
            );
            expect(response).toEqual(expectedResponse);
        });
    
        it('should throw an error when the request fails', async () => {
            const formData = 'newOwner@example.com';
            const errorMessage = 'Request failed';
    
            apiClient.post.mockRejectedValue(new Error(errorMessage));

            await expect(TransferMembershipService(formData)).rejects.toThrow(errorMessage);
        });
    });

});
