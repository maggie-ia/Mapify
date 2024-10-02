import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ConversationCategories = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const { language } = useLanguage();

    const translations = {
        es: {
            selectCategory: "Seleccionar categoría",
            loading: "Cargando categorías...",
            error: "Error al cargar las categorías"
        },
        en: {
            selectCategory: "Select category",
            loading: "Loading categories...",
            error: "Error loading categories"
        },
        fr: {
            selectCategory: "Sélectionner une catégorie",
            loading: "Chargement des catégories...",
            error: "Erreur lors du chargement des catégories"
        }
    };

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['conversationCategories'],
        queryFn: () => axios.get('/api/conversation-categories').then(res => res.data),
    });

    useEffect(() => {
        if (selectedCategory) {
            // Here you can implement logic to filter conversations by category
            console.log(`Selected category: ${selectedCategory}`);
        }
    }, [selectedCategory]);

    if (isLoading) return <p>{translations[language].loading}</p>;
    if (error) return <p>{translations[language].error}</p>;

    return (
        <div className="mt-4">
            <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={translations[language].selectCategory} />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ConversationCategories;