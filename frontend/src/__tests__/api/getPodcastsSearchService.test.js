import apiClient from '@/api/apiClient';
import getPodcastsSearchService from '@/api/getPodcastsSearchService';

jest.mock('../../api/apiClient');

describe('getChannelsSearchService', () => {
    it('makes an API call with the correct arguments', async () => {
        const query = 'test';
        const mockData = { channels: [{ id: 1, name: 'Test Channel' }] };

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getPodcastsSearchService(query);

        expect(apiClient.get).toHaveBeenCalledWith('podcasts/search', {
            params: { q: query }
        });
    });

    it('returns the correct data', async () => {
        const query = 'test';
        const mockData = { channels: [{ id: 1, name: 'Test Channel' }] };

        apiClient.get.mockResolvedValueOnce({ data: mockData });

        const result = await getPodcastsSearchService(query);

        expect(result).toEqual(mockData);
    });

    it('throws an error if the API call fails', async () => {
        const query = 'test';

        apiClient.get.mockRejectedValueOnce(new Error('API failed'));

        await expect(getPodcastsSearchService(query)).rejects.toThrow('API failed');
    });
});
