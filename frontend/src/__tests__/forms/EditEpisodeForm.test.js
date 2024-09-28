import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import EditEpisodeForm from '@/pages/creator/_forms/EditEpisodeForm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import '@testing-library/jest-dom'
import mockRouter from 'next-router-mock';
import toast from 'react-hot-toast';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('react-hot-toast');

const mockUsePatchEditEpisodeFormHook = jest.fn();
jest.mock('../../pages/creator/_hooks/usePatchEditEpisodeFormHook', () => ({
    __esModule: true,
    default: () => mockUsePatchEditEpisodeFormHook(),
}));

function setup(episode, status = 200, isPutLoading = false, error = null) {
    mockRouter.push = jest.fn(); // Mock push function
    mockUsePatchEditEpisodeFormHook.mockReturnValue({ status, isPutLoading, error });

    return render(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <EditEpisodeForm episode={episode} />
        </LocalizationProvider>
    );
}

describe('EditEpisodeForm', () => {
    let episode;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        episode = {
            episode: {
                id: '123',
                title: 'Initial Title',
                published_date: '2023-10-12T00:00:00Z',
                exclusive: false,
                private_video: true,
                is_draft: true,
            },
            transcript: 'Initial Transcript'
        };
    });

    test('renders form correctly', () => {
        setup(episode);

        expect(screen.getByLabelText('Episode Title')).toHaveValue('Initial Title');
        expect(screen.getByLabelText('Published Date')).toBeInTheDocument();
        expect(screen.getByLabelText('Paid Exclusive')).not.toBeChecked();
        expect(screen.getByLabelText('Publicly Available')).not.toBeChecked();
        expect(screen.getByLabelText('Draft')).toBeChecked();
    });

    test('submits form with changed data', async () => {
        setup(episode);

        fireEvent.change(screen.getByLabelText('Episode Title'), { target: { value: 'Updated Title' } });
        fireEvent.click(screen.getByLabelText('Paid Exclusive'));
        fireEvent.click(screen.getByLabelText('Publicly Available'));
        fireEvent.click(screen.getByLabelText('Draft'));

        fireEvent.submit(screen.getByTestId('save-button'));

        act(() => jest.runAllTimers());

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Episode updated!'));
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/creator/dashboard/episodes'));
    });

    test('submits form without changes', async () => {
        setup(episode);

        fireEvent.submit(screen.getByTestId('save-button'));

        act(() => jest.runAllTimers());

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Episode updated!'));
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/creator/dashboard/episodes'));
    });

    test('handles server error', async () => {
        const errorResponse = { response: { data: { title: 'Title error' } } };
        setup(episode, 400, false, errorResponse);

        fireEvent.change(screen.getByLabelText('Episode Title'), { target: { value: 'Updated Title' } });
        fireEvent.submit(screen.getByTestId('save-button'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('title - Title error'));
    });
});
