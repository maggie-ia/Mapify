-- Update prices for Basic membership
UPDATE memberships
SET price = 
    CASE 
        WHEN duration = 'monthly' THEN 4.99
        WHEN duration = 'sixMonths' THEN 32.99
        WHEN duration = 'yearly' THEN 57.99
    END
WHERE name = 'basic';

-- Update prices for Premium membership
UPDATE memberships
SET price = 
    CASE 
        WHEN duration = 'monthly' THEN 11.99
        WHEN duration = 'sixMonths' THEN 67.99
        WHEN duration = 'yearly' THEN 117.99
    END
WHERE name = 'premium';