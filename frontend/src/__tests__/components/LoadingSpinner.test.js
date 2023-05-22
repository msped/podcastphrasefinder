import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import LoadingSpinner from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders a circular progress indicator', () => {
        const { getByRole } = render(<LoadingSpinner />);
        const progressIndicator = getByRole('progressbar');
        expect(progressIndicator).toBeInTheDocument();
    });
});
