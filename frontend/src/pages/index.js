import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import EpisodeSearch from '@/components/EpisodeSearch';
import PodcastSearch from '@/components/PodcastSearch';

const styles = {
  headerText: {
    marginBottom: '1%',
    fontWeight: 500,
    fontStyle: 'italic',
    backgroundColor: '#000',
    width: 'fit-content',
    padding: '5px 15px',
  },
  tabStyles: {
    '& .MuiTab-root': { 
      backgroundColor: '#121212',
      border: '1px solid #121212',
    },
    '& .MuiTab-root.Mui-selected': {
      backgroundColor: 'primary.main',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      border: 'none !important', 
    },
    '& .MuiTabs-flexContainer': {
      borderRadius: '12px',
    },
    '& .MuiTab-root:first-of-type': {
      borderTopLeftRadius: '12px',
      borderBottomLeftRadius: '12px',
      borderTop: '1px solid #fff',
      borderLeft: '1px solid #fff',
      borderBottom: '1px solid #fff',
    },
    '& .MuiTab-root:last-of-type': {
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '12px',
      borderTop: '1px solid #fff',
      borderRight: '1px solid #fff',
      borderBottom: '1px solid #fff',
    },
    '& .MuiButtonBase-root': {
      minHeight: 'none'
    }
  }
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState(0);

  useEffect(() => {
      if(!router.isReady) return;
  }, [router.isReady])

  const handleChange = (event, newValue) => {
    router.replace('/', undefined, { shallow: true });
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>
          Search podcast transcripts with that phrase you know, 
          but can't find! | PodcastPhraseFinder
        </title>
        <meta name="description" content="Discover and explore a vast collection of podcasts by searching through their transcripts. 
          Find episodes based on specific topics, keywords, or phrases. Enjoy the convenience 
          of finding relevant podcast episodes with ease." 
        />
      </Head>
      {/* https://unsplash.com/photos/g0PcDhany4Y?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink */}
      <Box sx={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        minHeight: '55vh',
        backgroundImage: {
          xs: "url('static/images/homepageimg-xs-min.jpeg')",
          sm: "url('static/images/homepageimg-sm-min.jpeg')",
          md: "url('static/images/homepageimg-md-min.jpeg')",
          lg: "url('static/images/homepageimg-lg-min.jpeg')",
          xl: "url('static/images/homepageimg-xl-min.jpeg')"
        }
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: { xs: '0', md: '5%' },
            padding: { xs: '10px', md: '0'}
          }}
        >
          <Typography
            sx={{...styles.headerText}}
            variant='h3'
          >
            PodcastPhraseFinder
          </Typography>
          <Typography
            sx={{...styles.headerText}}
            variant='body1'
          >
            Search podcast transcripts for a (sometime questionable) phrase to find where it came from.
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        minHeight: '40vh',
        marginTop: 5
      }}>
        <Container maxWidth='md'> 
          <Box>
            <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="basic tabs example" 
            centered
            textColor='inherit'
            indicatorColor='none'
            sx={{...styles.tabStyles}}>
              <Tab label="Episode" {...a11yProps(0)} />
              <Tab label="Podcast" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <EpisodeSearch />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <PodcastSearch />
          </CustomTabPanel>
        </Container>
      </Box>
      
      <Container maxWidth='md' sx={{ my: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Add panel for signing up and managing content */}
          </Grid>
        </Grid>
      </Container>
    </>
    )
}
