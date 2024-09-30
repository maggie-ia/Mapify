import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import * as RNIap from 'react-native-iap';

const PlanUpgrade = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Actualiza tu plan',
            basicPlan: 'Plan Básico',
            premiumPlan: 'Plan Premium',
            currentPlan: 'Plan actual:',
            upgrade: 'Actualizar',
            processing: 'Procesando...',
        },
        en: {
            title: 'Upgrade your plan',
            basicPlan: 'Basic Plan',
            premiumPlan: 'Premium Plan',
            currentPlan: 'Current plan:',
            upgrade: 'Upgrade',
            processing: 'Processing...',
        },
        fr: {
            title: 'Mettez à niveau votre plan',
            basicPlan: 'Plan de base',
            premiumPlan: 'Plan Premium',
            currentPlan: 'Plan actuel :',
            upgrade: 'Mettre à niveau',
            processing: 'Traitement en cours...',
        },
    };

    const [processing, setProcessing] = React.useState(false);
    const [currentPlan, setCurrentPlan] = React.useState('free'); // Assume 'free' is the default

    const handlePurchase = async (planType) => {
        setProcessing(true);
        try {
            const productId = Platform.select({
                ios: planType === 'basic' ? 'com.mapify.basicplan' : 'com.mapify.premiumplan',
                android: planType === 'basic' ? 'basic_plan' : 'premium_plan',
            });

            await RNIap.requestPurchase(productId);
            // After successful purchase
            setCurrentPlan(planType);
            // Here you would typically update the user's plan on your backend
        } catch (err) {
            console.error(err);
            // Handle error (e.g., show an error message to the user)
        } finally {
            setProcessing(false);
        }
    };

    return (
        <View className="p-4 bg-[#a7e3f4] rounded-lg">
            <Text className="text-2xl font-bold mb-4 text-[#545454]">{translations[language].title}</Text>
            <Text className="mb-2 text-[#3a7ca5]">{translations[language].currentPlan} {currentPlan}</Text>
            <TouchableOpacity
                className="bg-[#11ccf5] p-2 rounded mb-2"
                onPress={() => handlePurchase('basic')}
                disabled={processing || currentPlan === 'basic' || currentPlan === 'premium'}
            >
                <Text className="text-white text-center">
                    {processing ? translations[language].processing : translations[language].basicPlan}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-[#11ccf5] p-2 rounded"
                onPress={() => handlePurchase('premium')}
                disabled={processing || currentPlan === 'premium'}
            >
                <Text className="text-white text-center">
                    {processing ? translations[language].processing : translations[language].premiumPlan}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PlanUpgrade;