import React, { useState, useCallback } from 'react';
import { 
    Box,
    Typography,
    TextField,
    Button,
    Chip,
    Stack,
    MenuItem,
    IconButton,
    Popover,
    Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    useGetFeedsHook,
    useGetEpisodeReleaseDaysHook,
} from '@/hooks/podcastHooks';
import {
    postEpisodeReleaseDaysService,
    deleteEpisodeReleaseDaysService,
    postFeedService,
    deleteFeedService,
} from '@/api/podcastServices';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Everyday' },
];

export default function RSSFeedSettings({ podcast }) {
    const { feeds, isLoading: isFeedsLoading, setFeeds } = useGetFeedsHook(podcast.slug);
    const { releaseDays, isLoading: isReleaseDaysLoading, setReleaseDays } = useGetEpisodeReleaseDaysHook(podcast.slug);
    const [url, setUrl] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleError = useCallback((error) => toast.error(error.message || 'An error occurred'), []);

    // Add release day
    const handleDaySelect = async (day) => {
        if (!releaseDays.includes(day)) {
            try {
                const response = await postEpisodeReleaseDaysService(podcast, day);
                setReleaseDays((prev) => [...prev, response]);
                toast.success('Release day added');
            } catch (err) {
                handleError(err);
            }
        }
        setAnchorEl(null);
    };

    // Remove release day
    const handleRemoveReleaseDay = async (day) => {
        try {
            await deleteEpisodeReleaseDaysService(podcast, day);
            setReleaseDays((prev) => prev.filter((d) => d !== day));
            toast.success('Release day removed');
        } catch (err) {
            handleError(err);
        }
    };

    const handleAddFeed = async () => {
        if (url) {
            try {
                const response = await postFeedService(podcast, url);
                setFeeds((prev) => [...prev, response]);
                toast.success('RSS feed added');
            } catch (err) {
                handleError(err)
            }
        }
    };

    const handleDeleteFeed = async (feed) => {
        try {
            await deleteFeedService(podcast.slug, feed.id);
            setFeeds((prev) => prev.filter((f) => f.id !== feed.id));
            toast.success('RSS Feed removed.');
        } catch (err) {
            handleError(err);
        }
    };

    const handleAddDayClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);

    if (isFeedsLoading || isReleaseDaysLoading) {
        return (
            <Box sx={{ mt: 4, p: 1 }}>
                <Typography variant="h6" gutterBottom>
                    RSS Feed Settings
                </Typography>
                <Stack spacing={2}>
                    <Skeleton variant="rectangular" role="progressbar" width={300} height={40} />
                    <Skeleton variant="rectangular" role="progressbar" width={200} height={32} />
                    <Skeleton variant="rectangular" role="progressbar" width={400} height={32} />
                </Stack>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, p: 1 }}>
            <Typography variant="h6" gutterBottom>
                Manage RSS Feed
            </Typography>
            <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
                {feeds && feeds.length > 0 ? (
                    <Box>
                        <Stack spacing={1}>
                            {feeds.map((feed) => (
                                <Box key={feed.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" sx={{ flex: 1 }}>{feed.rss_feed_url}</Typography>
                                    <IconButton onClick={() => handleDeleteFeed(feed)} size="small" data-testid='delete-feed' color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                ) :
                (<Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="RSS Feed URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        size="small"
                        sx={{ minWidth: 300 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddFeed}
                        disabled={!url.trim()}
                    >
                    Add Feed
                    </Button>
                </Stack>)}
                <Stack direction="row" spacing={1} mt={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Manage Release Days
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddDayClick}
                    >
                        Add Release Day
                    </Button>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Stack>
                            {DAYS_OF_WEEK.map((day) => (
                                <MenuItem
                                    key={day.value}
                                    value={day.value}
                                    disabled={releaseDays.some(d => (typeof d === 'object' ? d.day : d) === day.value)}
                                    onClick={() => handleDaySelect(day.value)}
                                >
                                    {day.label}
                                </MenuItem>
                            ))}
                        </Stack>
                    </Popover>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {releaseDays.filter(Boolean).map((obj) => (
                            <Chip
                                key={obj.id}
                                label={DAYS_OF_WEEK.find((d) => d.value === obj.day)?.label}
                                onDelete={() => handleRemoveReleaseDay(obj)}
                                color="primary"
                            />
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}
