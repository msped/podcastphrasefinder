import React from 'react';
import "@testing-library/jest-dom"
import { render, screen } from '@testing-library/react';
import EpisodePanelSkeleton from '@/skeletons/EpisodePanelSkeleton';

describe('EpisodePanelSkeleton', () => {
    it('renders without crashing', () => {
        render(<EpisodePanelSkeleton />);
    });
    
    it('disables the button', () => {
        render(<EpisodePanelSkeleton />);
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
