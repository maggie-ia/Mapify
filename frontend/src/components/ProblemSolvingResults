import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const ProblemSolvingResults = ({ results }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            methods: "Métodos de resolución",
            stepByStep: "Explicación paso a paso",
            additionalResources: "Recursos adicionales",
        },
        en: {
            methods: "Resolution methods",
            stepByStep: "Step-by-step explanation",
            additionalResources: "Additional resources",
        },
        fr: {
            methods: "Méthodes de résolution",
            stepByStep: "Explication étape par étape",
            additionalResources: "Ressources supplémentaires",
        }
    };

    if (!results) return null;

    return (
        <div className="mt-4">
            <Accordion type="single" collapsible>
                <AccordionItem value="methods">
                    <AccordionTrigger>{translations[language].methods}</AccordionTrigger>
                    <AccordionContent>
                        {results.methods.map((method, index) => (
                            <div key={index} className="mb-2">
                                <h4 className="font-bold">{method[0]}</h4>
                                <p>{method[1]}</p>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stepByStep">
                    <AccordionTrigger>{translations[language].stepByStep}</AccordionTrigger>
                    <AccordionContent>
                        <p className="whitespace-pre-line">{results.step_by_step}</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="resources">
                    <AccordionTrigger>{translations[language].additionalResources}</AccordionTrigger>
                    <AccordionContent>
                        <ul>
                            {results.resources.map((resource, index) => (
                                <li key={index}>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-tertiary hover:underline">
                                        {resource.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ProblemSolvingResults;