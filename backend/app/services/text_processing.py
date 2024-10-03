import logging
from app.utils.exceptions import (
    SummarizationError,
    ParaphraseError,
    SynthesisError,
    RelevantPhrasesError,
    TranslationError,
    ConceptMapError
)
import re
import base64
from io import BytesIO

import numpy as np
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from deep_translator import GoogleTranslator
import language_tool_python

logger = logging.getLogger(__name__)

summarizer = pipeline("summarization")
nlp = spacy.load("es_core_news_sm")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
tool = language_tool_python.LanguageTool('es')

def summarize_text(text, max_length=150, min_length=50):
    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Error al resumir el texto: {str(e)}")
        raise SummarizationError("No se pudo generar el resumen del texto.")

def paraphrase_text(text):
    try:
        paraphrased = paraphraser(text, max_length=len(text), do_sample=True, top_k=50, top_p=0.95, num_return_sequences=1)[0]['generated_text']
        return paraphrased
    except Exception as e:
        logger.error(f"Error al parafrasear el texto: {str(e)}")
        raise ParaphraseError("No se pudo parafrasear el texto.")

def synthesize_text(text):
    try:
        summary = summarize_text(text, max_length=100, min_length=30)
        synthesis = paraphrase_text(summary)
        return synthesis
    except Exception as e:
        logger.error(f"Error al sintetizar el texto: {str(e)}")
        raise SynthesisError("No se pudo sintetizar el texto.")

def generate_relevant_phrases(text, num_phrases=5):
    try:
        sentences = text.split('.')
        vectorizer = TfidfVectorizer(stop_words='spanish')
        tfidf_matrix = vectorizer.fit_transform(sentences)
        sentence_scores = tfidf_matrix.sum(axis=1).A1
        top_sentence_indices = sentence_scores.argsort()[-num_phrases:][::-1]
        relevant_phrases = [sentences[i].strip() for i in top_sentence_indices]
        return relevant_phrases
    except Exception as e:
        logger.error(f"Error al extraer frases relevantes: {str(e)}")
        raise RelevantPhrasesError("No se pudieron extraer frases relevantes.")

def generate_concept_map(text):
    try:
        doc = nlp(text)
        G = nx.Graph()
        
        # Extraer entidades y conceptos clave
        entities = [ent.text for ent in doc.ents]
        noun_chunks = [chunk.text for chunk in doc.noun_chunks]
        
        # Añadir nodos al grafo
        G.add_node("Concepto Central", size=3000, color='lightblue')
        for i, concept in enumerate(set(entities + noun_chunks)[:5]):  # Limitar a 5 conceptos
            G.add_node(concept, size=2000, color='lightgreen')
            G.add_edge("Concepto Central", concept)
        
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(G)
        nx.draw(G, pos, with_labels=True, node_color=[node[1]['color'] for node in G.nodes(data=True)], 
                node_size=[node[1]['size'] for node in G.nodes(data=True)], font_size=8, font_weight='bold')
        
        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)
        img_str = base64.b64encode(img_buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        logger.error(f"Error al generar el mapa conceptual: {str(e)}")
        raise ConceptMapError("No se pudo generar el mapa conceptual.")

def translate_text(text, target_language):
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        translated_text = translator.translate(text)
        return translated_text
    except Exception as e:
        logger.error(f"Error al traducir el texto: {str(e)}")
        raise TranslationError("No se pudo traducir el texto.")

def check_grammar(text):
    matches = tool.check(text)
    return [str(error) for error in matches]

def identify_problem_type(text):
    patterns = {
        "matemática": r'\b(?:calcul[ae]|encuentr[ae]|determin[ae])\b',
        "física": r'\b(?:velocidad|aceleración|fuerza|energía)\b',
        "química": r'\b(?:mol[es]?|concentración|pH)\b'
    }
    for problem_type, pattern in patterns.items():
        if re.search(pattern, text, re.IGNORECASE):
            return problem_type
    return "general"

def solve_problem(text):
    problem_type = identify_problem_type(text)
    methods = [
        ("Método analítico", "Resolver el problema usando ecuaciones y fórmulas."),
        ("Método numérico", "Utilizar algoritmos computacionales para aproximar la solución."),
        ("Método gráfico", "Representar visualmente el problema y su solución.")
    ]
    step_by_step = explain_problem(text)
    resources = get_additional_resources(problem_type)
    
    return {
        "problem_type": problem_type,
        "methods": methods,
        "step_by_step": step_by_step,
        "resources": resources
    }

def explain_problem(text):
    steps = [
        "Paso 1: Identificar las variables y datos conocidos del problema.",
        "Paso 2: Determinar qué se está pidiendo calcular o encontrar.",
        "Paso 3: Seleccionar la fórmula o método apropiado para resolver el problema.",
        "Paso 4: Aplicar el método seleccionado, mostrando cada paso del cálculo.",
        "Paso 5: Verificar que la solución tenga sentido en el contexto del problema.",
        "Paso 6: Interpretar el resultado y formular una conclusión."
    ]
    return "\n".join(steps)

def get_additional_resources(problem_type):
    resources = [
        {
            "title": f"Khan Academy - Resolución de problemas de {problem_type}",
            "url": f"https://es.khanacademy.org/math/{problem_type}"
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
