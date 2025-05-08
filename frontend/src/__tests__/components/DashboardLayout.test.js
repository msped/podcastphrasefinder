import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardLayout from "../../pages/creator/_components/DashboardLayout";
import '@testing-library/jest-dom';
import { usePathname } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PodcastContext } from '@/context/PodcastContext';
import { useGetPodcastOrgsHook } from '@/hooks/membershipHooks';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('@mui/material/styles', () => ({
    ...jest.requireActual('@mui/material/styles'),
    useTheme: jest.fn(),
}));

jest.mock('@mui/material/useMediaQuery', () => jest.fn());
jest.mock("../../hooks/membershipHooks", () => ({
    useGetPodcastOrgsHook: jest.fn(),
}));

const mockChildren = <div>Test Content</div>;

describe("DashboardLayout", () => {
    const theme = {
        breakpoints: {
            up: (size) => `@media (min-width:${size}px)`
        }
    };

    beforeEach(() => {
        useTheme.mockReturnValue(theme);
        useMediaQuery.mockReturnValue(false);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("renders without crashing", () => {
        usePathname.mockReturnValue("localhost:3000/creator/dashboard/episodes");
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: { name: 'Test Org' } }}> 
                <DashboardLayout>{mockChildren}</DashboardLayout>
            </PodcastContext.Provider>
        );
        expect(screen.getByTestId("presentation")).toBeInTheDocument();
    });

    it("highlights the 'New Episode' button when on add episode page", () => {
        usePathname.mockReturnValue("/creator/dashboard/episodes/add");
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: { name: 'Test Org' } }}> 
                <DashboardLayout>{mockChildren}</DashboardLayout>
            </PodcastContext.Provider>
        );

        const newEpisodeButton = screen.getByRole("button", { name: "New Episode" });
        expect(newEpisodeButton).toHaveStyle(`fontWeight: 700`);
    });

    it("doesn't highlight the 'New Episode' button when not on add episode page", () => {
        usePathname.mockReturnValue("/creator/dashboard/not-episodes");
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: { name: 'Test Org' } }}> 
                <DashboardLayout>{mockChildren}</DashboardLayout>
            </PodcastContext.Provider>
        );

        const newEpisodeButton = screen.getByRole("button", { name: "New Episode" });
        expect(newEpisodeButton).toHaveStyle(`fontWeight: 400`);
    });

    it("highlights the 'Episodes' button when on episodes list page", () => {
        usePathname.mockReturnValue("/creator/dashboard/episodes");
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: { name: 'Test Org' } }}> 
                <DashboardLayout>{mockChildren}</DashboardLayout>
            </PodcastContext.Provider>
        );

        const episodesButton = screen.getByRole("button", { name: "Episodes" });
        expect(episodesButton).toHaveStyle(`font-weight: 700`);
    });

    it("should display 'Test Content' as children inside the component", () => {
        usePathname.mockReturnValue("/creator/dashboard/episodes");
        useGetPodcastOrgsHook.mockReturnValueOnce({})
        render(
            <PodcastContext.Provider value={{ selectedPodcastOrg: { name: 'Test Org' } }}> 
                <DashboardLayout>{mockChildren}</DashboardLayout>
            </PodcastContext.Provider>
        );

        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
});
