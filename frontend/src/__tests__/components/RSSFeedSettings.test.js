import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RSSFeedSettings from '@/pages/creator/_components/RSSFeedSettings';
import { useGetFeedsHook, useGetEpisodeReleaseDaysHook } from '@/hooks/podcastHooks';
import {
    postFeedService,
    deleteFeedService,
    postEpisodeReleaseDaysService,
    deleteEpisodeReleaseDaysService,
} from '@/api/podcastServices';
import toast from 'react-hot-toast';

jest.mock('../../hooks/podcastHooks', () => ({
    useGetFeedsHook: jest.fn(),
    useGetEpisodeReleaseDaysHook: jest.fn(),
}));
jest.mock('../../api/podcastServices', () => ({
    postFeedService: jest.fn(),
    deleteFeedService: jest.fn(),
    postEpisodeReleaseDaysService: jest.fn(),
    deleteEpisodeReleaseDaysService: jest.fn(),
}));
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

const mockPodcast = {
    slug: 'test-podcast',
    id: 1,
};

const mockFeedsData = [
    { id: 1, rss_feed_url: 'http://feed1.com/rss' },
    { id: 2, rss_feed_url: 'http://feed2.com/rss' },
];

const mockReleaseDaysData = [
    { id: 10, day: 1 }, // Monday
    { id: 11, day: 3 }, // Wednesday
];

describe('RSSFeedSettings Component', () => {
    let mockSetFeeds;
    let mockSetReleaseDays;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSetFeeds = jest.fn();
        mockSetReleaseDays = jest.fn();

        useGetFeedsHook.mockReturnValue({
            feeds: [],
            isLoading: false,
            setFeeds: mockSetFeeds,
        });
        useGetEpisodeReleaseDaysHook.mockReturnValue({
            releaseDays: [],
            isLoading: false,
            setReleaseDays: mockSetReleaseDays,
        });
    });

    const renderComponent = (podcast = mockPodcast) => {
        return render(<RSSFeedSettings podcast={podcast} />);
    };

    describe('Loading States', () => {
        test('should display skeletons when feeds are loading', () => {
            useGetFeedsHook.mockReturnValueOnce({
                feeds: [],
                isLoading: true,
                setFeeds: mockSetFeeds,
            });
            renderComponent();
            expect(screen.getByText('RSS Feed Settings')).toBeInTheDocument();
            expect(screen.getAllByRole('progressbar', { hidden: true })).toHaveLength(3); // MUI Skeleton uses progressbar role
        });

        test('should display skeletons when release days are loading', () => {
            useGetEpisodeReleaseDaysHook.mockReturnValueOnce({
                releaseDays: [],
                isLoading: true,
                setReleaseDays: mockSetReleaseDays,
            });
            renderComponent();
            expect(screen.getByText('RSS Feed Settings')).toBeInTheDocument();
            expect(screen.getAllByRole('progressbar', { hidden: true })).toHaveLength(3);
        });
    });

    describe('Initial Render without data', () => {
        test('should render titles and add feed input if no feeds', () => {
            renderComponent();
            expect(screen.getByText('Manage RSS Feed')).toBeInTheDocument();
            expect(screen.getByLabelText('RSS Feed URL')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Add Feed/i })).toBeInTheDocument();
            expect(screen.getByText('Manage Release Days')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Add Release Day/i })).toBeInTheDocument();
        });
    });

    describe('RSS Feed Management', () => {
        beforeEach(() => {
            useGetFeedsHook.mockReturnValue({
                feeds: [],
                isLoading: false,
                setFeeds: mockSetFeeds,
            });
        });

        test('should display existing feeds', () => {
            useGetFeedsHook.mockReturnValueOnce({
                feeds: mockFeedsData,
                isLoading: false,
                setFeeds: mockSetFeeds,
            });
            renderComponent();
            expect(screen.getByText(mockFeedsData[0].rss_feed_url)).toBeInTheDocument();
            expect(screen.getByText(mockFeedsData[1].rss_feed_url)).toBeInTheDocument();
            expect(screen.queryByLabelText('RSS Feed URL')).not.toBeInTheDocument();
        });

        test('should add a new feed successfully', async () => {
            const newFeedUrl = 'http://newfeed.com/rss';
            const newFeedResponse = { id: 3, rss_feed_url: newFeedUrl };
            postFeedService.mockResolvedValueOnce(newFeedResponse);

            renderComponent();

            fireEvent.change(screen.getByLabelText('RSS Feed URL'), { target: { value: newFeedUrl } });
            fireEvent.click(screen.getByRole('button', { name: /Add Feed/i }));

            await waitFor(() => {
                expect(postFeedService).toHaveBeenCalledWith(mockPodcast, newFeedUrl);
            });
            expect(mockSetFeeds).toHaveBeenCalledWith(expect.any(Function));

            act(() => {
                const setStateFunc = mockSetFeeds.mock.calls[0][0];
                setStateFunc([]);
            });
            expect(toast.success).toHaveBeenCalledWith('RSS feed added');
        });

        test('should show error toast if adding feed fails', async () => {
            const newFeedUrl = 'http://newfeed.com/rss';
            const errorMessage = 'Failed to add feed';
            postFeedService.mockRejectedValueOnce(new Error(errorMessage));

            renderComponent();

            fireEvent.change(screen.getByLabelText('RSS Feed URL'), { target: { value: newFeedUrl } });
            fireEvent.click(screen.getByRole('button', { name: /Add Feed/i }));

            await waitFor(() => {
                expect(postFeedService).toHaveBeenCalledWith(mockPodcast, newFeedUrl);
            });
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
            expect(mockSetFeeds).not.toHaveBeenCalled();
        });
        
        test('add feed button should be disabled if URL is empty', () => {
            renderComponent();
            const addButton = screen.getByRole('button', { name: /Add Feed/i });
            expect(addButton).toBeDisabled();
            fireEvent.change(screen.getByLabelText('RSS Feed URL'), { target: { value: '  ' } });
            expect(addButton).toBeDisabled();
            fireEvent.change(screen.getByLabelText('RSS Feed URL'), { target: { value: 'http://feed.com' } });
            expect(addButton).not.toBeDisabled();
        });

        test('should delete a feed successfully', async () => {
            useGetFeedsHook.mockReturnValueOnce({
                feeds: [mockFeedsData[0]],
                isLoading: false,
                setFeeds: mockSetFeeds,
            });
            deleteFeedService.mockResolvedValueOnce({});

            renderComponent();

            expect(screen.getByText(mockFeedsData[0].rss_feed_url)).toBeInTheDocument();
            const deleteButton = screen.getByTestId('delete-feed');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(deleteFeedService).toHaveBeenCalledWith(mockPodcast.slug, mockFeedsData[0].id);
            });
            expect(mockSetFeeds).toHaveBeenCalledWith(expect.any(Function));
            act(() => {
                const setStateFunc = mockSetFeeds.mock.calls[0][0];
                setStateFunc([mockFeedsData[0]]);
            });
            expect(toast.success).toHaveBeenCalledWith('RSS Feed removed.');
        });

        test('should show error toast if deleting feed fails', async () => {
            useGetFeedsHook.mockReturnValueOnce({
                feeds: [mockFeedsData[0]],
                isLoading: false,
                setFeeds: mockSetFeeds,
            });
            const errorMessage = 'Failed to delete feed';
            deleteFeedService.mockRejectedValueOnce(new Error(errorMessage));
            
            renderComponent();
            const deleteButton = screen.getByTestId('delete-feed');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(deleteFeedService).toHaveBeenCalledWith(mockPodcast.slug, mockFeedsData[0].id);
            });
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
            expect(mockSetFeeds).not.toHaveBeenCalled();
        });
    });

    describe('Release Day Management', () => {
        beforeEach(() => {
            useGetEpisodeReleaseDaysHook.mockReturnValue({
                releaseDays: [],
                isLoading: false,
                setReleaseDays: mockSetReleaseDays,
            });
        });

        test('should display existing release days', () => {
            useGetEpisodeReleaseDaysHook.mockReturnValueOnce({
                releaseDays: mockReleaseDaysData,
                isLoading: false,
                setReleaseDays: mockSetReleaseDays,
            });
            renderComponent();
            expect(screen.getByText('Monday')).toBeInTheDocument();
            expect(screen.getByText('Wednesday')).toBeInTheDocument();
        });

        test('should open popover on "Add Release Day" click', () => {
            renderComponent();
            fireEvent.click(screen.getByRole('button', { name: /Add Release Day/i }));
            expect(screen.getByText('Sunday')).toBeVisible();
            expect(screen.getByText('Everyday')).toBeVisible();
        });

        test('should add a new release day successfully', async () => {
            const newDayValue = 0;
            const newDayResponse = { id: 12, day: newDayValue };
            postEpisodeReleaseDaysService.mockResolvedValueOnce(newDayResponse);

            renderComponent();
            fireEvent.click(screen.getByRole('button', { name: /Add Release Day/i }));
            
            const sundayOption = screen.getByText('Sunday');
            fireEvent.click(sundayOption);

            await waitFor(() => {
                expect(postEpisodeReleaseDaysService).toHaveBeenCalledWith(mockPodcast, newDayValue);
            });
            expect(mockSetReleaseDays).toHaveBeenCalledWith(expect.any(Function));
            act(() => {
                const setStateFunc = mockSetReleaseDays.mock.calls[0][0];
                setStateFunc([]);
            });
            expect(toast.success).toHaveBeenCalledWith('Release day added');
            // Popover should close
            await waitFor(() => {
                expect(screen.queryByText('Sunday')).not.toBeVisible();
            });
        });


        test('should show error toast if adding release day fails', async () => {
            const newDayValue = 0;
            const errorMessage = 'Failed to add day';
            postEpisodeReleaseDaysService.mockRejectedValueOnce(new Error(errorMessage));

            renderComponent();
            fireEvent.click(screen.getByRole('button', { name: /Add Release Day/i }));
            fireEvent.click(screen.getByText('Sunday'));

            await waitFor(() => {
                expect(postEpisodeReleaseDaysService).toHaveBeenCalledWith(mockPodcast, newDayValue);
            });
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
            expect(mockSetReleaseDays).not.toHaveBeenCalled();
        });

        test('should remove a release day successfully', async () => {
            const dayToRemove = mockReleaseDaysData[0];
            useGetEpisodeReleaseDaysHook.mockReturnValueOnce({
                releaseDays: [dayToRemove],
                isLoading: false,
                setReleaseDays: mockSetReleaseDays,
            });
            deleteEpisodeReleaseDaysService.mockResolvedValueOnce({});

            renderComponent();
            expect(screen.getByText('Monday')).toBeInTheDocument();
            
            const chipElement = screen.queryByRole('button', { name: /monday/i });
            fireEvent.click(chipElement.querySelector('svg'));

            await waitFor(() => {
                expect(deleteEpisodeReleaseDaysService).toHaveBeenCalledWith(mockPodcast, dayToRemove);
            });
            expect(mockSetReleaseDays).toHaveBeenCalledWith(expect.any(Function));
            act(() => {
                const setStateFunc = mockSetReleaseDays.mock.calls[0][0];
                setStateFunc([dayToRemove]);
            });
            expect(toast.success).toHaveBeenCalledWith('Release day removed');
        });

        test('should show error toast if removing release day fails', async () => {
            const dayToRemove = mockReleaseDaysData[0];
            useGetEpisodeReleaseDaysHook.mockReturnValueOnce({
                releaseDays: [dayToRemove],
                isLoading: false,
                setReleaseDays: mockSetReleaseDays,
            });
            const errorMessage = 'Failed to remove day';
            deleteEpisodeReleaseDaysService.mockRejectedValueOnce(new Error(errorMessage));

            renderComponent();

            const chipElement = screen.queryByRole('button', { name: /monday/i });
            fireEvent.click(chipElement.querySelector('svg'));

            await waitFor(() => {
                expect(deleteEpisodeReleaseDaysService).toHaveBeenCalledWith(mockPodcast, dayToRemove);
            });
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
            expect(mockSetReleaseDays).not.toHaveBeenCalled();
        });
    });
});
