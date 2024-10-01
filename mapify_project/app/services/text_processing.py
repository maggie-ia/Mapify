import PyPDF2
from io import BytesIO
from transformers import pipeline
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import spacy
import networkx as nx
import matplotlib.pyplot as plt

summarizer = pipeline("summarization")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
nlp = spacy.load("es_core_news_sm")

def extract_text_from_pdf(file_content):
    """
    Extrae el texto de un archivo PDF.
    """
    pdf_file = BytesIO(file_content)
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file_content):
    """
    Extrae el texto de un archivo DOCX.
    """
    doc = docx.Document(BytesIO(file_content))
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def process_file(file):
    """
    Procesa el archivo subido y extrae su contenido.
    """
    if file.filename.endswith('.pdf'):
        return extract_text_from_pdf(file.read())
    elif file.filename.endswith('.txt'):
        return file.read().decode('utf-8')
    elif file.filename.endswith('.docx'):
        return extract_text_from_docx(file.read())
    else:
        return "Formato de archivo no soportado."

def summarize_text(text, max_length=150, min_length=50):
    """
    Resume el texto dado utilizando la biblioteca de transformers.
    """
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]['summary_text']

def paraphrase_text(text, max_length=100):
    """
    Parafrasea el texto dado utilizando la biblioteca de transformers.
    """
    paraphrased = paraphraser(text, max_length=max_length, num_return_sequences=1)
    return paraphrased[0]['generated_text']

def synthesize_text(text, max_length=200, min_length=100):
    """
    Sintetiza el texto dado combinando resumen y paráfrasis.
    """
    summary = summarize_text(text, max_length=max_length, min_length=min_length)
    synthesis = paraphrase_text(summary, max_length=max_length)
    return synthesis

def extract_relevant_phrases(text, num_phrases=5):
    """
    Extrae las frases más relevantes del texto utilizando TF-IDF.
    """
    sentences = text.split('.')
    vectorizer = TfidfVectorizer(stop_words='spanish')
    tfidf_matrix = vectorizer.fit_transform(sentences)
    sentence_scores = tfidf_matrix.sum(axis=1).A1
    top_sentence_indices = sentence_scores.argsort()[-num_phrases:][::-1]
    relevant_phrases = [sentences[i].strip() for i in top_sentence_indices]
    return relevant_phrases

def generate_concept_map(text, max_nodes=6):
    """
    Genera un mapa conceptual a partir del texto proporcionado.
    
    :param text: Texto para generar el mapa conceptual.
    :param max_nodes: Número máximo de nodos en el mapa (por defecto 6 para membresía básica).
    :return: Imagen del mapa conceptual en formato bytes.
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
    edge_labels = nx.get_edge_attributes(G, 'relation')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    
    return img_buffer.getvalue()