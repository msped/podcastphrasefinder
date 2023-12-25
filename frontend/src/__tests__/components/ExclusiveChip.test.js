import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import ExclusiveChip from '@/components/ExclusiveChip';
import '@testing-library/jest-dom/extend-expect';

describe('ExclusiveChip', () => {
    it('renders without crashing', () => {
        render(<ExclusiveChip />);
        const chipElement = screen.getByText(/exclusive/i);
        expect(chipElement).toBeInTheDocument();
    });
    
    it('has the correct tooltip text', () => {
        render(<ExclusiveChip />);
        const chipElement = screen.getByLabelText(
            'This episode is a paid exclusive and may not be available on specific platforms.');
        expect(chipElement).toBeTruthy();
    });

    it('has correct size attribute', () => {
        render(<ExclusiveChip />);
        const chipElement = screen.getByText(/exclusive/i);
        expect(chipElement.closest('div')).toHaveClass('MuiChip-sizeSmall');
    });

});
