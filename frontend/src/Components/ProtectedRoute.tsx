import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Loading from './Loading.tsx';
import useAuth from '../hooks/useAuth.tsx';

import EUserRole from '../../../backend/src/enums/EUserRole.ts';
import { NotificationProps } from './Notification.tsx';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type ProtectedRouteProps = {
    permissions?: EUserRole;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permissions, setNotificationData }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading/>;

    if (!user) {
        setNotificationData({
            message: t('nav_protected_login_needed'),
            severity: 'warning',
        });

        return <Navigate to="/login" replace state={{ from: location }}/>;
    } else if (permissions && user.role < permissions) {
        setNotificationData({
            message: t('nav_protected_permissions_missing'),
            severity: 'error',
        });

        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
};

export default ProtectedRoute;
