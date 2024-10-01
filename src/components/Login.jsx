import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Iniciar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      login: 'Iniciar sesión',
      register: '¿No tienes una cuenta? Regístrate'
    },
    en: {
      title: 'Log in',
      email: 'Email',
      password: 'Password',
      login: 'Log in',
      register: "Don't have an account? Sign up"
    },
    fr: {
      title: 'Connexion',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      login: 'Se connecter',
      register: "Vous n'avez pas de compte ? Inscrivez-vous"
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        // Store the token in localStorage or a secure storage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        // Handle login errors
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-center">{translations[language].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translations[language].email}
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={translations[language].password}
          required
        />
        <Button type="submit" className="w-full">
          {translations[language].login}
        </Button>
      </form>
      <p className="mt-4 text-center">
        <a href="/register" className="text-blue-500 hover:underline">
          {translations[language].register}
        </a>
      </p>
    </div>
  );
};

export default Login;