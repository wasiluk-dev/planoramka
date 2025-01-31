import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button, ButtonOwnProps,
    IconButton, Stack,
    Tab, Tabs,
    Toolbar, Tooltip,
    Typography,
} from '@mui/material';
import {
    AccountCircleRounded,
    LoginRounded,
    LogoutRounded,
    MenuRounded,
    PersonAddRounded,
} from '@mui/icons-material';

import useAuth from '../hooks/useAuth.tsx';

import Navigation from '../Navigation.tsx';
import { NotificationProps } from './Notification.tsx';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type HeaderProps = {
    documentTitle: string;
    isUserOnMobile: boolean;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
    currentTabValue: number | boolean;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
    setNavDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
    documentTitle,
    isUserOnMobile,
    setNotificationData,
    currentTabValue,
    setCurrentTabValue,
    setNavDrawerOpen
}) => {
    // hooks
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // states
    const [loginButtonVariant, setLoginButtonVariant] = useState<ButtonOwnProps['variant']>('outlined');

    // memos
    const filteredNav: string[] = useMemo(() => {
        return Object.keys(Navigation).filter(key => {
            const nav = Navigation[key];
            return nav.icon && nav.primary === true && (!nav.permissions || (user?.role && user?.role >= nav.permissions));
        });
    }, [user?.role]);

    // handlers
    const handleLogout = () => {
        navigate('/');
        logout().then(() => {
            setNotificationData({
                message: t('notification_logout_success'),
                severity: 'success',
            });
        });
    };
    const handleTabChange = (_e: React.SyntheticEvent, value: number) => {
        setCurrentTabValue(value);
    };
    const deselectTab = (button: string) => {
        setCurrentTabValue(false);
        if (button === 'login') {
            setLoginButtonVariant('contained');
        }
    };

    return (<AppBar position="sticky"><Toolbar>
        { isUserOnMobile ? (<>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                component={ Button }
                onClick={ () => setNavDrawerOpen(true) }
            >
                <MenuRounded/>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                { documentTitle }
            </Typography>
        </>) : (<>
            <Box sx={{ flexGrow: 1 }}>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="secondary"
                    indicatorColor="secondary"
                    value={ currentTabValue }
                    onChange={ handleTabChange }
                >
                    { filteredNav.map(key => {
                        return (
                            <Tab
                                key={ key }
                                component={ Link }
                                to={ Navigation[key].route }
                                label={ Navigation[key].name }
                                icon={ Navigation[key].icon }
                            />
                        );
                    }) }
                </Tabs>
            </Box>

            <Stack
                spacing={ 1 }
                direction="row"
                sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}
            >
                { !user ? (<>
                    <Button
                        color="secondary"
                        variant="text"
                        startIcon={ <PersonAddRounded/> }
                        component={ Link }
                        to="/register"
                        onClick={ () => deselectTab('login') }
                    >
                        { t('nav_route_register') }
                    </Button>
                    <Button
                        color="secondary"
                        variant={ loginButtonVariant }
                        startIcon={ <LoginRounded/> }
                        component={ Link }
                        to="/login"
                        onClick={ () => deselectTab('login') }
                    >
                        { t('nav_route_login') }
                    </Button>
                </>) : (<>
                    <Tooltip title={ t('nav_route_profile_tooltip') }>
                        <Button
                            color="secondary"
                            variant="text"
                            startIcon={ <AccountCircleRounded/> }
                            component={ Link }
                            to="/profile"
                        >
                            { user.username ? user.username : t('nav_route_profile_short') }
                        </Button>
                    </Tooltip>
                    <Tooltip title={ t('nav_route_logout_tooltip') }>
                        <IconButton
                            color="secondary"
                            aria-label={ t('nav_route_logout_tooltip') }
                            onClick={ handleLogout }
                        >
                            <LogoutRounded/>
                        </IconButton>
                    </Tooltip>
                </>) }
            </Stack>
        </>) }
    </Toolbar></AppBar>);
}

export default Header;
