import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import GoogleLogin from 'react-google-login';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      // Here you would typically show an error message to the user
    }
  };

  const responseGoogle = (response) => {
    if (response.profileObj) {
      // Handle successful Google login
      console.log('Google login success:', response.profileObj);
      // You should implement the logic to send this data to your backend
      // and then log the user in
      navigate('/');
    } else {
      console.error('Google login failed:', response);
      // Handle failed login
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-center text-primary">{translations[language].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID" // Reemplaza esto con tu ID de cliente de Google
          buttonText={translations[language].googleLogin}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          className="w-full"
        />
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