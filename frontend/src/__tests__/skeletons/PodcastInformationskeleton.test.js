import React from 'react';
import { render } from '@testing-library/react';
import PodcastInformationSkeleton from '@/skeletons/PodcastInformationSkeleton';

describe('EpisodePanelSkeleton', () => {
    it('renders without crashing', () => {
        render(<PodcastInformationSkeleton />);
    });
});
