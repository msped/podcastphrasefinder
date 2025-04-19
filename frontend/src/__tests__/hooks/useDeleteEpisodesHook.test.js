import { deleteEpisodesService } from '@/api/episodeServices';

jest.mock('../../api/episodeServices', () => ({ 
    deleteEpisodesService: jest.fn(),
}));

describe('deleteEpisodesService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete episodes successfully', async () => {
        const mockResponse = { status: 204 }; 
        deleteEpisodesService.mockResolvedValue(mockResponse);

        const episodeId = 1;
        const response = await deleteEpisodesService(episodeId);

        expect(deleteEpisodesService).toHaveBeenCalledWith(episodeId);
        expect(response).toEqual(mockResponse);
    });

    it('should handle errors when deleting episodes', async () => {
        const mockError = new Error('Failed to delete episodes');
        deleteEpisodesService.mockRejectedValue(mockError);

        const episodeId = 1; 
        
        await expect(deleteEpisodesService(episodeId)).rejects.toThrowError(mockError);
        expect(deleteEpisodesService).toHaveBeenCalledWith(episodeId);
    });
});
