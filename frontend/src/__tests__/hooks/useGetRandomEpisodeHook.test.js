import getRandomEpisodeService from '@/api/getRandomEpisodeService';

jest.mock('../../api/getRandomEpisodeService');

describe('getRandomEpisodeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch episode data successfully', async () => {
        const mockEpisodeData = { id: '1', name: 'Test Episode' };
        getRandomEpisodeService.mockResolvedValueOnce(mockEpisodeData);

        const slug = 'test-slug';
        const result = await getRandomEpisodeService(slug);

        expect(getRandomEpisodeService).toHaveBeenCalledWith(slug);
        expect(result).toEqual(mockEpisodeData);
    });

    it('should handle errors while fetching episode data', async () => {
        const slug = 'test-slug';
        const errorMessage = 'Error fetching episode';
        getRandomEpisodeService.mockRejectedValueOnce(new Error(errorMessage));

        await expect(getRandomEpisodeService(slug)).rejects.toThrowError(errorMessage);
    });
});

