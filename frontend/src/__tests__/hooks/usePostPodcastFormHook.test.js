import React from 'react';
import { render, waitFor } from '@testing-library/react';
import usePostPodcastFormHook from '@/pages/creator/_hooks/usePostPodcastFormHook';
import { postPodcastFormService } from '@/api/podcastServices';

jest.mock('../../api/podcastServices', () => ({
    postPodcastFormService: jest.fn()
}));

describe('usePostPodcastFormHook', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const TestComponent = ({ formData }) => {
        const { response, status, isLoading, error } = usePostPodcastFormHook(formData);
        return (
            <div>
                <div data-testid="response">{JSON.stringify(response)}</div>
                <div data-testid="status">{status}</div>
                <div data-testid="isLoading">{String(isLoading)}</div>
                <div data-testid="error">{JSON.stringify(error)}</div>
            </div>
        );
    };

    it('should fetch data successfully', async () => {
        const mockResponse = { data: { success: true }, status: 200 };
        postPodcastFormService.mockResolvedValueOnce(mockResponse);

        const formData = { title: 'My Podcast' };
        const { getByTestId } = render(<TestComponent formData={formData} />);

        await waitFor(() => {
            expect(getByTestId('response').textContent).toBe(JSON.stringify(mockResponse.data),);
            expect(getByTestId('status').textContent).toBe(String(mockResponse.status));
            expect(getByTestId('isLoading').textContent).toBe('true');
            expect(getByTestId('error').textContent).toBe('null');
        });
    });

    it('should handle errors', async () => {
        const mockError = new Error('Network Error');
        postPodcastFormService.mockRejectedValueOnce(mockError);

        const formData = { title: 'My Failed Podcast' };
        const { getByTestId } = render(<TestComponent formData={formData} />);

        await waitFor(() => {
            expect(getByTestId('response').textContent).toBe('[]');
            expect(getByTestId('status').textContent).toBe('');
            expect(getByTestId('isLoading').textContent).toBe('false')
            expect(getByTestId('error').textContent).toBe(JSON.stringify(mockError))
        });
    });

    it('should not call service if no formData is provided', () => {
        render(<TestComponent formData={null} />);
        expect(postPodcastFormService).not.toHaveBeenCalled();
    });
});
