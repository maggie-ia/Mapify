import re
from transformers import pipeline
import spacy
import PyPDF2
from io import BytesIO
import docx

summarizer = pipeline("summarization")
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

def identify_problems(text):
    """
    Identifica problemas matemáticos, físicos o químicos en el texto.
    """
    # Patrones simples para identificar problemas
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
