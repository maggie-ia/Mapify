import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from '../hooks/useAuth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const PhoneLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'code'
    const navigate = useNavigate();
    const { login } = useAuth();

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                handleSendCode();
            }
        });
    };

    const handleSendCode = async () => {
        if (!window.recaptchaVerifier) {
            setupRecaptcha();
        }
        const appVerifier = window.recaptchaVerifier;
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            setStep('code');
        } catch (error) {
            console.error('Error sending SMS code:', error);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const result = await window.confirmationResult.confirm(code);
            await login(result.user);
            navigate('/');
        } catch (error) {
            console.error('Error verifying SMS code:', error);
        }
    };

    return (
        <div className="space-y-4">
            {step === 'phone' ? (
                <>
                    <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Número de teléfono"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <Button onClick={handleSendCode} className="w-full bg-tertiary text-white">
                        Enviar código
                    </Button>
                </>
            ) : (
                <>
                    <Input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Código de verificación"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <Button onClick={handleVerifyCode} className="w-full bg-tertiary text-white">
                        Verificar código
                    </Button>
                </>
            )}
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default PhoneLogin;