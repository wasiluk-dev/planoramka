import React, { createContext, useContext, useEffect, useState } from 'react';

import APIService from '../../services/APIService.ts';
import { UserPopulated } from '../../services/DBTypes.ts';

export type LoggedInUser = Pick<UserPopulated, '_id' | 'username' | 'title' | 'names' | 'surnames' | 'courses' | 'role'>;
type AuthContextType = {
    user: LoggedInUser | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');

                if (storedUser && storedUser !== 'undefined') {
                    setUser(JSON.parse(storedUser));
                } else {
                    const userData = await APIService.getLoggedInUser();
                    if (userData) {
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser().then();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const userData = await APIService.loginUser({ username, password });
            if (userData) {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (err) {
            throw err;
        }
    };

    const logout = async () => {
        await APIService.logoutUser();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider!');
    return context;
};

export default useAuth;
