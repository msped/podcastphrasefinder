import { render, waitFor } from '@testing-library/react';
import usePatchEditEpisodeFormHook from '@/pages/creator/_hooks/usePatchEditEpisodeFormHook';
import { patchEditEpisodeFormService } from '@/api/episodeServices';

jest.mock('../../api/episodeServices', () => ({
    patchEditEpisodeFormService: jest.fn(),
}));

const TestComponent = ({ episodeId, formData }) => {
    const { status, isPutLoading, error } = usePatchEditEpisodeFormHook(episodeId, formData);

    return (
        <div>
            <div data-testid="status">{status}</div>
            <div data-testid="isPutLoading">{isPutLoading.toString()}</div>
            <div data-testid="error">{error?.message}</div>
        </div>
    );
};

describe('usePatchEditEpisodeFormHook', () => {
    const episodeId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initially set isPutLoading to false and status to null', () => {
        const { getByTestId } = render(<TestComponent episodeId={episodeId} />);
        expect(getByTestId('isPutLoading').textContent).toBe('false');
        expect(getByTestId('status').textContent).toBe('');
    });

    it('should update episode data when formData is provided', async () => {
        const formData = { title: 'Updated Title' };
        const mockResponse = { status: 200 };
        patchEditEpisodeFormService.mockResolvedValueOnce(mockResponse);

        const { getByTestId } = render(<TestComponent episodeId={episodeId} formData={formData} />);

        await waitFor(() => expect(getByTestId('isPutLoading').textContent).toBe('true'));
        await waitFor(() => expect(getByTestId('status').textContent).toBe('200'));
        await waitFor(() => expect(getByTestId('isPutLoading').textContent).toBe('false'));
    });

    it('should handle errors when updating episode data', async () => {
        const formData = { title: 'Updated Title' };
        const mockError = new Error('Failed to update episode');
        patchEditEpisodeFormService.mockRejectedValueOnce(mockError);

        const { getByTestId } = render(<TestComponent episodeId={episodeId} formData={formData} />);

        await waitFor(() => expect(getByTestId('isPutLoading').textContent).toBe('false'));
        await waitFor(() => expect(getByTestId('error').textContent).toBe(mockError.message));
    });
});
