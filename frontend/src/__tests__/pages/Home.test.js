import React from 'react';
import "@testing-library/jest-dom"
import { screen, render, waitFor, fireEvent } from "@testing-library/react"
import mockRouter from 'next-router-mock';
import Home from '@/pages/index';


jest.mock('next/router', () => require('next-router-mock'))

describe('Home component', () => {
    it('renders "PodcastPhraseFinder" header text', () => {
        render(<Home />);
        expect(screen.getByText(/PodcastPhraseFinder/i)).toBeInTheDocument();
    });

    it('switches tabs correctly', async () => {
        render(<Home />);

        expect(screen.getByRole('tab', { name: 'Episode' })).toHaveClass('Mui-selected');
        expect(screen.queryByRole('searchbox')).toBeVisible();

        fireEvent.click(screen.getByRole('tab', { name: 'Podcast' }));
        
        expect(screen.getByRole('tab', { name: 'Podcast' })).toHaveClass('Mui-selected');
        expect(screen.queryByRole('searchbox')).toBeVisible();
    });

    it('clears the search input value and query parameters when switching tabs', async () => {

        render(<Home />);
        const episodeSearchInput = screen.getByRole('searchbox');
        fireEvent.change(episodeSearchInput, { target: { value: 'test' } });

        fireEvent.click(screen.getByRole('tab', { name: 'Podcast' }));

        await waitFor(() => {
            expect(mockRouter.query).toEqual({});
        });
    });
    
    describe("Tab Styling", () => {
        it("should render the Episode tab", () => {
            render(<Home />)
            const tab = screen.getByRole("tab", { name: /Episode/i });
            expect(tab).toBeInTheDocument()
        })
        it("should render the Podcast tab", () => {
            render(<Home />)
            const tab = screen.getByRole("tab", { name: /Podcast/i });
            expect(tab).toBeInTheDocument()
        })
        it("should select the Episode tab by default", () => {
            render(<Home />)
            const tab = screen.getByRole("tab", { name: /Episode/i });
            expect(tab).toHaveClass("Mui-selected")
        })
        it("should switch to the Podcast tab when clicked", () => {
            render(<Home />)
            const podcastTab = screen.getByRole("tab", { name: /Podcast/i });
            fireEvent.click(podcastTab);
            expect(podcastTab).toHaveClass("Mui-selected");
        })
    })
});