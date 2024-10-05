import React from 'react';
import { render } from '@testing-library/react';
import PodcastNew from '@/pages/creator/podcast/new';
import "@testing-library/jest-dom"

jest.mock('../../pages/creator/_components/withDashboardLayout', () => (Component) => Component);
jest.mock('../../pages/creator/_forms/CreatePodcastForm', () => () => <div data-testid="create-podcast-form" />);

describe('PodcastNew', () => {
    it('renders the CreatePodcastForm component', () => {
        const { getByTestId } = render(<PodcastNew />);
        expect(getByTestId('create-podcast-form')).toBeInTheDocument();
    });
});

