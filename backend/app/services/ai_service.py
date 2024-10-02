from transformers import pipeline

# Inicializamos el modelo una sola vez para reutilizarlo
qa_model = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

def process_ai_response(document_content, user_question):
    """
    Procesa la pregunta del usuario utilizando el modelo de IA y el contenido del documento.
    """
    try:
        # Limitamos el contexto a los primeros 512 tokens para evitar exceder los límites del modelo
        context = ' '.join(document_content.split()[:512])
        
        result = qa_model(question=user_question, context=context)
        
        return result['answer']
    except Exception as e:
        print(f"Error processing AI response: {str(e)}")
        return "Lo siento, no pude procesar tu pregunta. Por favor, intenta reformularla."