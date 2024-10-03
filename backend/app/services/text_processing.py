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
import PyPDF2
import docx
import pytesseract

from flask import current_app
from app.models.user import User
from app.services.translation_service import translate_text

logger = logging.getLogger(__name__)

summarizer = pipeline("summarization")
nlp = spacy.load("es_core_news_sm")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
tool = language_tool_python.LanguageTool('es')

class AppError(Exception):
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def validate_text_input(text, max_length=10000):
    if not text:
        raise AppError("El texto de entrada está vacío")
    if len(text) > max_length:
        raise AppError(f"El texto excede la longitud máxima permitida de {max_length} caracteres")

def summarize_text(text, max_length=150, min_length=50):
    validate_text_input(text)
    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Error al resumir el texto: {str(e)}")
        raise SummarizationError("No se pudo generar el resumen del texto")

def paraphrase_text(text):
    validate_text_input(text)
    try:
        paraphrased = paraphraser(text, max_length=len(text), do_sample=True, top_k=50, top_p=0.95, num_return_sequences=1)[0]['generated_text']
        return paraphrased
    except Exception as e:
        logger.error(f"Error al parafrasear el texto: {str(e)}")
        raise ParaphraseError("No se pudo parafrasear el texto. Por favor, intente con un texto diferente.")

def synthesize_text(text):
    validate_text_input(text)
    try:
        summary = summarize_text(text, max_length=100, min_length=30)
        synthesis = paraphrase_text(summary)
        return synthesis
    except Exception as e:
        logger.error(f"Error al sintetizar el texto: {str(e)}")
        raise SynthesisError("No se pudo sintetizar el texto. Por favor, verifique el contenido e intente nuevamente.")

def generate_relevant_phrases(text, num_phrases=5):
    validate_text_input(text)
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
        raise RelevantPhrasesError("No se pudieron extraer frases relevantes. Por favor, intente con un texto más largo.")

def generate_concept_map(text):
    validate_text_input(text)
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
        raise ConceptMapError("No se pudo generar el mapa conceptual. Por favor, intente con un texto más estructurado.")

def translate_text(text, target_language):
    validate_text_input(text)
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        translated_text = translator.translate(text)
        return translated_text
    except Exception as e:
        logger.error(f"Error al traducir el texto: {str(e)}")
        raise TranslationError("No se pudo traducir el texto. Por favor, verifique el idioma de destino e intente nuevamente.")

def check_grammar(text):
    validate_text_input(text)
    matches = tool.check(text)
    return [str(error) for error in matches]
