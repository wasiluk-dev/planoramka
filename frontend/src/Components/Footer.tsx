import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, /* ToggleButton, ToggleButtonGroup */ } from '@mui/material';
// import { DarkModeRounded, LightModeRounded, SettingsRounded } from '@mui/icons-material';

import Navigation from '../Navigation.tsx';
import pkg from '../../package.json' with { type: 'json' };
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

type FooterProps = {
    isUserOnMobile: boolean;
    mode: 'light' | 'dark' | 'system' | undefined;
    setMode: (mode: ('light' | 'dark' | 'system' | null)) => void
}

const Footer: React.FC<FooterProps> = ({ isUserOnMobile, /* mode, setMode */ }) => {
    const navigate = useNavigate();
    const appVersion: string = pkg.version;

    const [value, setValue] = React.useState(0);

    // const handleMode = (_e: React.MouseEvent<HTMLElement>, newMode: 'light' | 'dark' | 'system') => {
    //     setMode(newMode);
    // };

    return (<>
        { !isUserOnMobile ? (
            <footer style={{ textAlign: 'center', /* height: '56px', */ zIndex: 1100 }}>
                { `${ t('app_name') } v${ appVersion } ©️ Wasiluk Gabriel, Żamojda Marcin` }
                {/*<ToggleButtonGroup*/}
                {/*    exclusive*/}
                {/*    value={ mode }*/}
                {/*    onChange={ handleMode }*/}
                {/*>*/}
                {/*    <ToggleButton value="light">*/}
                {/*        <LightModeRounded/>*/}
                {/*    </ToggleButton>*/}
                {/*    <ToggleButton value="dark">*/}
                {/*        <DarkModeRounded/>*/}
                {/*    </ToggleButton>*/}
                {/*    <ToggleButton value="system">*/}
                {/*        <SettingsRounded/>*/}
                {/*    </ToggleButton>*/}
                {/*</ToggleButtonGroup>*/}
            </footer>
        ) : (
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={ 3 }>
                <BottomNavigation
                    showLabels
                    value={ value }
                    onChange={ (_, newValue) => {
                                      setValue(newValue);
                                  } }
                >
                    { Object.keys(Navigation).map(key => {
                        const nav = Navigation[key];

                        if (!nav.shortName) return;

                        return (
                            <BottomNavigationAction
                                key={ nav.name }
                                icon={ nav.icon }
                                label={ nav.shortName }
                                onClick={ () => navigate(nav.route) }
                            />
                        );
                    }) }
                </BottomNavigation>
            </Paper>
        ) }
    </>);
}

export default Footer;
