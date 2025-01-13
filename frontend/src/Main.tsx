import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { createTheme, Theme, ThemeProvider } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.css';

import App from './App.tsx';
import './index.css';

const themePalette = {
    primary: {
        main: '#f2e399',
    },
    secondary: {
        main: '#121212',
    },
};
const themeComponents: Theme['components'] = {
    MuiBottomNavigation: {
        styleOverrides: {
            root: {
                backgroundColor: themePalette.primary.main,
            }
        },
    },
    MuiBottomNavigationAction: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    color: themePalette.secondary.main,
                },
            },
        },
    },
    // MuiStack: {
    //     styleOverrides: {
    //         root: {
    //             padding: theme.spacing(2),
    //         },
    //     },
    // },
    MuiTab: {
        styleOverrides: {
            root: {
                textTransform: 'none', // removes forced all caps
            },
        },
    },
    MuiTabs: {
        styleOverrides: {
            scrollButtons: {
                '&.Mui-disabled': {
                    opacity: 0.3,
                },
            }
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                textAlign: 'center',
            }
        }
    },
    MuiToolbar: {
        styleOverrides: {
            root: {
                '@media (min-width: 600px)': {
                    minHeight: '56px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                },
                '@media (min-width: 900px)': {
                    paddingLeft: '0px',
                },
            },
        },
    },
};
const theme: Theme = createTheme({
    palette: themePalette,
    components: themeComponents,
});

ReactDOM.createRoot(document.getElementById('root')!).render((
    <React.StrictMode>
        <ThemeProvider theme={ theme } defaultMode="light">
            <CookiesProvider defaultSetOptions={{ path: '/' }}>
                <App theme={ theme }/>
            </CookiesProvider>
        </ThemeProvider>
    </React.StrictMode>
));
