import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

const ChatPersonalization = ({ onThemeChange, onFontSizeChange }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            theme: "Tema",
            fontSize: "Tamaño de fuente",
            light: "Claro",
            dark: "Oscuro",
            small: "Pequeño",
            medium: "Mediano",
            large: "Grande",
            suggestions: "Mostrar sugerencias"
        },
        en: {
            theme: "Theme",
            fontSize: "Font size",
            light: "Light",
            dark: "Dark",
            small: "Small",
            medium: "Medium",
            large: "Large",
            suggestions: "Show suggestions"
        },
        fr: {
            theme: "Thème",
            fontSize: "Taille de police",
            light: "Clair",
            dark: "Sombre",
            small: "Petit",
            medium: "Moyen",
            large: "Grand",
            suggestions: "Afficher les suggestions"
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-quaternary">{translations[language].theme}</label>
                <Select onValueChange={onThemeChange} defaultValue="light">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={translations[language].theme} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">{translations[language].light}</SelectItem>
                        <SelectItem value="dark">{translations[language].dark}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium text-quaternary">{translations[language].fontSize}</label>
                <Select onValueChange={onFontSizeChange} defaultValue="medium">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={translations[language].fontSize} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="small">{translations[language].small}</SelectItem>
                        <SelectItem value="medium">{translations[language].medium}</SelectItem>
                        <SelectItem value="large">{translations[language].large}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-quaternary">{translations[language].suggestions}</span>
                <Switch />
            </div>
        </div>
    );
};

export default ChatPersonalization;