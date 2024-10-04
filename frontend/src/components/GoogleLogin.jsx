import React from 'react';
import { useGoogleLogin } from 'react-google-login';
import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";

const GoogleLogin = () => {
    const { googleLogin } = useAuth();

    const onSuccess = async (res) => {
        try {
            await googleLogin(res.tokenId);
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const onFailure = (res) => {
        console.error('Google login failed:', res);
    };

    const { signIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        isSignedIn: false,
        accessType: 'offline',
    });

    return (
        <Button onClick={signIn} className="bg-white text-gray-700 border border-gray-300">
            <img src="google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
            Iniciar sesión con Google
        </Button>
    );
};

export default GoogleLogin;