import PyPDF2
from io import BytesIO
from transformers import pipeline
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from deep_translator import GoogleTranslator
import language_tool_python
import re
from transformers import pipeline
import spacy
import PyPDF2
from io import BytesIO
import docx

summarizer = pipeline("summarization")
nlp = spacy.load("es_core_news_sm")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
tool = language_tool_python.LanguageTool('en-US')

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

def translate_text(text, target_language):
    """
    Traduce el texto dado al idioma especificado.
    """
    translator = GoogleTranslator(source='auto', target=target_language)
    translated_text = translator.translate(text)
    return translated_text

def get_writing_assistance(text, membership_type):
    """
    Proporciona sugerencias de escritura basadas en el texto proporcionado.
    """
    matches = tool.check(text)
    suggestions = []
    
    for match in matches:
        if membership_type == 'premium' or (membership_type == 'basic' and match.ruleIssueType in ['grammar', 'typos']):
            suggestion = {
                'original': text[match.offset:match.offset + match.errorLength],
                'suggested': match.replacements[0] if match.replacements else '',
                'message': match.message,
                'type': match.ruleIssueType
            }
            suggestions.append(suggestion)
    
    return suggestions[:10]  # Limitar a 10 sugerencias para evitar sobrecarga

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