import React from 'react';
import { render, waitFor } from '@testing-library/react';
import usePostAddYouTubeFormHook from '@/hooks/usePostAddYouTubeFormHook';
import postAddYouTubeFormService from '@/api/postAddYouTubeFormService';

jest.mock('../../api/postAddYouTubeFormService', () => jest.fn());

const TestComponent = ({ formData }) => {
    const { status, isLoading, error } = usePostAddYouTubeFormHook(formData);

    return (
        <div>
            <div data-testid="status">{status}</div>
            <div data-testid="isLoading">{isLoading.toString()}</div>
            <div data-testid="error">{error?.message}</div>
        </div>
    );
};

describe('usePostAddYouTubeFormHook in a component', () => {

    it('should initially have isLoading set to false', () => {
        const { getByTestId } = render(<TestComponent />);

        expect(getByTestId('isLoading').textContent).toBe('false');
        expect(getByTestId('status').textContent).toBe('');
        expect(getByTestId('error').textContent).toBe('');
    });

    it('should set isLoading to true when formData is provided and request is successful', async () => {
        const mockFormData = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
        const mockResponse = { status: 200 };

        postAddYouTubeFormService.mockResolvedValueOnce(mockResponse);
        
        const { getByTestId } = render(<TestComponent formData={mockFormData} />);

        await waitFor(() => expect(getByTestId('isLoading').textContent).toBe('true'));

        expect(getByTestId('status').textContent).toEqual(mockResponse.status.toString());
        expect(getByTestId('error').textContent).toBe('');
    });

    it('should handle errors correctly and set isLoading to false', async () => {
        const mockFormData = { url: 'invalid-url' };
        const mockError = new Error('Invalid URL');

        postAddYouTubeFormService.mockRejectedValueOnce(mockError);

        const { getByTestId } = render(<TestComponent formData={mockFormData} />);

        await waitFor(() => expect(getByTestId('isLoading').textContent).toBe('false'));

        await waitFor(() => {
            expect(getByTestId('error').textContent).toEqual(mockError.message);
        });

        await waitFor(() => {
            const errorNode = getByTestId('error');
            expect(errorNode.textContent).not.toBe('');
            expect(errorNode.textContent).toBe(mockError.message);
        });
    });

});
