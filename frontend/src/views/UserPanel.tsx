import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { SaveRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.tsx';

import theme from '../Theme.ts';
import Loading from '../components/Loading.tsx';

import APIService from '../../services/APIService.ts';
import EUserRole from '../../../backend/src/enums/EUserRole.ts';
import i18n, { i18nPromise } from '../i18n.ts';
import { NotificationProps } from '../components/Notification.tsx';

const { t } = i18n;
await i18nPromise;

type UserPanelProps = {
    isUserOnMobile: boolean;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setNotificationData: React.Dispatch<React.SetStateAction<NotificationProps['data']>>;
};

const UserPanel: React.FC<UserPanelProps> = ({ isUserOnMobile, setDocumentTitle, setNotificationData }) => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    if (loading) return <Loading/>;
    if (!user) return <Navigate to="/login" replace/>;

    const [names, setNames] = useState<string>(user.names ?? '');
    const [surnames, setSurnames] = useState<string>(user.surnames ?? '');
    const [password] = useState<string>('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

    useEffect(() => {
        setDocumentTitle(t('nav_route_profile'));
    }, []);
    useEffect(() => {
        if (user) {
            setNames(user.names ?? '');
            setSurnames(user.surnames ?? '');
        }
    }, [user, navigate]);

    const handleInputChange = (elementId: string) => {
        const input = document.getElementById(elementId) as HTMLInputElement;

        let value;
        switch (elementId) {
            case 'names': value = names; break;
            case 'surnames': value = surnames; break;
            case 'password': value = password; break;
        }

        console.log(value);
        setSubmitDisabled(input.value === value);
    }
    const handleSubmit = () => {
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;
        const namesInput = document.getElementById('names') as HTMLInputElement | null;
        const surnamesInput = document.getElementById('surnames') as HTMLInputElement | null;

        const updatedData: {
            password?: string;
            names?: string;
            surnames?: string;
        } = {};

        if (passwordInput?.value || namesInput?.value || surnamesInput?.value) {
            if (passwordInput?.value) {
                const password = passwordInput.value;
                if (password.length < 8) {
                    setNotificationData({
                        message: t('profile_field_password_invalid'),
                        severity: 'warning',
                    });

                    return;
                }

                updatedData.password = passwordInput.value;
            }
            if (namesInput?.value) updatedData.names = namesInput.value;
            if (surnamesInput?.value) updatedData.surnames = surnamesInput.value;

            APIService.updateUserById(user._id, updatedData).then(response => {
                if (response) {
                    setNotificationData({
                        message: t('profile_notification_update_success'),
                        severity: 'success',
                    });
                } else {
                    setNotificationData({
                        message: t('profile_notification_update_error'),
                        severity: 'error',
                    });
                }
            });
        }
    };

    return (<Box sx={{ display: 'flex', flex: 1, p: 4, alignContent: 'center', justifyContent: 'center' }}>
        <Stack
            spacing={ 2 }
            component="form"
            onSubmit={ event => {
                event.preventDefault();
                handleSubmit();
            } }
            sx={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: theme.breakpoints.values.sm / 2
            }}
        >
            { !isUserOnMobile && (
                <Typography variant="h4">{ t('nav_route_profile') }</Typography>
            ) }

            <TextField
                label={ t(`profile_field_username`) }
                defaultValue={ user.username }
                disabled
                fullWidth
            />

            <FormControl fullWidth>
                <InputLabel>{ t(`profile_field_password`) }</InputLabel>
                <OutlinedInput
                    id="password"
                    label={ t(`profile_field_password`) }
                    type={ passwordVisible ? 'text' : 'password' }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                onClick={ () => setPasswordVisible(!passwordVisible) }
                            >
                                { passwordVisible ? <VisibilityOff/> : <Visibility/> }
                            </IconButton>
                        </InputAdornment>
                    }
                    onChange={ () => handleInputChange('password') }
                />
            </FormControl>

            <TextField
                label={ t(`profile_field_title`) }
                defaultValue={ user.title }
                disabled
                fullWidth
            />

            <TextField
                id="names"
                label={ t(`profile_field_names`) }
                defaultValue={ names }
                onChange={ () => handleInputChange('names') }
                fullWidth
            />

            <TextField
                id="surnames"
                label={ t(`profile_field_surnames`) }
                defaultValue={ surnames }
                onChange={ () => handleInputChange('surnames') }
                fullWidth
            />

            <TextField
                label={ t(`profile_field_role`) }
                defaultValue={ t(`profile_role_${ EUserRole[parseInt(user.role.toString())] }`) }
                disabled
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                startIcon={ <SaveRounded/> }
                disabled={ submitDisabled }
                fullWidth
            >
                { t('form_button_save') }
            </Button>
        </Stack>
    </Box>);
};

export default UserPanel;
