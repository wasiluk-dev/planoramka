import React, { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type NotFoundProps = {
    // setCurrentTab: React.Dispatch<React.SetStateAction<EWeekday | false>>;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const NotFound: React.FC<NotFoundProps> = ({ setDocumentTitle }) => {
    useEffect(() => {
        setDocumentTitle('404');
        // setCurrentTab(false);
    }, []);

    return (
        <Stack
            spacing={ 2 }
            sx={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">{ t('404_message') }  ʅ ( ․ ⤙ ․) ʃ</Typography>
        </Stack>
    );
};

export default NotFound;
