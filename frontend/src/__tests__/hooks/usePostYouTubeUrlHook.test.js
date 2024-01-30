import React from 'react';
import { render, waitFor } from '@testing-library/react';
import postYouTubeUrlService from '@/api/postYouTubeUrlService';
import usePostYouTubeUrlHook from '@/hooks/usePostYouTubeUrlHook';
import '@testing-library/jest-dom';

function TestComponent({ url }) {
    const { transcript, status, isLoading } = usePostYouTubeUrlHook(url);
    return (
        <div>
            <div data-testid="transcript">{JSON.stringify(transcript)}</div>
            <div data-testid="status">{status}</div>
            <div data-testid="isLoading">{isLoading.toString()}</div>
        </div>
    );
}

jest.mock('../../api/postYouTubeUrlService', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('TestComponent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch and set transcript, status when url is provided', async () => {
        const mockData = { id: 1, title: 'Test Transcript' };
        postYouTubeUrlService.mockResolvedValue({ data: mockData, status: 200 });

        const { getByTestId } = render(<TestComponent url="http://youtube.com/test-video" />);

        expect(getByTestId('isLoading')).toHaveTextContent('true');

        await waitFor(() => {
            expect(postYouTubeUrlService).toHaveBeenCalledWith('http://youtube.com/test-video');
            expect(getByTestId('transcript')).toHaveTextContent(JSON.stringify(mockData));
            expect(getByTestId('status')).toHaveTextContent('200');
            expect(getByTestId('isLoading')).toHaveTextContent('false');
        });
    });

    it('should not fetch data when url is empty', async () => {
        render(<TestComponent url="" />);
        
        expect(postYouTubeUrlService).not.toHaveBeenCalled();
    });
});
