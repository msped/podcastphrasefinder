import { createTheme, responsiveFontSizes } from '@mui/material'


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
