import Head from 'next/head';
import {
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import Link from '@/components/Link';

const styles = {
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
        minHeight: '60vh',
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
            top: '30%',
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
            {/* Add panel for signing up and managing content */}
          </Grid>
        </Grid>
      </Container>
    </>
    )
}
