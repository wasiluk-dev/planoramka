import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { ThemeProvider } from '@mui/material';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.tsx';
import theme from './Theme.ts';
import { AuthProvider } from './hooks/useAuth.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render((
    <React.StrictMode>
        <ThemeProvider theme={ theme } defaultMode="light">
            <CookiesProvider defaultSetOptions={{ path: '/' }}>
                <AuthProvider>
                    <App theme={ theme }/>
                </AuthProvider>
            </CookiesProvider>
        </ThemeProvider>
    </React.StrictMode>
));
