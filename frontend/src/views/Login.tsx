import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import { LoginRounded } from '@mui/icons-material';

import useAuth from '../hooks/useAuth.tsx';

import { NotificationProps } from '../components/Notification.tsx';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type LoginProps = {
    isUserOnMobile: boolean;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
}

const Login: React.FC<LoginProps> = ({ isUserOnMobile, setDocumentTitle, setNotificationData }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';

    const { login } = useAuth();

    useEffect(() => {
        setDocumentTitle(t('nav_route_login'));
    }, []);

    const handleLogin = () => {
        const usernameInput = document.getElementById('username') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if (usernameInput?.value && passwordInput?.value) {
            login(usernameInput.value, passwordInput.value)
                .then(() => {
                    setNotificationData({
                        message: t('notification_login_success'),
                        severity: 'success',
                    });

                    navigate(from, { replace: true });
                })
                .catch(err => setNotificationData({
                    message: t(err.toString()),
                    severity: 'error',
                }));
            // APIService.loginUser({ username: usernameInput.value, password: passwordInput.value })
            //     .then(user => {
            //         if (!user) {
            //             setNotificationData({
            //                 message: t(user.toString()),
            //                 severity: 'error',
            //             });
            //
            //             return;
            //         }
            //
            //         setUser(user);
            //         setNotificationData({
            //             message: t('notification_login_success'),
            //             severity: 'success',
            //         });
            //
            //         navigate(from, { replace: true });
            //     })
            //     .catch(err => setNotificationData({
            //         message: t(err.toString()),
            //         severity: 'error',
            //     }));
        } else {
            setNotificationData({
                message: t('notification_form_unfinished'),
                severity: 'warning',
            });
        }
    }

    return (
        <Grid2
            container
            spacing={ 2 }
            direction="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={ (e) => {
                e.preventDefault();
                handleLogin();
            } }
            sx={{ flexGrow: 1 }}
        >
            { !isUserOnMobile && (
                <Typography variant="h4">{ t('nav_route_login') }</Typography>
            ) }

            <TextField required label={ t('form_username') } type="text" id="username" name="username"/>
            <TextField required label={ t('form_password') } type="password" id="password" name="password"/>
            {/*<TextField label={ t('form_email') } type="email" id="email" name="email"/>*/}

            <Button type="submit" variant="contained" startIcon={ <LoginRounded/> }>{ t('form_button_login') }</Button>
        </Grid2>
    )
}

export default Login;
