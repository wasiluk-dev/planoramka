import { createTheme, Theme } from '@mui/material';
import { plPL } from '@mui/material/locale';
import { plPL as gridPlPL } from '@mui/x-data-grid/locales/plPL';
// import { plPL as datePlPL } from '@mui/x-date-pickers/locales';

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
    MuiTablePagination: {
        styleOverrides: {
            displayedRows: {
                margin: 0,
            },
            selectLabel: {
                margin: 0,
            },
        },
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
}, plPL, gridPlPL);

export default theme;
