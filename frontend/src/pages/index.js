import Head from 'next/head'
import {
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material'
import Link from '@/components/Link'

import GetMostPopular from '@/components/GetMostPopular'
import HeaderImage from '../../public/static/images/homepageimg.jpeg'

const styles = {
  backgroundImageStyle: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    minHeight: '60vh',
    backgroundImage: `url(${HeaderImage.src})`
  },
  headerText: {
    marginBottom: '1%',
    fontWeight: 500,
    fontStyle: 'italic',
    backgroundColor: '#000',
    width: 'fit-content',
    padding: '5px 15px',
    fontFamily: 'Roboto, cursive'
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Search podcast transcripts with that phrase you know, 
          but can't find! | PodFinder
        </title>
      </Head>
      {/* https://unsplash.com/photos/g0PcDhany4Y?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink */}
      <div style={{...styles.backgroundImageStyle}}>
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: { xs: '0', md: '5%' },
            padding: { xs: '10px', md: '0'}
          }}
        >
          <Typography
            sx={{...styles.headerText}}
            variant='h3'
          >
            PodFinder
          </Typography>
          <Typography
            sx={{...styles.headerText}}
            variant='body1'
          >
            Search podcast transcripts for a (sometime questionable) phrase to find where it came from.
          </Typography>
        </Box>
      </div>
      <Container maxWidth='md' sx={{ my: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardContent>
                  <Stack alignContent='center' alignItems='center' spacing={2}>
                      <Typography variant='h4' component='p' fontWeight={500}>
                          Search for an Episode
                      </Typography>
                      <Button component={Link} variant='contained' href='/episodes'>
                          Go to Episodes
                      </Button>
                  </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardContent>
                  <Stack alignContent='center' alignItems='center' spacing={2}>
                      <Typography variant='h4' component='p' fontWeight={500}>
                          Search Podcasts
                      </Typography>
                      <Button component={Link} variant='contained' href='/podcasts'>
                          Go to Podcasts
                      </Button>
                  </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box my={3}>
              <GetMostPopular />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
    )
}
