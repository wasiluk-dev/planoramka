import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

import Navigation from '../Navigation.tsx';
import pkg from '../../package.json' with { type: 'json' };
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type FooterProps = {
    isUserOnMobile: boolean;
}

const Footer: React.FC<FooterProps> = ({ isUserOnMobile }) => {
    const navigate = useNavigate();
    const appVersion: string = pkg.version;

    const [value, setValue] = React.useState(0);

    return (<>
        { !isUserOnMobile ? (
            <footer style={{ textAlign: 'center' }}>
                { `${ t('app_name') } v${ appVersion } ©️ Wasiluk Gabriel, Żamojda Marcin` }
            </footer>
        ) : (
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={ 3 }>
                <BottomNavigation showLabels
                                  value={ value }
                                  onChange={ (_, newValue) => {
                                      setValue(newValue);
                                  } }
                >
                    { Object.keys(Navigation).map((key, index) => {
                        const nav = Navigation[key];

                        if (!nav.shortName) return;

                        return (
                            <BottomNavigationAction key={ index }
                                                    icon={ nav.icon }
                                                    label={ nav.shortName }
                                                    onClick={ () => navigate(nav.route) }/>
                        );
                    }) }
                </BottomNavigation>
            </Paper>
        ) }
    </>);
}

export default Footer;
