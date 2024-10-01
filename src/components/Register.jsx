import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Registro',
      username: 'Nombre de usuario',
      email: 'Correo electrónico',
      password: 'Contraseña',
      register: 'Registrarse',
      login: '¿Ya tienes una cuenta? Inicia sesión'
    },
    en: {
      title: 'Register',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      register: 'Register',
      login: 'Already have an account? Log in'
    },
    fr: {
      title: 'Inscription',
      username: "Nom d'utilisateur",
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      register: "S'inscrire",
      login: 'Vous avez déjà un compte ? Connectez-vous'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (response.ok) {
        navigate('/login');
      } else {
        // Handle errors
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-center">{translations[language].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={translations[language].username}
          required
        />
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
          {translations[language].register}
        </Button>
      </form>
      <p className="mt-4 text-center">
        <a href="/login" className="text-blue-500 hover:underline">
          {translations[language].login}
        </a>
      </p>
    </div>
  );
};

export default Register;