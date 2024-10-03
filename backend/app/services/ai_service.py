from transformers import pipeline
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from functools import lru_cache
from deep_translator import GoogleTranslator
from .embedding_service import get_relevant_context
from .text_processing import identify_problems, solve_problem, explain_problem

qa_model = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
nlp = spacy.load("es_core_news_sm")

@lru_cache(maxsize=100)
def process_ai_response(document_content, user_question, operation, embeddings):
    try:
        if operation == 'chat':
            relevant_context = get_relevant_context(user_question, document_content, embeddings)
            result = qa_model(question=user_question, context=relevant_context)
            problems = identify_problems(relevant_context)
            return {'answer': result['answer'], 'problems': problems}
        elif operation == 'summarize':
            return summarize_text(document_content)
        elif operation == 'paraphrase':
            return paraphrase_text(document_content)
        elif operation == 'synthesize':
            return synthesize_text(document_content)
        elif operation == 'relevantPhrases':
            return generate_relevant_phrases(document_content)
        elif operation == 'conceptMap':
            return generate_concept_map(document_content)
        elif operation == 'translate':
            target_language = user_question  # Assume the user_question contains the target language
            return translate_text(document_content, target_language)
        elif operation == 'problemSolving':
            return solve_problem_enhanced(user_question)
        elif operation == 'explainProblem':
            return explain_problem_enhanced(user_question)
        else:
            return "Operación no soportada."
    except Exception as e:
        print(f"Error processing AI response: {str(e)}")
        return "Lo siento, no pude procesar tu solicitud. Por favor, intenta reformularla."

# ... keep existing code (summarize_text, paraphrase_text, synthesize_text, generate_relevant_phrases, generate_concept_map, translate_text, generate_suggested_questions)

def solve_problem_enhanced(problem):
    """
    Resuelve un problema ofreciendo múltiples métodos de resolución.
    """
    methods = [
        ("Método analítico", solve_problem_analytical(problem)),
        ("Método numérico", solve_problem_numerical(problem)),
        ("Método gráfico", solve_problem_graphical(problem))
    ]
    
    step_by_step = explain_problem_enhanced(problem)
    
    resources = get_additional_resources(problem)
    
    return {
        "methods": methods,
        "step_by_step": step_by_step,
        "resources": resources
    }

def solve_problem_analytical(problem):
    # Implementar método analítico
    return "Solución analítica del problema"

def solve_problem_numerical(problem):
    # Implementar método numérico
    return "Solución numérica del problema"

def solve_problem_graphical(problem):
    # Implementar método gráfico
    return "Solución gráfica del problema"

def explain_problem_enhanced(problem):
    """
    Proporciona una explicación detallada paso a paso de cómo abordar un problema.
    """
    steps = [
        "Paso 1: Identificar las variables y datos conocidos del problema.",
        "Paso 2: Determinar qué se está pidiendo calcular o encontrar.",
        "Paso 3: Seleccionar la fórmula o método apropiado para resolver el problema.",
        "Paso 4: Aplicar el método seleccionado, mostrando cada paso del cálculo.",
        "Paso 5: Verificar que la solución tenga sentido en el contexto del problema.",
        "Paso 6: Interpretar el resultado y formular una conclusión."
    ]
    
    detailed_explanation = "\n".join(steps)
    return detailed_explanation

def get_additional_resources(problem):
    """
    Proporciona recursos adicionales relacionados con el problema.
    """
    # En una implementación real, esto podría ser una llamada a una base de datos o API
    resources = [
        {
            "title": "Khan Academy - Resolución de problemas",
            "url": "https://es.khanacademy.org/math/arithmetic/multiplication-division"
        },
        {
            "title": "Wolfram Alpha - Calculadora y solucionador de problemas",
            "url": "https://www.wolframalpha.com/"
        },
        {
            "title": "MIT OpenCourseWare - Métodos de resolución de problemas",
            "url": "https://ocw.mit.edu/courses/mathematics/"
        }
    ]
    return resources