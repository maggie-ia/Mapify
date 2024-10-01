import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { register } = useAuth();

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
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      // Here you would typically show an error message to the user
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-center text-primary">{translations[language].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={translations[language].username}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
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
          {translations[language].register}
        </Button>
      </form>
      <p className="mt-4 text-center text-quaternary">
        <a href="/login" className="hover:underline">
          {translations[language].login}
        </a>
      </p>
    </div>
  );
};

export default Register;