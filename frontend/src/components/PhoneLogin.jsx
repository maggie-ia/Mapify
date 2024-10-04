import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const PhoneLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'code'
    const { sendSmsCode, verifySmsCode } = useAuth();

    const handleSendCode = async () => {
        try {
            await sendSmsCode(phoneNumber);
            setStep('code');
        } catch (error) {
            console.error('Error sending SMS code:', error);
        }
    };

    const handleVerifyCode = async () => {
        try {
            await verifySmsCode(phoneNumber, code);
            // Redirect or update UI after successful login
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
        </div>
    );
};

export default PhoneLogin;