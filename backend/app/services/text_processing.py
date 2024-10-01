import spacy
import networkx as nx
import matplotlib.pyplot as plt
from transformers import pipeline
from deep_translator import GoogleTranslator
from io import BytesIO

nlp = spacy.load("es_core_news_sm")
summarizer = pipeline("summarization")

def summarize_text(text, max_length=150, min_length=50):
    """
    Resume el texto dado utilizando el modelo de transformers.
    """
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]['summary_text']

def paraphrase_text(text):
    """
    Parafrasea el texto dado utilizando el modelo de transformers.
    """
    paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
    paraphrased = paraphraser(text, max_length=100, num_return_sequences=1)
    return paraphrased[0]['generated_text']

def synthesize_text(text, max_length=200, min_length=100):
    """
    Sintetiza el texto dado combinando resumen y paráfrasis.
    """
    summary = summarize_text(text, max_length=max_length, min_length=min_length)
    synthesis = paraphrase_text(summary)
    return synthesis

def generate_concept_map(text, max_nodes=6):
    """
    Genera un mapa conceptual a partir del texto proporcionado.
    """
    doc = nlp(text)
    
    entities = [ent.text for ent in doc.ents][:max_nodes]
    relations = []
    for token in doc:
        if token.dep_ in ["nsubj", "dobj", "pobj"]:
            relations.append((token.head.text, token.text))
    
    G = nx.Graph()
    G.add_nodes_from(entities)
    G.add_edges_from(relations[:max_nodes])
    
    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3000, font_size=10, font_weight='bold')
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    
    return img_buffer.getvalue()

def extract_relevant_phrases(text, num_phrases=5):
    """
    Extrae las frases más relevantes del texto.
    """
    doc = nlp(text)
    phrases = [sent.text for sent in doc.sents]
    return phrases[:num_phrases]

def translate_text(text, target_language):
    """
    Traduce el texto al idioma especificado.
    """
    translator = GoogleTranslator(source='auto', target=target_language)
    translated_text = translator.translate(text)
    return translated_text