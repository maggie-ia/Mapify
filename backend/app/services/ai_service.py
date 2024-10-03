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

@lru_cache(maxsize=100)
def summarize_text(text, max_length=150, min_length=50):
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]['summary_text']

@lru_cache(maxsize=100)
def paraphrase_text(text):
    paraphrased = summarizer(text, max_length=len(text.split()), min_length=len(text.split())//2, do_sample=True)
    return paraphrased[0]['summary_text']

@lru_cache(maxsize=100)
def synthesize_text(text):
    summary = summarize_text(text)
    return paraphrase_text(summary)

@lru_cache(maxsize=50)
def generate_relevant_phrases(document_content, num_phrases=5):
    doc = nlp(document_content)
    phrases = []
    for sent in doc.sents:
        if len(phrases) < num_phrases:
            phrases.append(sent.text)
        else:
            break
    return phrases

def generate_concept_map(document_content, max_nodes=10):
    doc = nlp(document_content)
    
    G = nx.Graph()
    
    for ent in doc.ents[:max_nodes]:
        G.add_node(ent.text)
    
    for token in doc:
        if token.dep_ in ["nsubj", "dobj", "pobj"]:
            if token.head.text in G.nodes and token.text in G.nodes:
                G.add_edge(token.head.text, token.text)
    
    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3000, font_size=10, font_weight='bold')
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    img_str = base64.b64encode(img_buffer.getvalue()).decode()
    
    return img_str

@lru_cache(maxsize=100)
def translate_text(text, target_language):
    translator = GoogleTranslator(source='auto', target=target_language)
    translated_text = translator.translate(text)
    return translated_text

@lru_cache(maxsize=100)
def generate_suggested_questions(document_content, previous_answer):
    doc = nlp(document_content)
    entities = list(doc.ents)
    questions = [
        f"¿Qué puedes decirme sobre {ent.text}?" for ent in entities[:3]
    ]
    questions.append("¿Puedes elaborar más sobre la respuesta anterior?")
    questions.append("¿Hay algún aspecto importante que no hayamos cubierto?")
    return questions

def solve_problem(problem):
    # Aquí implementarías la lógica para resolver problemas matemáticos, físicos o químicos
    # Por ahora, devolveremos una respuesta genérica
    return f"Para resolver el problema '{problem}', necesitaríamos seguir estos pasos: 1) Identificar las variables, 2) Aplicar las fórmulas relevantes, 3) Realizar los cálculos necesarios. Sin embargo, para una solución precisa, se requeriría un sistema más avanzado de resolución de problemas."

def explain_problem(problem):
    # Aquí implementarías la lógica para explicar problemas matemáticos, físicos o químicos
    # Por ahora, devolveremos una explicación genérica
    return f"El problema '{problem}' parece estar relacionado con [área del problema]. Para entenderlo mejor, es importante considerar los siguientes conceptos: [conceptos relevantes]. La clave para abordar este tipo de problemas es [estrategia general]."

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

def solve_problem_auto(content):
    problems = identify_problems(content)
    if not problems:
        return "No se detectaron problemas específicos en el contenido proporcionado."
    
    solutions = []
    for problem_type, problem_text in problems:
        solution = solve_problem(problem_text)
        explanation = explain_problem(problem_text)
        solutions.append({
            'type': problem_type,
            'problem': problem_text,
            'solution': solution,
            'explanation': explanation
        })
    
    return solutions

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