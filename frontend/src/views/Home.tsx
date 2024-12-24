import React, { useEffect } from 'react';

import ENavTabs from '../enums/ENavTabs';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type HomeProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | boolean>>;
}

const Home: React.FC<HomeProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    useEffect(() => {
        setDocumentTitle(t('nav_route_main'));
        setCurrentTabValue(ENavTabs.Home);
    }, []);

    return (<>
        Witaj!
    </>);
};

export default Home;
