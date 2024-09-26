import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import TranscriptDialog from '@/pages/creator/_components/TranscriptDialog';

describe('TranscriptDialog', () => {
    test('renders the dialog closed initially', () => {
        render(<TranscriptDialog transcript="" setTranscript={() => {}} />);
        const dialog = screen.queryByRole('dialog');
        expect(dialog).not.toBeInTheDocument();
    });

    test('opens the dialog when edit button is clicked', () => {
        render(<TranscriptDialog transcript="" setTranscript={() => {}} />);
        const editButton = screen.getByText('Edit Transcript');
        fireEvent.click(editButton);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeVisible();
    });

    test('closes the dialog when close button is clicked', async () => {
        render(<TranscriptDialog transcript="" setTranscript={() => {}} />);
        const editButton = screen.getByText('Edit Transcript');
        fireEvent.click(editButton);
        const closeButton = screen.getByLabelText('close');
        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        })
    });

    test('updates transcript state when text field value changes', () => {
        const setTranscriptMock = jest.fn();
        render(<TranscriptDialog transcript="Initial transcript" setTranscript={setTranscriptMock} />);
        const editButton = screen.getByText('Edit Transcript');
        fireEvent.click(editButton);
        const transcriptTextField = screen.getByRole('textbox');
        fireEvent.change(transcriptTextField, { target: { value: 'Updated transcript' } });
        expect(setTranscriptMock).toHaveBeenCalledWith('Updated transcript');
    });
});
