import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    ButtonOwnProps,
    IconButton,
    Tab,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    AccountCircleRounded,
    LoginRounded,
    LogoutRounded,
    MenuRounded,
    PersonAddRounded,
} from '@mui/icons-material';

import './Header.css';
import Navigation from '../Navigation.tsx';
import APIService from '../../services/apiService.tsx';
import { NotificationProps } from './Notification.tsx';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type HeaderProps = {
    documentTitle: string;
    username: string | undefined;
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
    isUserLoggedIn: boolean;
    isUserOnMobile: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
    currentTabValue: number | boolean;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | boolean>>;
    setNavDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
    documentTitle,
    username,
    isUserLoggedIn,
    isUserOnMobile,
    setUsername,
    setIsUserLoggedIn,
    setNotificationData,
    currentTabValue,
    setCurrentTabValue,
    setNavDrawerOpen
}: HeaderProps) => {
    const navigate = useNavigate();

    const [loginButtonVariant, setLoginButtonVariant] = useState<ButtonOwnProps['variant']>('outlined');

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number,
    ) => {
        setCurrentTabValue(newValue);
    };

    const deselectTab = (button: string) => {
        setCurrentTabValue(false);
        if (button === 'login') {
            setLoginButtonVariant('contained');
        }
    };
    const logout = () => {
        APIService.logoutUser()
            .then(() => {
                setUsername(undefined);
                setIsUserLoggedIn(false);
                setNotificationData({
                    message: 'Wylogowanie przebiegło pomyślnie.',
                    severity: 'success',
                });

                navigate('/');
            });
    };

    return (<AppBar position="sticky"><Toolbar variant={ isUserOnMobile ? 'regular' : 'dense' }>
        { isUserOnMobile ? (<>
            <IconButton
                component={ Button }
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={ () => setNavDrawerOpen(true) }
            >
                <MenuRounded/>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                { documentTitle }
            </Typography>
        </>) : (<>
            <Box>
                <Tabs variant="scrollable"
                      scrollButtons="auto"
                      textColor="secondary"
                      indicatorColor="secondary"
                      value={ currentTabValue }
                      onChange={ handleTabChange }
                >
                    { Object.keys(Navigation).map((key, index) => {
                        const nav = Navigation[key];
                        if (nav.primary === false || !nav.icon) return;

                        return (
                            <Tab key={ index }
                                 component={ Link }
                                 to={ Navigation[key].route }
                                 label={ Navigation[key].name }
                                 icon={ Navigation[key].icon }/>
                        );
                    }) }
                </Tabs>
            </Box>
            <Box sx={{ flexGrow: 1 }}/>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                { !isUserLoggedIn ? (<>
                    <Link to="/register" onClick={ () => deselectTab('login') }>
                        <Button color="secondary"
                                variant="text"
                                startIcon={ <PersonAddRounded/> }
                        >
                            { t('nav_route_register') }
                        </Button>
                    </Link>
                    <Link to="/login" onClick={ () => deselectTab('login') }>
                        <Button color="secondary"
                                variant={ loginButtonVariant }
                                startIcon={ <LoginRounded/> }
                        >
                            { t('nav_route_login') }
                        </Button>
                    </Link>
                </>) : (<>
                    <Tooltip title={ t('nav_route_profile_tooltip') }>
                        <Link to="/profile">
                            <Button color="secondary" variant="text" startIcon={ <AccountCircleRounded/> }>
                                { username ? (
                                    username
                                ) : (
                                    t('nav_route_profile_short')
                                ) }
                            </Button>
                        </Link>
                    </Tooltip>
                    <Tooltip title={ t('nav_route_logout_tooltip') }>
                        <IconButton color="secondary"
                                    aria-label={ t('nav_route_logout_tooltip') }
                                    onClick={ logout }
                        >
                            <LogoutRounded/>
                        </IconButton>
                    </Tooltip>
                </>) }
            </Box>
        </>) }
    </Toolbar></AppBar>);
}

export default Header;
