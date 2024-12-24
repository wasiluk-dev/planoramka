import React from 'react';
import { Alert, AlertTitle, Snackbar, SnackbarProps } from '@mui/material';

export type NotificationProps = {
    data: {
        message: string;
        title?: string;
        severity?: 'success' | 'info' | 'warning' | 'error';
    }
    isUserOnMobile: boolean;
    isNotificationVisible: boolean;
    setIsNotificationVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Notification: React.FC<NotificationProps> = ({ data, isUserOnMobile, isNotificationVisible, setIsNotificationVisible } ) => {
    const style = {
        marginTop: !isUserOnMobile ? '66px' : 'unset',
        marginBottom: isUserOnMobile ? '56px' : 'unset',
    }
    const anchorOrigin: SnackbarProps['anchorOrigin'] = {
        vertical: isUserOnMobile ? 'bottom' : 'top',
        horizontal: 'right',
    };

    return (
        <Snackbar style={ style }
                  autoHideDuration={ 5000 }
                  anchorOrigin={ anchorOrigin }
                  open={ isNotificationVisible }
                  onClose={ () => setIsNotificationVisible(false) }
        >
            <Alert sx={{ width: '100%' }}
                   severity={ data.severity }
                   onClose={ () => setIsNotificationVisible(false) }
            >
                { data.title ? <AlertTitle>{ data.title }</AlertTitle> : null }
                { data.message }
            </Alert>
        </Snackbar>
    );
};

export default Notification;