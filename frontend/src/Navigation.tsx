import { JSX } from 'react';
import {
    AdminPanelSettingsRounded,
    CalendarMonthRounded,
    EditCalendarRounded,
    HomeRounded,
    LoginRounded,
    MeetingRoomRounded,
    PersonAddRounded,
} from '@mui/icons-material';

import EUserRole from '../../backend/src/enums/EUserRole.ts';
import i18n, { i18nPromise } from './i18n.ts';

const { t } = i18n;
await i18nPromise;

export type NavigationProps = Record<string, {
    route: string;
    name: string;
    shortName?: string; // if defined, the route will appear in the mobile UI bottom navigation
    icon?: JSX.Element;
    primary?: boolean; // if it's a navigation route, is it a main one?
    permissions?: EUserRole; // role needed to see the site's content
}>;

const Navigation: NavigationProps = {
    Home: {
        route: '/',
        name: t('nav_route_main'),
        shortName: t('nav_route_main_short'),
        icon: <HomeRounded/>,
        primary: true,
    },
    Timetables: {
        route: '/timetables',
        name: t('nav_route_timetables'),
        shortName: t('nav_route_timetables_short'),
        icon: <CalendarMonthRounded/>,
        primary: true,
    },
    Rooms: {
        route: '/rooms',
        name: t('nav_route_rooms'),
        shortName: t('nav_route_rooms_short'),
        icon: <MeetingRoomRounded/>,
        primary: true,
    },
    TimetableMaker: {
        route: '/maker',
        name: t('nav_route_timetable_maker'),
        icon: <EditCalendarRounded/>,
        primary: true,
        permissions: EUserRole.Staff,
    },
    AdminPanel: {
        route: '/admin',
        name: t('nav_route_admin_panel'),
        icon: <AdminPanelSettingsRounded/>,
        primary: true,
        permissions: EUserRole.Admin,
    },
    Register: {
        route: '/register',
        name: t('nav_route_register'),
        icon: <PersonAddRounded/>,
        primary: false,
    },
    Login: {
        route: '/login',
        name: t('nav_route_login'),
        icon: <LoginRounded/>,
        primary: false,
    },
    UserPanel: {
        route: '/profile',
        name: t('nav_route_profile'),
        permissions: EUserRole.Student,
    },
    Onboarding: {
        route: '/onboarding',
        name: t('nav_route_onboarding'),
        permissions: EUserRole.Staff,
    },
    NotFound: {
        route: '/*',
        name: '404',
    },
    // : {
    //     route: '/',
    //     name: t('nav_route_'),
    //     icon: <Rounded/>,
    //     primary: false,
    //     permissions: EUserRole.,
    // },
};

export default Navigation;
