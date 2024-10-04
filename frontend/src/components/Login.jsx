import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();

  const translations = {
    es: {
      title: 'Iniciar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      phone: 'Número de teléfono',
      verificationCode: 'Código de verificación',
      login: 'Iniciar sesión',
      register: '¿No tienes una cuenta? Regístrate',
      googleLogin: 'Iniciar sesión con Google',
      phoneLogin: 'Iniciar sesión con teléfono',
      sendCode: 'Enviar código',
      verify: 'Verificar'
    },
    en: {
      title: 'Log in',
      email: 'Email',
      password: 'Password',
      phone: 'Phone number',
      verificationCode: 'Verification code',
      login: 'Log in',
      register: "Don't have an account? Sign up",
      googleLogin: 'Login with Google',
      phoneLogin: 'Login with phone'
    },
    fr: {
      title: 'Connexion',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      phone: 'Numéro de téléphone',
      verificationCode: 'Code de vérification',
      login: 'Se connecter',
      register: "Vous n'avez pas de compte ? Inscrivez-vous",
      googleLogin: 'Se connecter avec Google',
      phoneLogin: 'Se connecter avec téléphone'
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await login(userCredential.user);
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      // Here you would typically show an error message to the user
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await login(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error during Google login:', error);
      // Handle error (show message to user)
    }
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        handlePhoneLogin();
      }
    });
  };

  const handlePhoneLogin = async () => {
    if (!window.recaptchaVerifier) {
      setupRecaptcha();
    }
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setShowVerificationInput(true);
    } catch (error) {
      console.error('Error during phone login:', error);
      // Handle error (show message to user)
    }
  };

  const verifyCode = async () => {
    try {
      const result = await window.confirmationResult.confirm(verificationCode);
      await login(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error during code verification:', error);
      // Handle error (show message to user)
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-center text-primary">{translations[language].title}</h2>
      <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translations[language].email}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={translations[language].password}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <Button type="submit" className="w-full bg-tertiary text-white hover:bg-quaternary">
          {translations[language].login}
        </Button>
      </form>
      <div className="mt-4">
        <Button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white hover:bg-red-600">
          {translations[language].googleLogin}
        </Button>
      </div>
      <div className="mt-4">
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder={translations[language].phone}
          className="w-full px-3 py-2 border rounded-md"
        />
        {!showVerificationInput ? (
          <Button onClick={handlePhoneLogin} className="w-full mt-2 bg-green-500 text-white hover:bg-green-600">
            {translations[language].sendCode}
          </Button>
        ) : (
          <>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={translations[language].verificationCode}
              className="w-full mt-2 px-3 py-2 border rounded-md"
            />
            <Button onClick={verifyCode} className="w-full mt-2 bg-green-500 text-white hover:bg-green-600">
              {translations[language].verify}
            </Button>
          </>
        )}
      </div>
      <div id="recaptcha-container"></div>
      <p className="mt-4 text-center text-quaternary">
        <a href="/register" className="hover:underline">
          {translations[language].register}
        </a>
      </p>
    </div>
  );
};

export default Login;
