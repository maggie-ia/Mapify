import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const TagManager = ({ tags, onAddTag }) => {
    const [newTag, setNewTag] = useState('');
    const { language } = useLanguage();

    const translations = {
        es: {
            addTag: "Añadir etiqueta",
            tagPlaceholder: "Nueva etiqueta...",
            tags: "Etiquetas:"
        },
        en: {
            addTag: "Add tag",
            tagPlaceholder: "New tag...",
            tags: "Tags:"
        },
        fr: {
            addTag: "Ajouter une étiquette",
            tagPlaceholder: "Nouvelle étiquette...",
            tags: "Étiquettes:"
        }
    };

    const handleAddTag = () => {
        if (newTag.trim()) {
            onAddTag(newTag.trim());
            setNewTag('');
        }
    };

    return (
        <div className="mb-4">
            <div className="flex mb-2">
                <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={translations[language].tagPlaceholder}
                    className="flex-grow mr-2"
                />
                <Button onClick={handleAddTag}>
                    {translations[language].addTag}
                </Button>
            </div>
            <div>
                <span className="font-bold">{translations[language].tags}</span>
                {tags.map((tag, index) => (
                    <span key={index} className="ml-2 px-2 py-1 bg-tertiary text-white rounded-full text-sm">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagManager;