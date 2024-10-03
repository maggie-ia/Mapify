import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();

  const translations = {
    es: {
      title: 'Iniciar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      login: 'Iniciar sesión',
      register: '¿No tienes una cuenta? Regístrate',
      googleLogin: 'Iniciar sesión con Google'
    },
    en: {
      title: 'Log in',
      email: 'Email',
      password: 'Password',
      login: 'Log in',
      register: "Don't have an account? Sign up",
      googleLogin: 'Login with Google'
    },
    fr: {
      title: 'Connexion',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      login: 'Se connecter',
      register: "Vous n'avez pas de compte ? Inscrivez-vous",
      googleLogin: 'Se connecter avec Google'
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const response = await axios.post('/api/auth/login', { firebase_token: idToken });
      await login(response.data);
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
      const idToken = await result.user.getIdToken();
      const response = await axios.post('/api/auth/login', { firebase_token: idToken });
      await login(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error during Google login:', error);
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
      <p className="mt-4 text-center text-quaternary">
        <a href="/register" className="hover:underline">
          {translations[language].register}
        </a>
      </p>
    </div>
  );
};

export default Login;