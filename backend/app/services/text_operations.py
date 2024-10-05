from transformers import pipeline
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from sklearn.feature_extraction.text import TfidfVectorizer
from deep_translator import GoogleTranslator
import language_tool_python
from app.utils.exceptions import (
    SummarizationError, ParaphraseError, SynthesisError, RelevantPhrasesError,
    TranslationError, ConceptMapError
)
import logging

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
    # Implementar la lógica para resolver problemas
    pass

def check_grammar(text):
    matches = tool.check(text)
    return [str(error) for error in matches]

# ... keep existing code for other functions