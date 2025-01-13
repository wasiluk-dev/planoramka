import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import { LoginRounded } from '@mui/icons-material';

import APIService from '../../services/APIService.ts';
import { NotificationProps } from '../Components/Notification.tsx';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type LoginProps = {
    isUserOnMobile: boolean;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
}

const Login: React.FC<LoginProps> = ({ isUserOnMobile, setDocumentTitle, setUsername, setIsUserLoggedIn, setNotificationData }) => {
    useEffect(() => {
        setDocumentTitle(t('nav_route_login'));
    }, []);

    const navigate = useNavigate();

    const login = () => {
        const usernameInput = document.getElementById('username') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if (usernameInput?.value && passwordInput?.value) {
            APIService.loginUser({ username: usernameInput.value, password: passwordInput.value, })
                .then(session => {
                    if (!session) {
                        setNotificationData({
                            message: t(session.toString()),
                            severity: 'error',
                        })
                        return;
                    }

                    setUsername(session.username);
                    setIsUserLoggedIn(true);
                    setNotificationData({
                        message: t('notification_login_success'),
                        severity: 'success',
                    });

                    navigate('/');
                })
                .catch(err => setNotificationData({
                    message: t(err.toString()),
                    severity: 'error',
                }));
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
                login();
            } }
            sx={{ flexGrow: 1 }}
        >
            { !isUserOnMobile && (
                <Typography variant="h4">{ t('nav_route_login') }</Typography>
            ) }
            <TextField required label={ t('form_username') } type="text" id="username" name="username"/>
            <TextField required label={ t('form_password') } type="password" id="password" name="password"/>
            {/*<TextField label={ t('form_email') } type="email" id="email" name="email"/>*/}
            <Button type="submit" variant="contained" startIcon={ <LoginRounded/> } onClick={ login }>{ t('form_button_login') }</Button>
        </Grid2>
    )
}

export default Login;
