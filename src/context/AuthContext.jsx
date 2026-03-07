import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setUser(data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            toast.success('Logged in successfully!', {
                style: { background: '#0a0a0a', color: '#00f5ff', border: '1px solid #00f5ff', boxShadow: '0 0 10px #00f5ff' }
            });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed', {
                style: { background: '#0a0a0a', color: '#ff2d78', border: '1px solid #ff2d78', boxShadow: '0 0 10px #ff2d78' }
            });
            return false;
        }
    };

    const register = async (name, email, password, phone_number, whatsapp_number) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, phone_number, whatsapp_number });
            setUser(data);
            toast.success('Registration successful!', {
                style: { background: '#0a0a0a', color: '#00f5ff', border: '1px solid #00f5ff', boxShadow: '0 0 10px #00f5ff' }
            });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed', {
                style: { background: '#0a0a0a', color: '#ff2d78', border: '1px solid #ff2d78', boxShadow: '0 0 10px #ff2d78' }
            });
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            toast.success('Logged out', {
                style: { background: '#0a0a0a', color: '#bf00ff', border: '1px solid #bf00ff', boxShadow: '0 0 10px #bf00ff' }
            });
        } catch (error) {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
