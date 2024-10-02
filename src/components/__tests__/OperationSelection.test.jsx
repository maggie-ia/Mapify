import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import OperationSelection from '../OperationSelection';

const queryClient = new QueryClient();

const renderWithProviders = (component) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <MemoryRouter>
                    {component}
                </MemoryRouter>
            </LanguageProvider>
        </QueryClientProvider>
    );
};

describe('OperationSelection', () => {
    test('renders all operation buttons', () => {
        renderWithProviders(<OperationSelection />);
        
        expect(screen.getByText('Resumir')).toBeInTheDocument();
        expect(screen.getByText('Parafrasear')).toBeInTheDocument();
        expect(screen.getByText('Sintetizar')).toBeInTheDocument();
        expect(screen.getByText('Mapa Conceptual')).toBeInTheDocument();
        expect(screen.getByText('Frases Relevantes')).toBeInTheDocument();
        expect(screen.getByText('Traducir')).toBeInTheDocument();
    });

    test('calls handleOperationSelect when a button is clicked', () => {
        renderWithProviders(<OperationSelection />);
        
        const summarizeButton = screen.getByText('Resumir');
        fireEvent.click(summarizeButton);

        // Add assertions here to check if the handleOperationSelect function was called
        // This might require mocking the function or checking for side effects
    });
});