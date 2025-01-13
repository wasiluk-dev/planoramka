import React, { JSX, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Theme,
    useColorScheme, useMediaQuery,
} from '@mui/material';

import Footer from './Components/Footer.tsx';
import Header from './Components/Header.tsx';
import NavDrawer from './Components/NavDrawer.tsx';
import Notification, { NotificationProps } from './Components/Notification.tsx';

import AdminPanel from './views/AdminPanel.tsx';
import Home from './views/Home.tsx';
import Login from './views/Login.tsx';
import NotFound from './views/NotFound.tsx';
import Onboarding from './views/Onboarding.tsx';
import TimetableMaker from './Plans/TimetableMaker.tsx';
import Timetables from './Plans/PlansRDY/Timetables.tsx';
import Register from './views/Register.tsx';
import Rooms from './views/Rooms.tsx';
import UserPanel from './views/UserPanel.tsx';

import APIService from '../services/APIService.ts';
import ENavTabs from './enums/ENavTabs.ts';
import Navigation from './Navigation.tsx';
import i18n, { i18nPromise } from './i18n';

const { t } = i18n;
await i18nPromise;

type AppProps = {
    theme: Theme;
}

const App: React.FC<AppProps> = ({ theme }) => {
    const isUserOnMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));
    const { mode, setMode } = useColorScheme();

    const [currentTab, setCurrentTab] = useState<ENavTabs | false>(false);
    const [documentTitle, setDocumentTitle] = useState<string>(t('app_name'));
    const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
    const [notificationVisible, setNotificationVisible] = useState<boolean>(false);
    const [notificationData, setNotificationData] = useState<NotificationProps['data']>({
        message: '',
        title: '',
        severity: 'info',
    });

    // dialog
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<{ title: string; content: JSX.Element }>({
        title: '',
        content: <></>,
    });

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async() => {
            const session = await APIService.isUserLoggedIn();
            if (session.user) {
                setIsUserLoggedIn(true);
                setUsername(session.user.username);
            }
        }

        fetchData().then();
    }, []);
    useEffect(() => {
        setNavDrawerOpen(false);
    }, [isUserOnMobile]);
    useEffect(() => {
        document.title = `${ documentTitle } – ${ t('app_name') }`;
    }, [documentTitle]);
    useEffect(() => {
        if (notificationData.message !== '') setNotificationVisible(true);
    }, [notificationData]);

    return (
        <BrowserRouter>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: isUserOnMobile ? '56px' : 0 }}>
                <Header
                    documentTitle={ documentTitle }
                    username={ username }
                    isUserLoggedIn={ isUserLoggedIn }
                    isUserOnMobile={ isUserOnMobile }
                    setUsername={ setUsername }
                    setIsUserLoggedIn={ setIsUserLoggedIn }
                    setNotificationData={ setNotificationData }
                    currentTabValue={ currentTab }
                    setCurrentTabValue={ setCurrentTab }
                    setNavDrawerOpen={ setNavDrawerOpen }
                />

                <NavDrawer
                    navRoutes={ Navigation }
                    navDrawerOpen={ navDrawerOpen }
                    setNavDrawerOpen={ setNavDrawerOpen }
                />

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Routes>
                        <Route path={ Navigation.Home.route }
                            element={ <Home
                                isUserOnMobile={ isUserOnMobile }
                                setCurrentTabValue={ setCurrentTab }
                                setDialogData={ setDialogData }
                                setDialogOpen={ setDialogOpen }
                                setDocumentTitle={ setDocumentTitle }
                            /> }
                        />
                        <Route path={ Navigation.Timetables.route }
                            element={ <Timetables
                                setCurrentTabValue={ setCurrentTab }
                                setDialogData={ setDialogData }
                                setDialogOpen={ setDialogOpen }
                                setDocumentTitle={ setDocumentTitle }
                            /> }
                        />
                        <Route path={ Navigation.TimetableMaker.route }
                            element={ <TimetableMaker
                                setDocumentTitle={ setDocumentTitle }
                                setCurrentTabValue={ setCurrentTab }
                            /> }
                        />
                        <Route path={ Navigation.Rooms.route }
                            element={ <Rooms
                                isUserOnMobile={ isUserOnMobile }
                                setCurrentTabValue={ setCurrentTab }
                                setDialogData={ setDialogData }
                                setDialogOpen={ setDialogOpen }
                                setDocumentTitle={ setDocumentTitle }
                            /> }
                        />
                        <Route path={ Navigation.AdminPanel.route }
                            element={ <AdminPanel
                                setDocumentTitle={ setDocumentTitle }
                                setCurrentTabValue={ setCurrentTab }
                            /> }
                        />
                        <Route path={ Navigation.Onboarding.route }
                            element={ <Onboarding
                                setDocumentTitle={ setDocumentTitle }
                                setCurrentTabValue={ setCurrentTab }
                            /> }
                        />
                        <Route path={ Navigation.UserPanel.route }
                            element={ <UserPanel
                                setDocumentTitle={ setDocumentTitle }
                            /> }
                        />
                        <Route path={ Navigation.Login.route }
                            element={ <Login
                                isUserOnMobile={ isUserOnMobile }
                                setDocumentTitle={ setDocumentTitle }
                                setUsername={ setUsername }
                                setIsUserLoggedIn={ setIsUserLoggedIn }
                                setNotificationData={ setNotificationData }
                            /> }
                        />
                        <Route path={ Navigation.Register.route }
                            element={ <Register
                                isUserOnMobile={ isUserOnMobile }
                                setDocumentTitle={ setDocumentTitle }
                            /> }
                        />
                        <Route path={ Navigation.NotFound.route }
                            element={ <NotFound
                                // setCurrentTab={ setCurrentTab }
                                setDocumentTitle={ setDocumentTitle }
                            /> }
                        />
                    </Routes>

                    <Dialog open={ dialogOpen }>
                        <DialogTitle>{ dialogData.title }</DialogTitle>
                        <DialogContent>{ dialogData.content }</DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={ () => setDialogOpen(false) }
                            >
                                { t('dialog_actions_close') }
                            </Button>
                        </DialogActions>
                    </Dialog>

                    { notificationVisible ? (
                        <Notification
                            data={ notificationData }
                            isUserOnMobile={ isUserOnMobile }
                            isNotificationVisible={ notificationVisible }
                            setIsNotificationVisible={ setNotificationVisible }
                        />
                    ) : null }
                </Box>

                <Footer
                    mode={ mode }
                    setMode={ setMode }
                    isUserOnMobile={ isUserOnMobile }
                />
            </Box>
        </BrowserRouter>
    );
};

export default App;
