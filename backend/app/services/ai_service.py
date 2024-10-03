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

def summarize_text(text, max_length=150, min_length=50):
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]['summary_text']

def paraphrase_text(text):
    # Implementar la lógica de paráfrasis aquí
    return f"Paráfrasis de: {text}"

def synthesize_text(text):
    # Implementar la lógica de síntesis aquí
    return f"Síntesis de: {text}"

def generate_relevant_phrases(text):
    # Implementar la lógica para generar frases relevantes
    return ["Frase relevante 1", "Frase relevante 2", "Frase relevante 3"]

def generate_concept_map(text):
    # Implementar la lógica para generar un mapa conceptual
    # Esta es una implementación simplificada
    G = nx.Graph()
    G.add_node("Concepto Central")
    G.add_edge("Concepto Central", "Concepto 1")
    G.add_edge("Concepto Central", "Concepto 2")
    
    plt.figure(figsize=(10, 8))
    nx.draw(G, with_labels=True, node_color='lightblue', node_size=3000, font_size=10, font_weight='bold')
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    img_str = base64.b64encode(img_buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def translate_text(text, target_language):
    translator = GoogleTranslator(source='auto', target=target_language)
    return translator.translate(text)

def solve_problem_enhanced(problem):
    # Implementar la lógica para resolver problemas de manera mejorada
    return f"Solución mejorada para: {problem}"

def explain_problem_enhanced(problem):
    # Implementar la lógica para explicar problemas de manera mejorada
    return f"Explicación mejorada para: {problem}"

def check_grammar(text):
    matches = grammar_tool.check(text)
    return [str(error) for error in matches]

def extract_text_from_file(file_path):
    file_extension = file_path.split('.')[-1].lower()
    
    if file_extension in ['jpg', 'jpeg', 'png']:
        return pytesseract.image_to_string(file_path)
    elif file_extension == 'pdf':
        pages = convert_from_path(file_path)
        text = ""
        for page in pages:
            text += pytesseract.image_to_string(page)
        return text
    elif file_extension in ['doc', 'docx']:
        return docx2txt.process(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()

# Add this function to handle problem solving for different file types
def solve_problem_from_file(file_path):
    content = extract_text_from_file(file_path)
    return solve_problem_auto(content)
