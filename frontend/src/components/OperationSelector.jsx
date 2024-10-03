import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from '../contexts/LanguageContext';

const OperationSelector = ({ operation, setOperation }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            selectOperation: "Seleccionar operación",
            chat: "Chat",
            summarize: "Resumir",
            paraphrase: "Parafrasear",
            synthesize: "Sintetizar",
            relevantPhrases: "Frases Relevantes",
            conceptMap: "Mapa Conceptual",
            translate: "Traducir",
            problemSolving: "Resolver Problema",
            explainProblem: "Explicar Problema"
        },
        en: {
            selectOperation: "Select operation",
            chat: "Chat",
            summarize: "Summarize",
            paraphrase: "Paraphrase",
            synthesize: "Synthesize",
            relevantPhrases: "Relevant Phrases",
            conceptMap: "Concept Map",
            translate: "Translate",
            problemSolving: "Solve Problem",
            explainProblem: "Explain Problem"
        },
        fr: {
            selectOperation: "Sélectionner l'opération",
            chat: "Chat",
            summarize: "Résumer",
            paraphrase: "Paraphraser",
            synthesize: "Synthétiser",
            relevantPhrases: "Phrases Pertinentes",
            conceptMap: "Carte Conceptuelle",
            translate: "Traduire",
            problemSolving: "Résoudre le Problème",
            explainProblem: "Expliquer le Problème"
        }
    };

    return (
        <Select onValueChange={setOperation} defaultValue={operation}>
            <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder={translations[language].selectOperation} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="chat">{translations[language].chat}</SelectItem>
                <SelectItem value="summarize">{translations[language].summarize}</SelectItem>
                <SelectItem value="paraphrase">{translations[language].paraphrase}</SelectItem>
                <SelectItem value="synthesize">{translations[language].synthesize}</SelectItem>
                <SelectItem value="relevantPhrases">{translations[language].relevantPhrases}</SelectItem>
                <SelectItem value="conceptMap">{translations[language].conceptMap}</SelectItem>
                <SelectItem value="translate">{translations[language].translate}</SelectItem>
                <SelectItem value="problemSolving">{translations[language].problemSolving}</SelectItem>
                <SelectItem value="explainProblem">{translations[language].explainProblem}</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default OperationSelector;