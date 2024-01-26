import React, { useState } from 'react'
import {
    Tabs,
    Tab,
    Container,
    Box,
} from '@mui/material';

import AddEpisodeFromYouTube from '@/forms/AddEpisodeFromYouTube';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box my={3}>
                    {children}
                </Box>
            )}
        </div>
    )
}

export default function add() {
    const [tabValue, setTabValue] = useState(0);

    const HandleTab = (event, newValue) => {
        setTabValue(newValue);
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ width: "100%" }}>
                <Tabs value={tabValue} onChange={HandleTab} variant="fullWidth">
                    <Tab label="YouTube"/>
                    <Tab label="Get a transcript" disabled/>
                    <Tab label="RSS Feed" disabled/>
                    <Tab label="Existing transcript" disabled/>
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <AddEpisodeFromYouTube />
            </TabPanel>
        </Container>
    )
}
