import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('voicebox_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('voicebox_user', JSON.stringify(userData));
        if (token) localStorage.setItem('voicebox_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('voicebox_user');
        localStorage.removeItem('voicebox_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
