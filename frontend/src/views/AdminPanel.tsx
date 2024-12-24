import React, { useEffect } from 'react';

import NotFound from './NotFound.tsx';
import ENavTabs from '../enums/ENavTabs.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type AdminPanelProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | boolean>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    useEffect(() => {
        setDocumentTitle(t('nav_route_admin_panel'));
        setCurrentTabValue(ENavTabs.AdminPanel);
    }, []);

    return (
        <NotFound setDocumentTitle={ setDocumentTitle }/>
    );
};

export default AdminPanel;
