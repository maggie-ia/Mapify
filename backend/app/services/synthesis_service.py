from transformers import pipeline

def synthesize_text(text, max_length=150, min_length=50):
    """
    Sintetiza el texto dado utilizando un modelo de lenguaje pre-entrenado.
    
    :param text: El texto a sintetizar.
    :param max_length: La longitud máxima de la síntesis.
    :param min_length: La longitud mínima de la síntesis.
    :return: El texto sintetizado.
    """
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # Dividir el texto en chunks si es muy largo
    max_chunk_length = 1024
    chunks = [text[i:i+max_chunk_length] for i in range(0, len(text), max_chunk_length)]
    
    synthesized_text = ""
    for chunk in chunks:
        summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
        synthesized_text += summary[0]['summary_text'] + " "
    
    return synthesized_text.strip()