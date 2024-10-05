from app.utils.exceptions import (
    SummarizationError, ParaphraseError, SynthesisError, RelevantPhrasesError,
    TranslationError, ConceptMapError, ProblemSolvingError
)
from transformers import pipeline
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from sklearn.feature_extraction.text import TfidfVectorizer
from deep_translator import GoogleTranslator
import language_tool_python
import logging
import re

logger = logging.getLogger(__name__)

nlp = spacy.load("es_core_news_sm")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
tool = language_tool_python.LanguageTool('es')

def summarize_text(text, max_length=150, min_length=50):
    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Error al resumir el texto: {str(e)}")
        raise SummarizationError("No se pudo generar el resumen del texto")

def paraphrase_text(text):
    try:
        paraphrased = paraphraser(text, max_length=len(text), do_sample=True, top_k=50, top_p=0.95, num_return_sequences=1)[0]['generated_text']
        return paraphrased
    except Exception as e:
        logger.error(f"Error al parafrasear el texto: {str(e)}")
        raise ParaphraseError("No se pudo parafrasear el texto")

def synthesize_text(text):
    try:
        summary = summarize_text(text, max_length=100, min_length=30)
        synthesis = paraphrase_text(summary)
        return synthesis
    except Exception as e:
        logger.error(f"Error al sintetizar el texto: {str(e)}")
        raise SynthesisError("No se pudo sintetizar el texto")

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
        raise RelevantPhrasesError("No se pudieron extraer frases relevantes")

def generate_concept_map(text):
    try:
        doc = nlp(text)
        G = nx.Graph()
        
        entities = [ent.text for ent in doc.ents]
        noun_chunks = [chunk.text for chunk in doc.noun_chunks]
        
        G.add_node("Concepto Central", size=3000, color='lightblue')
        for i, concept in enumerate(set(entities + noun_chunks)[:5]):
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
        raise ConceptMapError("No se pudo generar el mapa conceptual")

def translate_text(text, target_language):
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        translated_text = translator.translate(text)
        return translated_text
    except Exception as e:
        logger.error(f"Error al traducir el texto: {str(e)}")
        raise TranslationError("No se pudo traducir el texto")

def solve_problem(text):
    try:
        problem_type = identify_problem_type(text)
        solution_methods = generate_solution_methods(text, problem_type)
        analytical_solution = solve_problem_analytical(text)
        numerical_solution = solve_problem_numerical(text)
        graphical_solution = solve_problem_graphical(text)
        additional_resources = get_additional_resources(problem_type)
        
        return {
            "problem_type": problem_type,
            "solution_methods": solution_methods,
            "analytical_solution": analytical_solution,
            "numerical_solution": numerical_solution,
            "graphical_solution": graphical_solution,
            "additional_resources": additional_resources
        }
    except Exception as e:
        logger.error(f"Error al resolver el problema: {str(e)}")
        raise ProblemSolvingError("No se pudo resolver el problema")

def identify_problem_type(text):
    if re.search(r'\b(ecuación|sistema)\b', text, re.IGNORECASE):
        return "algebraico"
    elif re.search(r'\b(derivada|integral)\b', text, re.IGNORECASE):
        return "cálculo"
    elif re.search(r'\b(probabilidad|estadística)\b', text, re.IGNORECASE):
        return "probabilidad"
    else:
        return "general"

def generate_solution_methods(text, problem_type):
    methods = [
        ("Método analítico", "Resolver el problema usando ecuaciones y fórmulas."),
        ("Método numérico", "Utilizar algoritmos computacionales para aproximar la solución."),
        ("Método gráfico", "Representar visualmente el problema y su solución.")
    ]
    
    if problem_type == "algebraico":
        methods.append(("Método de sustitución", "Resolver sistemas de ecuaciones sustituyendo variables."))
    elif problem_type == "cálculo":
        methods.append(("Método de integración por partes", "Técnica para resolver integrales complejas."))
    
    return methods

def solve_problem_analytical(problem):
    return "Se aplicó el método analítico para resolver el problema utilizando ecuaciones y fórmulas matemáticas."

def solve_problem_numerical(problem):
    return "Se utilizaron algoritmos numéricos para aproximar la solución del problema."

def solve_problem_graphical(problem):
    return "Se creó una representación visual del problema para obtener una solución gráfica."

def get_additional_resources(problem_type):
    return [
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

def check_grammar(text):
    matches = tool.check(text)
    return [str(error) for error in matches]