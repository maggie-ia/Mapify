import re
from transformers import pipeline
import spacy
import PyPDF2
from io import BytesIO
import docx

summarizer = pipeline("summarization")
nlp = spacy.load("es_core_news_sm")

# ... keep existing code (extract_text_from_pdf, extract_text_from_docx, process_file, summarize_text)

def identify_problems(text):
    """
    Identifica problemas matemáticos, físicos o químicos en el texto.
    """
    math_pattern = r'\b(?:calcul[ae]|encuentr[ae]|determin[ae])\b.*?(?:\d+|\bx\b|\by\b)'
    physics_pattern = r'\b(?:velocidad|aceleración|fuerza|energía)\b.*?(?:\d+\s*[a-zA-Z]+/?[a-zA-Z]*|\d+\s*\w+\s*por\s*\w+)'
    chemistry_pattern = r'\b(?:mol[es]?|concentración|pH)\b.*?(?:\d+(?:\.\d+)?|\w+\s*\+\s*\w+)'

    problems = []
    for sentence in nlp(text).sents:
        sentence_text = sentence.text
        if re.search(math_pattern, sentence_text, re.IGNORECASE):
            problems.append(('matemática', sentence_text))
        elif re.search(physics_pattern, sentence_text, re.IGNORECASE):
            problems.append(('física', sentence_text))
        elif re.search(chemistry_pattern, sentence_text, re.IGNORECASE):
            problems.append(('química', sentence_text))

    return problems

def solve_problem(problem):
    """
    Intenta resolver un problema matemático, físico o químico.
    """
    # Esta es una implementación básica. En un sistema real, se utilizaría
    # un motor de resolución de problemas más avanzado.
    return f"Para resolver el problema '{problem}', se recomienda seguir estos pasos:\n" \
           f"1. Identificar las variables y datos conocidos.\n" \
           f"2. Determinar la fórmula o ecuación apropiada.\n" \
           f"3. Sustituir los valores conocidos en la ecuación.\n" \
           f"4. Resolver la ecuación para encontrar la incógnita.\n" \
           f"5. Verificar que la solución tenga sentido en el contexto del problema."

def explain_problem(problem):
    """
    Proporciona una explicación detallada de cómo abordar un problema.
    """
    return f"Para entender y resolver el problema '{problem}', considera lo siguiente:\n" \
           f"1. Contexto: Identifica el área de estudio (matemáticas, física, química) y los conceptos relevantes.\n" \
           f"2. Datos: Enumera toda la información proporcionada en el enunciado del problema.\n" \
           f"3. Incógnita: Determina qué se está pidiendo calcular o encontrar.\n" \
           f"4. Método: Selecciona la técnica o fórmula apropiada para resolver el problema.\n" \
           f"5. Resolución: Aplica paso a paso el método seleccionado.\n" \
           f"6. Comprobación: Verifica que la solución sea lógica y consistente con el enunciado."