import React, { useEffect } from 'react';

import NotFound from './NotFound.tsx';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type CreatePanelProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const CreatePanel: React.FC<CreatePanelProps> = ({ setDocumentTitle }) => {
    useEffect(() => {
        setDocumentTitle(t('nav_route_rooms'));
    }, []);

    return (
        <NotFound setDocumentTitle={ setDocumentTitle }/>
    );
};

export default CreatePanel;
