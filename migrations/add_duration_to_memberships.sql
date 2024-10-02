-- Añadir columna de duración a la tabla de membresías
ALTER TABLE memberships ADD COLUMN duration VARCHAR(20) NOT NULL DEFAULT 'monthly';

-- Actualizar los registros existentes
UPDATE memberships SET duration = 'monthly' WHERE duration IS NULL;

-- Insertar nuevas opciones de membresía
INSERT INTO memberships (name, duration, price) VALUES
('basic', 'sixMonths', 54.99),
('basic', 'yearly', 99.99),
('premium', 'sixMonths', 109.99),
('premium', 'yearly', 199.99);