import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';

import useAuth from '../hooks/useAuth.tsx';

import { NavigationProps } from '../Navigation.tsx';
import i18n, { i18nPromise } from '../i18n.ts';
import { AccountCircleRounded, LogoutRounded } from '@mui/icons-material';

const { t } = i18n;
await i18nPromise;

type NavDrawerProps = {
    navRoutes: NavigationProps;
    navDrawerOpen: boolean;
    setNavDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBottomNavigationValue: React.Dispatch<React.SetStateAction<number | false>>;
}
const NavDrawer: React.FC<NavDrawerProps> = ({ navRoutes, navDrawerOpen, setNavDrawerOpen, setBottomNavigationValue }) => {
    const { user, logout } = useAuth();

    const DrawerList = (
        <Box onClick={ () => setNavDrawerOpen(false) }>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{ t('app_name') }</Typography>
                </Toolbar>
            </AppBar>

            <List>
                { Object.keys(navRoutes).map((key, index) => {
                    const nav = navRoutes[key];
                    if (nav.primary === false || !nav.icon) return;

                    return (
                        <ListItem key={ index } disablePadding>
                            <ListItemButton component={ Link } to={ nav.route } onClick={ () => setBottomNavigationValue(false) }>
                                <ListItemIcon>{ nav.icon }</ListItemIcon>
                                <ListItemText primary={ nav.name }/>
                            </ListItemButton>
                        </ListItem>
                    );
                }) }
            </List>

            <Divider/>

            <List>
                { !user ? Object.keys(navRoutes).map((key, index) => {
                    const nav = navRoutes[key];
                    if (nav.primary === true || !nav.icon) return;

                    return (
                        <ListItem key={ index } disablePadding>
                            <ListItemButton component={ Link } to={ nav.route }>
                                <ListItemIcon>{ nav.icon }</ListItemIcon>
                                <ListItemText primary={ nav.name }/>
                            </ListItemButton>
                        </ListItem>
                    );
                }) : (<>
                    <ListItem key={ 0 } disablePadding>
                        <ListItemButton component={ Link } to="/profile">
                            <ListItemIcon><AccountCircleRounded/></ListItemIcon>
                            <ListItemText primary={ user.username ? user.username : t('nav_route_profile_short') }/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={ 1 } disablePadding>
                        <ListItemButton onClick={ logout }>
                            <ListItemIcon><LogoutRounded/></ListItemIcon>
                            <ListItemText primary={ t('nav_route_logout_tooltip') }/>
                        </ListItemButton>
                    </ListItem>
                </>) }
            </List>
        </Box>
    );

    return (
        <Drawer
            open={ navDrawerOpen }
            onClose={ () => setNavDrawerOpen(false) }
        >
            { DrawerList }
        </Drawer>
    );
};

export default NavDrawer;
