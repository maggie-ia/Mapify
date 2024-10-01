import PyPDF2
from io import BytesIO
from transformers import pipeline
import docx

summarizer = pipeline("summarization")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")

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

# Aquí puedes agregar más funciones según sea necesario, como extract_relevant_phrases y translate_text