import React, { JSX, lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Theme,
    useColorScheme, useMediaQuery,
} from '@mui/material';

import Navigation from './Navigation.tsx';

import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Loading from './components/Loading.tsx';

import ENavTabs from './enums/ENavTabs.ts';
import EUserRole from '../../backend/src/enums/EUserRole.ts';
import i18n, { i18nPromise } from './i18n';
import { NotificationProps } from './components/Notification.tsx';

const { t } = i18n;
await i18nPromise;

const NavDrawer = lazy(() => import('./components/NavDrawer'));
const Notification = lazy(() => import('./components/Notification'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const AdminPanel = lazy(() => import('./views/AdminPanel'));
const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));
const NotFound = lazy(() => import('./views/NotFound'));
const Onboarding = lazy(() => import('./views/Onboarding'));
const TimetableMaker = lazy(() => import('./views/TimetableMaker.tsx'));
const Timetables = lazy(() => import('./views/Timetables.tsx'));
const Register = lazy(() => import('./views/Register'));
const Rooms = lazy(() => import('./views/Rooms'));
const UserPanel = lazy(() => import('./views/UserPanel'));

type AppProps = {
    theme: Theme;
}
const App: React.FC<AppProps> = ({ theme }) => {
    const isUserOnMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));
    const { mode, setMode } = useColorScheme();

    const [currentTab, setCurrentTab] = useState<ENavTabs | false>(false);
    const [bottomNavigationValue, setBottomNavigationValue] = React.useState<number | false>(false);
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

    useEffect(() => {
        setNavDrawerOpen(false);
        // setMode('dark');
    }, [isUserOnMobile]);
    useEffect(() => {
        document.title = `${ documentTitle } – ${ t('app_name') }`;
    }, [documentTitle]);
    useEffect(() => {
        if (notificationData.message !== '') setNotificationVisible(true);
    }, [notificationData]);

    return (
        <BrowserRouter>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                pb: isUserOnMobile ? '56px' : 0,
            }}>
                <Header
                    documentTitle={ documentTitle }
                    isUserOnMobile={ isUserOnMobile }
                    setNotificationData={ setNotificationData }
                    currentTabValue={ currentTab }
                    setCurrentTabValue={ setCurrentTab }
                    setNavDrawerOpen={ setNavDrawerOpen }
                />

                <NavDrawer
                    navRoutes={ Navigation }
                    navDrawerOpen={ navDrawerOpen }
                    setNavDrawerOpen={ setNavDrawerOpen }
                    setBottomNavigationValue={ setBottomNavigationValue }
                />

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Suspense fallback={ <Loading/> }>
                        <Routes>
                            <Route
                                path={ Navigation.Home.route }
                                element={ <Home
                                    isUserOnMobile={ isUserOnMobile }
                                    setCurrentTabValue={ setCurrentTab }
                                    setDialogData={ setDialogData }
                                    setDialogOpen={ setDialogOpen }
                                    setDocumentTitle={ setDocumentTitle }
                                /> }
                            />
                            <Route
                                path={ Navigation.Timetables.route }
                                element={ <Timetables
                                    isUserOnMobile={ isUserOnMobile }
                                    setCurrentTabValue={ setCurrentTab }
                                    setDialogData={ setDialogData }
                                    setDialogOpen={ setDialogOpen }
                                    setDocumentTitle={ setDocumentTitle }
                                /> }
                            />
                            <Route
                                path={ Navigation.Rooms.route }
                                element={ <Rooms
                                    isUserOnMobile={ isUserOnMobile }
                                    setCurrentTabValue={ setCurrentTab }
                                    setDialogData={ setDialogData }
                                    setDialogOpen={ setDialogOpen }
                                    setDocumentTitle={ setDocumentTitle }
                                /> }
                            />

                            {/* USER ROUTES */}
                            <Route
                                element={ <ProtectedRoute
                                    permissions={ EUserRole.Student }
                                    setNotificationData={ setNotificationData }
                                /> }
                            >
                                <Route
                                    path={ Navigation.UserPanel.route }
                                    element={ <UserPanel
                                        isUserOnMobile={ isUserOnMobile }
                                        setDocumentTitle={ setDocumentTitle }
                                        setNotificationData={ setNotificationData }
                                    /> }
                                />
                            </Route>

                            {/* STAFF ROUTES */}
                            <Route
                                element={ <ProtectedRoute
                                    permissions={ EUserRole.Staff }
                                    setNotificationData={ setNotificationData }
                                /> }
                            >
                                <Route
                                    path={ Navigation.TimetableMaker.route }
                                    element={
                                        <TimetableMaker
                                            isUserOnMobile={ isUserOnMobile }
                                            setCurrentTabValue={ setCurrentTab }
                                            setDocumentTitle={ setDocumentTitle }
                                            setNotificationData={ setNotificationData }
                                        />
                                    }
                                />
                            </Route>

                            {/* ADMIN ROUTES */}
                            <Route
                                element={ <ProtectedRoute
                                    permissions={ EUserRole.Admin }
                                    setNotificationData={ setNotificationData }
                                /> }
                            >
                                <Route
                                    path={ Navigation.AdminPanel.route }
                                    element={ <AdminPanel
                                        setCurrentTabValue={ setCurrentTab }
                                        setDocumentTitle={ setDocumentTitle }
                                    /> }
                                />
                                <Route
                                    path={ Navigation.Onboarding.route }
                                    element={ <Onboarding
                                        setCurrentTabValue={ setCurrentTab }
                                        setDocumentTitle={ setDocumentTitle }
                                    /> }
                                />
                            </Route>

                            <Route
                                path={ Navigation.Login.route }
                                element={ <Login
                                    isUserOnMobile={ isUserOnMobile }
                                    setDocumentTitle={ setDocumentTitle }
                                    setNotificationData={ setNotificationData }
                                /> }
                            />
                            <Route
                                path={ Navigation.Register.route }
                                element={ <Register
                                    isUserOnMobile={ isUserOnMobile }
                                    setDocumentTitle={ setDocumentTitle }
                                /> }
                            />
                            <Route
                                path={ Navigation.NotFound.route }
                                element={ <NotFound
                                    // setCurrentTab={ setCurrentTab }
                                    setDocumentTitle={ setDocumentTitle }
                                /> }
                            />
                        </Routes>
                    </Suspense>

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
                            setNotificationVisible={ setNotificationVisible }
                        />
                    ) : null }
                </Box>

                <Footer
                    mode={ mode }
                    setMode={ setMode }
                    isUserOnMobile={ isUserOnMobile }
                    bottomNavigationValue={ bottomNavigationValue }
                    setBottomNavigationValue={ setBottomNavigationValue }
                />
            </Box>
        </BrowserRouter>
    );
};

export default App;
