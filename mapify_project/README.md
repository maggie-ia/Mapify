# Mapify Backend

Este es el backend de la aplicación Mapify, desarrollado con Flask.

## Estructura del Proyecto

```
mapify_project/
│
├── app/
│   ├── __init__.py
│   ├── models/
│   │   └── __init__.py
│   ├── routes/
│   │   └── __init__.py
│   ├── services/
│   │   └── __init__.py
│   └── utils/
│       └── __init__.py
│
├── config.py
├── requirements.txt
└── run.py
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
   ```