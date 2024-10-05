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
import pytesseract
from pdf2image import convert_from_path
import docx2txt
import language_tool_python

qa_model = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
nlp = spacy.load("es_core_news_sm")
grammar_tool = language_tool_python.LanguageTool('es')

@lru_cache(maxsize=100)
def process_ai_response(document_content, user_question, operation, embeddings):
    try:
        operations = {
            'chat': lambda: chat_operation(document_content, user_question, embeddings),
            'summarize': lambda: summarize_text(document_content),
            'paraphrase': lambda: paraphrase_text(document_content),
            'synthesize': lambda: synthesize_text(document_content),
            'relevantPhrases': lambda: generate_relevant_phrases(document_content),
            'conceptMap': lambda: generate_concept_map(document_content),
            'translate': lambda: translate_text(document_content, user_question),
            'problemSolving': lambda: solve_problem_enhanced(user_question),
            'explainProblem': lambda: explain_problem_enhanced(user_question)
        }
        return operations.get(operation, lambda: "Operación no soportada.")()
    except Exception as e:
        print(f"Error processing AI response: {str(e)}")
        return "Lo siento, no pude procesar tu solicitud. Por favor, intenta reformularla."

def chat_operation(document_content, user_question, embeddings):
    relevant_context = get_relevant_context(user_question, document_content, embeddings)
    result = qa_model(question=user_question, context=relevant_context)
    problems = identify_problems(relevant_context)
    return {'answer': result['answer'], 'problems': problems}

    
def summarize_text(text, max_length=150, min_length=50):
    return summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']

def paraphrase_text(text):
    paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
    return paraphraser(text, max_length=len(text), do_sample=True, num_return_sequences=1)[0]['generated_text']

def synthesize_text(text):
    summary = summarize_text(text, max_length=100, min_length=30)
    return paraphrase_text(summary)

def generate_relevant_phrases(text, num_phrases=5):
    doc = nlp(text)
    phrases = [sent.text for sent in doc.sents]
    return sorted(phrases, key=lambda x: len(x), reverse=True)[:num_phrases]

def generate_concept_map(text):
    doc = nlp(text)
    G = nx.Graph()
    entities = list(doc.ents)[:5]  # Limit to top 5 entities
    G.add_node("Central Concept", size=3000, color='lightblue')
    for entity in entities:
        G.add_node(entity.text, size=2000, color='lightgreen')
        G.add_edge("Central Concept", entity.text)
    
    plt.figure(figsize=(10, 8))
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color=[node[1]['color'] for node in G.nodes(data=True)], 
            node_size=[node[1]['size'] for node in G.nodes(data=True)], font_size=8, font_weight='bold')
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    img_str = base64.b64encode(img_buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def translate_text(text, target_language):
    translator = GoogleTranslator(source='auto', target=target_language)
    return translator.translate(text)

def solve_problem_enhanced(problem):
    # Implementar lógica avanzada de resolución de problemas aquí
    steps = [
        "Identificar el tipo de problema",
        "Analizar los datos proporcionados",
        "Aplicar fórmulas o métodos relevantes",
        "Calcular la solución",
        "Verificar el resultado"
    ]
    return f"Pasos para resolver '{problem}':\n" + "\n".join(f"{i+1}. {step}" for i, step in enumerate(steps))

def explain_problem_enhanced(problem):
    # Implementar lógica avanzada de explicación de problemas aquí
    explanation = [
        f"El problema '{problem}' se puede abordar de la siguiente manera:",
        "1. Contextualización del problema en el campo relevante",
        "2. Desglose de los componentes clave del problema",
        "3. Explicación de los conceptos fundamentales involucrados",
        "4. Descripción de posibles enfoques para la resolución",
        "5. Análisis de las implicaciones y aplicaciones del problema"
    ]
    return "\n".join(explanation)

def check_grammar(text):
    matches = grammar_tool.check(text)
    return [str(error) for error in matches]

def extract_text_from_file(file_path):
    file_extension = file_path.split('.')[-1].lower()
    
    if file_extension in ['jpg', 'jpeg', 'png']:
        return pytesseract.image_to_string(file_path)
    elif file_extension == 'pdf':
        pages = convert_from_path(file_path)
        return " ".join(pytesseract.image_to_string(page) for page in pages)
    elif file_extension in ['doc', 'docx']:
        return docx2txt.process(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()

def solve_problem_from_file(file_path):
    content = extract_text_from_file(file_path)
    return solve_problem_enhanced(content)
