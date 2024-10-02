-- Crear tabla para las categorías de conversación
CREATE TABLE conversation_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Añadir campo de retroalimentación a la tabla de chat_conversations
ALTER TABLE chat_conversations
ADD COLUMN feedback ENUM('positive', 'negative', 'neutral') DEFAULT 'neutral';

-- Añadir campo para el enlace compartido a la tabla de chat_conversations
ALTER TABLE chat_conversations
ADD COLUMN share_link VARCHAR(255) UNIQUE;

-- Insertar algunas categorías predeterminadas
INSERT INTO conversation_categories (name) VALUES
('General'),
('Técnico'),
('Creativo'),
('Análisis'),
('Otros');