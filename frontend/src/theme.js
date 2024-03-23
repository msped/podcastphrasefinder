import { createTheme, responsiveFontSizes } from '@mui/material'
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '700', '900']
})

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ab47bc',
        },
        secondary: {
            main: '#f50057',
        },
        type: 'dark',
    },
    typography: {
        fontFamily: roboto.style.fontFamily
    },
    overrides: {
        MuiAppBar: {
            colorInherit: {
                backgroundColor: '#1976d2',
            color: '#fff',
            },
        },
    },
    props: {
        MuiAppBar: {
            color: 'inherit',
        },
    },
})


export default responsiveFontSizes(theme);