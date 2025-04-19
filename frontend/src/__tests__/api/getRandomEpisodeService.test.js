import apiClient from '@/api/apiClient';
import { getRandomEpisodeService } from '@/api/episodeServices';

jest.mock('../../api/apiClient');

describe('getRandomEpisodeService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch random episode data successfully', async () => {
        const mockData = { id: 1, title: 'Test Episode' };
        apiClient.get.mockResolvedValue({ data: mockData });

        const result = await getRandomEpisodeService('test-slug');
        expect(result).toEqual(mockData);
        expect(apiClient.get).toHaveBeenCalledWith('podcasts/test-slug/episode/random');
    });

    it('should handle errors correctly', async () => {
        const mockError = new Error('Network Error');
        apiClient.get.mockRejectedValue(mockError);

        try {
            await getRandomEpisodeService('test-slug');
        } catch (error) {
            expect(error).toEqual(mockError);
        }

        expect(apiClient.get).toHaveBeenCalledWith('podcasts/test-slug/episode/random');
    });
});
