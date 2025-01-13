import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import { PersonAddRounded } from '@mui/icons-material';

import APIService from '../../services/APIService.ts';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type RegisterProps = {
    isUserOnMobile: boolean;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const Register: React.FC<RegisterProps> = ({ isUserOnMobile, setDocumentTitle }) => {
    const navigate = useNavigate();

    useEffect(() => {
        setDocumentTitle(t('nav_route_register'));
    }, []);

    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [namesError, setNamesError] = useState(false);
    const [surnamesError, setSurnamesError] = useState(false);

    const [registerButtonDisabled, setRegisterButtonDisabled] = useState<boolean>(false);
    useEffect(() => {
        if (usernameError || passwordError || namesError || surnamesError) {
            setRegisterButtonDisabled(true);
        } else {
            setRegisterButtonDisabled(false);
        }
    }, [usernameError, passwordError, namesError, surnamesError]);

    const handleUsernameBlur = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const username: string = event.target.value;
        if (username.length > 0 && username.length < 3) {
            setUsernameError(t('form_username_error_length'));
        } else {
            setUsernameError(false);
        }
    }
    const handlePasswordBlur = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const password: string = event.target.value;
        if (password.length > 0 && password.length < 8) {
            setPasswordError(t('form_password_error_length'));
        } else {
            setPasswordError(false);
        }
    }
    const handleNamesBlur = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const names: string = event.target.value;
        if (names.length > 0 && names[0] !== names[0].toUpperCase()) {
            setNamesError(t('form_names_error_case'));
        } else {
            setNamesError(false);
        }
    }
    const handleSurnamesBlur = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const surnames: string = event.target.value;
        if (surnames.length > 0 && surnames[0] !== surnames[0].toUpperCase()) {
            setSurnamesError(t('form_surnames_error_case'));
        } else {
            setSurnamesError(false);
        }
    }

    const register = () => {
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const namesInput = document.getElementById('names') as HTMLInputElement;
        const surnamesInput = document.getElementById('surnames') as HTMLInputElement;

        if (usernameInput.value && passwordInput.value && namesInput.value && surnamesInput.value) {
            APIService.registerUser({
                username: usernameInput.value,
                password: passwordInput.value,
                names: namesInput.value,
                surnames: surnamesInput.value,
            }).then((response) => {
                if (response?.ok) {
                    navigate('/login');
                }
            });
        } else {
            throw new Error('Wystąpił błąd podczas rejestracji.');
        }
    };

    return (<>
        <Grid2
            container
            spacing={ 2 }
            direction="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={ (e) => {
                e.preventDefault();
                register();
            } }
            sx={{ flexGrow: 1 }}
        >
            { !isUserOnMobile && (
                <Typography variant="h4">{ t('nav_route_register') }</Typography>
            ) }
            <TextField required label={ t('form_username') } type="text" id="username" name="username"
                       onBlur={ handleUsernameBlur } error={ usernameError } helperText={ usernameError }/>
            <TextField required label={ t('form_password') } type="password" id="password" name="password"
                       onBlur={ handlePasswordBlur } error={ passwordError } helperText={ passwordError }/>
            <TextField required label={ t('form_names') } type="text" id="names" name="names"
                       onBlur={ handleNamesBlur } error={ namesError } helperText={ namesError }/>
            <TextField required label={ t('form_surnames') } type="text" id="surnames" name="surnames"
                       onBlur={ handleSurnamesBlur } error={ surnamesError } helperText={ surnamesError }/>
            {/*<TextField label="Adres e-mail" type="email" id="email" name="email" required/>*/}

            <Button type="submit"
                    variant="contained"
                    onClick={ register }
                    startIcon={ <PersonAddRounded/> }
                    disabled={ registerButtonDisabled }>
                { t('form_button_register') }
            </Button>
        </Grid2>
    </>)
};

export default Register;
