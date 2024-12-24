import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';

import Footer from './Components/Footer.tsx';
import Header from './Components/Header.tsx';
import Notification, { NotificationProps } from './Components/Notification.tsx';

import AdminPanel from './views/AdminPanel.tsx';
import Home from './views/Home.tsx';
import Login from './views/Login.tsx';
import NavDrawer from './Components/NavDrawer.tsx';
import NotFound from './views/NotFound.tsx';
import Plans from './Plans/Plans.tsx';
import ReadyPlan from './Plans/PlansRDY/ReadyPlan.tsx';
import Register from './views/Register.tsx';
import Rooms from './views/Rooms.tsx';
import UserPanel from './views/UserPanel.tsx';

import Navigation from './Navigation.tsx';
import i18n, { i18nPromise } from './i18n';

const { t } = i18n;
await i18nPromise;

const theme = createTheme({
    palette: {
        primary: {
            main: '#f2e399',
        },
        secondary: {
            main: '#121212',
        },
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // removes forced all caps
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    textAlign: 'center',
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginTop: '16px',
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                dense: {
                    '@media (min-width: 0px)': { // [theme.breakpoints.up("xs")]
                        paddingLeft: 0,
                    },
                },
            },
        },
    },
});

const App = () => {
    const isUserOnMobile: boolean = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentTabValue, setCurrentTabValue] = useState<number | boolean>(0);
    const [documentTitle, setDocumentTitle] = useState<string>(t('app_name'));
    const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
    const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false);
    const [notificationData, setNotificationData] = useState<NotificationProps['data']>({
        message: '',
        title: '',
        severity: 'info',
    });

    const [username, setUsername] = useState<string>();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        document.title = `${ documentTitle } – ${ t('app_name') }`;
    }, [documentTitle]);
    useEffect(() => {
        if (notificationData.message !== '') setIsNotificationVisible(true);
    }, [notificationData]);

    return (<>
        <ThemeProvider theme={ theme }>
            <BrowserRouter>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header documentTitle={ documentTitle }
                            username={ username }
                            isUserLoggedIn={ isUserLoggedIn }
                            isUserOnMobile={ isUserOnMobile }
                            setUsername={ setUsername }
                            setIsUserLoggedIn={ setIsUserLoggedIn }
                            setNotificationData={ setNotificationData }
                            currentTabValue={ currentTabValue }
                            setCurrentTabValue={ setCurrentTabValue }
                            setNavDrawerOpen={ setNavDrawerOpen }/>

                    <NavDrawer navRoutes={ Navigation }
                               navDrawerOpen={ navDrawerOpen }
                               setNavDrawerOpen={ setNavDrawerOpen }/>

                    <Box flex="1">
                        <Routes>
                            <Route path={ Navigation.Home.route }
                                   element={ <Home setDocumentTitle={ setDocumentTitle }
                                                   setCurrentTabValue={ setCurrentTabValue }/> }/>
                            <Route path={ Navigation.Timetables.route }
                                   element={ <ReadyPlan setDocumentTitle={ setDocumentTitle }
                                                        setCurrentTabValue={ setCurrentTabValue }/> }/>
                            <Route path={ Navigation.TimetableMaker.route }
                                   element={ <Plans setDocumentTitle={ setDocumentTitle }
                                                    setCurrentTabValue={ setCurrentTabValue }/> }/>
                            <Route path={ Navigation.Rooms.route }
                                   element={ <Rooms setDocumentTitle={ setDocumentTitle }
                                                    setCurrentTabValue={ setCurrentTabValue }/> }/>
                            <Route path={ Navigation.AdminPanel.route }
                                   element={ <AdminPanel setDocumentTitle={ setDocumentTitle }
                                                         setCurrentTabValue={ setCurrentTabValue }/> }/>
                            <Route path={ Navigation.UserPanel.route }
                                   element={ <UserPanel setDocumentTitle={ setDocumentTitle }/> }/>
                            <Route path={ Navigation.Login.route }
                                   element={ <Login setDocumentTitle={ setDocumentTitle }
                                                    setUsername={ setUsername }
                                                    setIsUserLoggedIn={ setIsUserLoggedIn }
                                                    setNotificationData={ setNotificationData }/> }/>
                            <Route path={ Navigation.Register.route }
                                   element={ <Register setDocumentTitle={ setDocumentTitle }/> }/>
                            <Route path={ Navigation.NotFound.route }
                                   element={ <NotFound setDocumentTitle={ setDocumentTitle }/> }/>
                        </Routes>

                        { isNotificationVisible ? (
                            <Notification data={ notificationData }
                                          isUserOnMobile={ isUserOnMobile }
                                          isNotificationVisible={ isNotificationVisible }
                                          setIsNotificationVisible={ setIsNotificationVisible }/>
                        ) : null }
                    </Box>

                    <Footer isUserOnMobile={ isUserOnMobile }/>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    </>);
};

export default App;
