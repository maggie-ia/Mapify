import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                setUser(response.data);
            }).catch(error => {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('token');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get('/api/auth/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { access_token, refresh_token, is_2fa_enabled } = response.data;
            
            if (is_2fa_enabled) {
                return { requires2FA: true, userId: response.data.user_id };
            }

            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            await fetchUser(access_token);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const verify2FA = async (userId, token) => {
        try {
            const response = await axios.post('/api/auth/verify-2fa', { userId, token });
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            await fetchUser(access_token);
            return { success: true };
        } catch (error) {
            console.error('2FA verification error:', error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            await axios.post('/api/auth/register', { username, email, password });
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const googleLogin = async (token) => {
        try {
            const response = await api.post('/auth/google-login', { token });
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const sendSmsCode = async (phoneNumber) => {
        try {
            await api.post('/auth/send-sms-code', { phone_number: phoneNumber });
        } catch (error) {
            console.error('Send SMS code error:', error);
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post('/api/auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            await axios.post('/api/auth/reset-password', { token, new_password: newPassword });
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const response = await axios.put('/api/auth/update-profile', updatedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(response.data);
            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    const verifySmsCode = async (phoneNumber, code) => {
        try {
            const response = await api.post('/auth/verify-sms-code', { phone_number: phoneNumber, code });
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Verify SMS code error:', error);
            throw error;
        }
    };



    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register, 
            verify2FA,
            forgotPassword, 
            resetPassword, 
            updateProfile,
            googleLogin,
            sendSmsCode,
            verifySmsCode,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};