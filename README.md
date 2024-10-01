# Mapify Backend

Este es el backend de la aplicación Mapify, desarrollado con Flask.

## Estructura del Proyecto

```
Mapify/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── document.py
│   │   │   ├── init__.py
│   │   │   └── user.py
│   │   ├── routes/
│   │   │   ├── api.py
│   │   │   ├── auth.py
│   │   │   ├── document.py
│   │   │   └── init__.py
│   │   ├── services/
│   │   │   ├── concept_map_service.py
│   │   │   ├── paraphrase_service.py
│   │   │   ├── synthesis_service.py
│   │   │   ├── text_processing.py
│   │   └── tests/
│   │       ├── test_connections.py
│   ├── utils/
│   │   ├── conceptMapGenerator.js
│   ├── config.py
│   ├── create_tables.py
│   ├── run.py
│   ├── routes.py
│   └── serviceAccountKey.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ConceptMap.jsx
│       │   ├── ExportOptions.jsx
│       │   ├── FileUpload.jsx
│       │   ├── Header.jsx
│       │   ├── Login.jsx
│       │   ├── MembershipOptions.jsx
│       │   ├── MembershipSelection.jsx
│       │   ├── Navigation.jsx
│       │   ├── OperationSelection.jsx
│       │   ├── Register.jsx
│       │   ├── RelevantPhrases.jsx
│       │   ├── ResultDisplay.jsx
│       │   ├── Results.jsx
│       │   ├── Summary.jsx
│       │   ├── TranslatedText.jsx
│       ├── contexts/
│       │   ├── AuthContext.jsx
│       │   └── LanguageContext.jsx
│       ├── hooks/
│       │   └── useAuth.jsx
│       ├── pages/
│       │   ├── FileUpload.jsx
│       │   ├── Home.jsx
│       │   ├── MembershipSelection.jsx
│       │   ├── OperationSelection.jsx
│       │   ├── Results.jsx
│       │   ├── Settings.jsx
│       ├── services/
│       │   ├── exportService.js
│       │   ├── fileService.js
│       │   └── textProcessingService.js
│       ├── utils/
│       │   └── index.css
│       ├── App.jsx
│       ├── index.css
│       ├── index.js
│       └── main.jsx
│
├── migrations/
│   └── versions/
├── node_modules/
├── uploads/
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── requirements.txt
└── tailwind.config.js

```

## Configuración

1. Crea un entorno virtual:
   ```
   python -m venv venv
   ```

2. Activa el entorno virtual:
   - En Windows: `venv\Scripts\activate`
   - En macOS y Linux: `source venv/bin/activate`

3. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

4. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto.

5. Ejecuta la aplicación:
   ```
   python run.py