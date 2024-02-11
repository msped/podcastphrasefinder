import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YouTubeUrlField from '@/components/YouTubeUrlField';
import '@testing-library/jest-dom';
import usePostYouTubeUrlHook from '@/hooks/usePostYouTubeUrlHook';

jest.mock('../../hooks/usePostYouTubeUrlHook');

describe('YouTubeUrlField', () => {
    const handleIsButtonDisabled = jest.fn();
    const handleTranscriptText = jest.fn();
    const handleTranscriptError = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render loading spinner when isLoading is true', () => {
        usePostYouTubeUrlHook.mockReturnValue({
            isLoading: true,
            transcript: { error: false},
            status: null
        });

        const { getByTestId } = render(
            <YouTubeUrlField
                handleIsButtonDisabled={handleIsButtonDisabled}
                handleTranscriptText={handleTranscriptText}
                handleTranscriptError={handleTranscriptError}
            />
        );

        const urlInput = getByTestId("youtube-url")
        userEvent.type(urlInput, "https://www.youtube.com/watch?v=test1234")

        waitFor(() => {
            expect(getByTestId('loading-spinner')).toBeInTheDocument();
        })
    });

    it('should display error icon and set helper text if there is an error in the transcript', async () => {
        usePostYouTubeUrlHook.mockReturnValue({
            isLoading: false,
            transcript: { error: true },
            status: null
        });

        const { getByTestId, getByText } = render(
            <YouTubeUrlField
                handleIsButtonDisabled={handleIsButtonDisabled}
                handleTranscriptText={handleTranscriptText}
                handleTranscriptError={handleTranscriptError}
            />
        );

        expect(getByTestId('CancelOutlinedIcon')).toBeInTheDocument();
        expect(getByText(/There was an error with this transcript./i)).toBeInTheDocument();
    });

    it('should indicate success when status is 200', () => {
        usePostYouTubeUrlHook.mockReturnValue({
            isLoading: false,
            transcript: {},
            status: 200
        });

        const { getByTestId } = render(
            <YouTubeUrlField
                handleIsButtonDisabled={handleIsButtonDisabled}
                handleTranscriptText={handleTranscriptText}
                handleTranscriptError={handleTranscriptError}
            />
        );

        expect(getByTestId('CheckCircleOutlineIcon')).toBeInTheDocument();
    });

    it('should disable button and show warning when status is 226', () => {
        usePostYouTubeUrlHook.mockReturnValue({
        isLoading: false,
        transcript: {},
        status: 226
        });

        const { getByText} = render(
            <YouTubeUrlField
                handleIsButtonDisabled={handleIsButtonDisabled}
                handleTranscriptText={handleTranscriptText}
                handleTranscriptError={handleTranscriptError}
            />
        );

        expect(handleIsButtonDisabled).toHaveBeenCalledWith(true);
        expect(handleTranscriptError).toHaveBeenCalled();
        expect(getByText(/This episode is already exists./i)).toBeInTheDocument();
    });

    it('should call handleTranscriptText with transcript text on successful load', () => {
        const mockTranscript = { text: 'Sample transcript text.' };
        usePostYouTubeUrlHook.mockReturnValue({
            isLoading: false,
            transcript: mockTranscript,
            status: 200
        });

        render(
            <YouTubeUrlField
                handleIsButtonDisabled={handleIsButtonDisabled}
                handleTranscriptText={handleTranscriptText}
                handleTranscriptError={handleTranscriptError}
            />
        );

        expect(handleTranscriptText).toHaveBeenCalledWith(mockTranscript.text);
    });
});
