import { render, waitFor, fireEvent } from '@testing-library/react';
import useGetEpisodeHook from '@/pages/creator/_hooks/useGetEpisodeHook';
import { getEpisodeService } from "@/api/episodeServices";


jest.mock('../../api/episodeServices', () => ({
    getEpisodeService: jest.fn(),
}));

const TestComponent = () => {
    const { episode, isLoading, error, setEpisodeId } = useGetEpisodeHook();

    return (
        <div>
            <div data-testid="episode">{JSON.stringify(episode)}</div>
            <div data-testid="isLoading">{isLoading.toString()}</div>
            <div data-testid="error">{error}</div>
            <button onClick={() => setEpisodeId(1)}>Fetch Episode</button>
        </div>
    );
};

describe('useGetEpisodeHook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initially set isLoading to true and episode to null', () => {
        const { getByTestId } = render(<TestComponent />);
        waitFor(() => expect(getByTestId('isLoading').textContent).toBe('true'));
        expect(getByTestId('episode').textContent).toBe('null');
    });

    it('should fetch episode data when episodeId is set', async () => {
        const mockEpisodeData = { id: 1, title: 'Test Episode' };
        getEpisodeService.mockResolvedValueOnce(mockEpisodeData);

        const { getByTestId, getByText } = render(<TestComponent />);

        const button = getByText('Fetch Episode');
        fireEvent.click(button);

        expect(getByTestId('isLoading').textContent).toBe('true');

        await waitFor(() => {
            expect(getEpisodeService).toHaveBeenCalledWith(1);
            expect(getByTestId('episode').textContent).toBe(JSON.stringify(mockEpisodeData));
            expect(getByTestId('isLoading').textContent).toBe('false');
            expect(getByTestId('error').textContent).toBe('');
        });
    });

    it('should handle errors when fetching episode data', async () => {
        const mockError = new Error('Failed to fetch episode');
        getEpisodeService.mockRejectedValueOnce(mockError);

        const { getByTestId, getByText } = render(<TestComponent />);

        const button = getByText('Fetch Episode');
        fireEvent.click(button);

        await waitFor(() => {
            expect(getEpisodeService).toHaveBeenCalledWith(1);
            expect(getByTestId('isLoading').textContent).toBe('false');
            expect(getByTestId('error').textContent).toBe(mockError.message);
        });
    });
});
