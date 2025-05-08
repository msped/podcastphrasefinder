import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PodcastSettings from '@/pages/creator/_components/PodcastSettings';
import { usePatchPodcastHook } from '@/hooks/podcastHooks';
import '@testing-library/jest-dom';

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

jest.mock('../../hooks/podcastHooks', () => ({
    usePatchPodcastHook: jest.fn(),
}));

const mockPodcast = {
    slug: 'test-podcast',
    name: 'Test Podcast',
    avatar: 'https://example.com/avatar.jpg',
};

describe('PodcastSettings Component', () => {
    window.URL.createObjectURL = jest.fn();

    beforeEach(() => {
        usePatchPodcastHook.mockReturnValue({
            status: null,
            isLoading: false,
            error: null,
        });

        window.URL.createObjectURL.mockReturnValue('https://example.com/avatar.jpg');
    });

    it('renders podcast information correctly', () => {
        render(<PodcastSettings podcast={mockPodcast} />);
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
        expect(screen.getByAltText('Thumbnail')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('opens the dialog when upload button is clicked', () => {
        render(<PodcastSettings podcast={mockPodcast} />);
        const uploadButton = screen.getByRole('button', { name: '' });
        fireEvent.click(uploadButton);
        expect(screen.getByText('Upload a new avatar')).toBeVisible();
    });

    it('closes the dialog when cancel button is clicked', () => {
        render(<PodcastSettings podcast={mockPodcast} />);
        const uploadButton = screen.getByRole('button', { name: '' });
        fireEvent.click(uploadButton);
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        waitFor(() => {
            expect(screen.queryByText('Upload a new avatar')).not.toBeInTheDocument();
        });
    });

    it('updates avatar preview when a file is selected', () => {
        render(<PodcastSettings podcast={mockPodcast} />);
        const fileInput = screen.getByRole('button', { name: '' });
        const mockFile = new File(['testimage'], 'test-image.jpg', { type: 'image/jpeg' });
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
        expect(screen.getByRole('img', { name: 'Thumbnail' })).toHaveAttribute('src', mockPodcast.avatar);
    });

    it('calls usePatchPodcastHook on form submit', async () => {
        const mockFile = new File(['testimage'], 'test-image.jpg', { type: 'image/jpeg' })

        render(<PodcastSettings podcast={mockPodcast} />);
        const uploadButton = screen.getByRole('button', { name: '' });
        fireEvent.click(uploadButton);

        await waitFor(() => {
            expect(screen.getByText('Upload a new avatar')).toBeVisible();
        })

        const fileInput = screen.getByRole('button', { name: '' });
        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);

        expect(usePatchPodcastHook).toHaveBeenCalled();
    });

    it('displays success toast on successful update', async () => {
        usePatchPodcastHook.mockReturnValue({
            status: 200,
            isLoading: false,
            error: null,
        });

        render(<PodcastSettings podcast={mockPodcast} />);
        const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);

        expect(require('react-hot-toast').success).toHaveBeenCalledWith('Avatar updated!');
    });

    it('displays error toast for each error message', async () => {
        usePatchPodcastHook.mockReturnValue({
            status: 400,
            isLoading: false,
            error: {
                response: {
                    data: {
                        name: ['Name is required'],
                        avatar: ['Invalid avatar format'],
                    },
                },
            },
        });

        render(<PodcastSettings podcast={mockPodcast} />);
        const saveButton = screen.getByLabelText('submit changes'); // yes it's different from
        // the above test, mainly because no file here means that the button is disabled.
        fireEvent.click(saveButton);

        expect(require('react-hot-toast').error).toHaveBeenCalledWith('name - Name is required');
        expect(require('react-hot-toast').error).toHaveBeenCalledWith('avatar - Invalid avatar format');
    });
});
