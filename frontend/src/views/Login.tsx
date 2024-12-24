import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField } from '@mui/material';
import { LoginRounded } from '@mui/icons-material';

import APIService from '../../services/apiService.tsx';
import { NotificationProps } from '../Components/Notification.tsx';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type LoginProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
}

const Login: React.FC<LoginProps> = ({ setDocumentTitle, setUsername, setIsUserLoggedIn, setNotificationData }) => {
    useEffect(() => {
        setDocumentTitle(t('nav_route_login'));
    }, []);

    const navigate = useNavigate();

    const login = () => {
        const usernameInput = document.getElementById('username') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if (usernameInput?.value && passwordInput?.value) {
            APIService.loginUser({
                username: usernameInput.value,
                password: passwordInput.value,
            }).then((session) => {
                setUsername(session.username);
                setIsUserLoggedIn(true);
                setNotificationData({
                    message: 'Pomyślnie zalogowano.',
                    severity: 'success',
                });

                navigate('/');
            });
        } else {
            setNotificationData({
                message: 'Wypełnij wszystkie pola formularza.',
                severity: 'warning',
            });
        }
    }

    return (
        <Stack
            spacing={ 0 }
            direction="column"
            sx={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            component="form"
            onSubmit={ (e) => {
                e.preventDefault();
                login();
            } }
            // sx={{ minHeight: '100vh' }}
        >
            <TextField required label={ t('form_username') } type="text" id="username" name="username"/>
            <TextField required label={ t('form_password') } type="password" id="password" name="password"/>
            {/*<TextField label={ t('form_email') } type="email" id="email" name="email"/>*/}
            <Button type="submit" variant="contained" startIcon={ <LoginRounded/> } onClick={ login }>{ t('form_button_login') }</Button>
        </Stack>
    )
}

export default Login;
