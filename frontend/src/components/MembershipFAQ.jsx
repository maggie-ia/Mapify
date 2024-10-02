import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const MembershipFAQ = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Preguntas Frecuentes sobre Membresías',
            questions: [
                {
                    q: '¿Cuáles son los diferentes tipos de membresía?',
                    a: 'Ofrecemos tres tipos de membresía: Gratuita, Básica y Premium. Cada una tiene diferentes límites y características.'
                },
                {
                    q: '¿Cómo puedo actualizar mi membresía?',
                    a: 'Puede actualizar su membresía en la sección "Actualizar Membresía" de su perfil de usuario.'
                },
                {
                    q: '¿Qué pasa cuando expira mi período de prueba?',
                    a: 'Cuando expira su período de prueba, su cuenta vuelve automáticamente a una membresía gratuita.'
                },
                {
                    q: '¿Puedo cancelar mi membresía en cualquier momento?',
                    a: 'Sí, puede cancelar su membresía paga en cualquier momento. Su acceso continuará hasta el final del período de facturación actual.'
                }
            ]
        },
        en: {
            title: 'Membership FAQ',
            questions: [
                {
                    q: 'What are the different types of membership?',
                    a: 'We offer three types of membership: Free, Basic, and Premium. Each has different limits and features.'
                },
                {
                    q: 'How can I upgrade my membership?',
                    a: 'You can upgrade your membership in the "Upgrade Membership" section of your user profile.'
                },
                {
                    q: 'What happens when my trial period expires?',
                    a: 'When your trial period expires, your account automatically reverts to a free membership.'
                },
                {
                    q: 'Can I cancel my membership at any time?',
                    a: 'Yes, you can cancel your paid membership at any time. Your access will continue until the end of the current billing period.'
                }
            ]
        },
        fr: {
            title: 'FAQ sur les Adhésions',
            questions: [
                {
                    q: 'Quels sont les différents types d\'adhésion ?',
                    a: 'Nous proposons trois types d\'adhésion : Gratuite, Basique et Premium. Chacune a des limites et des fonctionnalités différentes.'
                },
                {
                    q: 'Comment puis-je mettre à niveau mon adhésion ?',
                    a: 'Vous pouvez mettre à niveau votre adhésion dans la section "Mettre à niveau l\'adhésion" de votre profil utilisateur.'
                },
                {
                    q: 'Que se passe-t-il lorsque ma période d\'essai expire ?',
                    a: 'Lorsque votre période d\'essai expire, votre compte revient automatiquement à une adhésion gratuite.'
                },
                {
                    q: 'Puis-je annuler mon adhésion à tout moment ?',
                    a: 'Oui, vous pouvez annuler votre adhésion payante à tout moment. Votre accès continuera jusqu\'à la fin de la période de facturation en cours.'
                }
            ]
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {translations[language].questions.map((item, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-bold">{item.q}</h3>
                        <p>{item.a}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default MembershipFAQ;