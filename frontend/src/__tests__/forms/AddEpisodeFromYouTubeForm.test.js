import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddEpisodeFromYouTubeForm from '@/forms/AddEpisodeFromYouTubeForm';
import mockRouter from 'next-router-mock';
import '@testing-library/jest-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('../../hooks/usePostAddYouTubeFormHook', () => jest.fn());

jest.mock('../../components/YouTubeUrlField', () => () => <input data-testid="youtube-url-field" />);
jest.mock('../../components/LoadingSpinner', () => () => <div>Loading...</div>);
jest.mock("@mui/x-date-pickers/DateTimePicker", () => {
    return {
        DateTimePicker: jest.requireActual("@mui/x-date-pickers/DesktopDatePicker").DesktopDatePicker,
    };
});

describe('<AddEpisodeFromYouTubeForm />', () => {
    const mockUsePostAddYouTubeFormHook = require('../../hooks/usePostAddYouTubeFormHook');

    beforeEach(() => {
        // Reset mocks before each test
        mockRouter.push('/');
        mockUsePostAddYouTubeFormHook.mockImplementation(() => ({
            status: null,
            isLoading: false,
            error: null,
        }));
    });

    it('renders the form elements correctly', () => {
        const { getByLabelText, getByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AddEpisodeFromYouTubeForm />
            </LocalizationProvider>
        );
        expect(getByLabelText(/episode title/i)).toBeInTheDocument();
        expect(getByLabelText(/published date/i)).toBeInTheDocument();
        expect(getByLabelText(/exclusive episode/i)).toBeInTheDocument();
        expect(getByTestId(/youtube-url-field/i)).toBeInTheDocument();
    });

    it('submits correct form data when filled in', async () => {
        mockUsePostAddYouTubeFormHook.mockReturnValueOnce({
            status: 200,
            isLoading: true,
            error: null,
        })
        const fakeData = {
            youtubeUrl: 'https://www.test.com/transcript',
            title: 'Test Episode',
            transcript: 'This is a sample transcript.',
            published_date: '2024-03-01',
        };

        const { getByLabelText, getByRole, getByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AddEpisodeFromYouTubeForm />
            </LocalizationProvider>
        );
        const submitButton = getByRole('button', { name: /submit/i });
        
        const youtubeUrlInput = getByTestId(/youtube-url-field/i)
        const titleInput = getByLabelText(/episode title/i);
        const transcriptTextarea = getByLabelText(/transcript/i);
        const transcriptDatePicker = getByLabelText(/choose date/i)

        userEvent.type(youtubeUrlInput, fakeData.youtubeUrl);
        userEvent.type(titleInput, fakeData.title);
        userEvent.type(transcriptTextarea, fakeData.transcript);
        fireEvent.change(transcriptDatePicker, {target: { value: fakeData.published_date}});

        await waitFor(() => {
            userEvent.click(submitButton);
        })
        waitFor(() => {
            expect(submitButton).toBeDisabled();
        })
        expect(mockRouter).toMatchObject({
            pathname: '/dashboard',
        })
    });

    it('Show toast with error on bad request', async () => {
        mockUsePostAddYouTubeFormHook.mockReturnValueOnce({
            status: 400,
            isLoading: true,
            error: {
                response: {
                    data: {
                        channel_id: 'must not be null.'
                    }
                }
            },
        })
        const fakeData = {
            youtubeUrl: 'https://www.test.com/transcript',
            title: 'Test Episode',
            transcript: 'This is a sample transcript.',
            published_date: '2024-03-01',
        };

        const { getByLabelText, getByRole, getByTestId, getByText} = render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AddEpisodeFromYouTubeForm />
            </LocalizationProvider>
        );
        const submitButton = getByRole('button', { name: /submit/i });
        
        const youtubeUrlInput = getByTestId(/youtube-url-field/i)
        const titleInput = getByLabelText(/episode title/i);
        const transcriptTextarea = getByLabelText(/transcript/i);
        const transcriptDatePicker = getByLabelText(/choose date/i)

        userEvent.type(youtubeUrlInput, fakeData.youtubeUrl);
        userEvent.type(titleInput, fakeData.title);
        userEvent.type(transcriptTextarea, fakeData.transcript);
        fireEvent.change(transcriptDatePicker, {target: { value: fakeData.published_date}});

        await waitFor(() => {
            userEvent.click(submitButton);
        })

        waitFor(() => {
            expect(getByText(/must not be null/i)).toBeInTheDocument();
        })
    });
});

