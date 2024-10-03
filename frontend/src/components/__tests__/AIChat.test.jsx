import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AIChat from '../AIChat';
import { AuthProvider } from '../../contexts/AuthContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

const queryClient = new QueryClient();

const mockUser = {
    membership_type: 'premium'
};

jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({ user: mockUser })
}));

describe('AIChat Component', () => {
    const renderComponent = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <LanguageProvider>
                        <AIChat documentId="123" />
                    </LanguageProvider>
                </AuthProvider>
            </QueryClientProvider>
        );
    };

    it('renders correctly for premium users', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Type your question here...')).toBeInTheDocument();
        });
    });

    it('shows not available message for non-premium users', async () => {
        mockUser.membership_type = 'basic';
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('AI chat is only available for premium users.')).toBeInTheDocument();
        });
    });

    it('sends a message when the send button is clicked', async () => {
        mockUser.membership_type = 'premium';
        renderComponent();
        await waitFor(() => {
            const input = screen.getByPlaceholderText('Type your question here...');
            fireEvent.change(input, { target: { value: 'Test message' } });
            fireEvent.click(screen.getByText('Send'));
        });
        // Add assertions for the expected behavior after sending a message
    });

    // Add more tests as needed
});