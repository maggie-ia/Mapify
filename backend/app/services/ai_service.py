from transformers import pipeline
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64

# Inicializamos los modelos una sola vez para reutilizarlos
qa_model = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
nlp = spacy.load("es_core_news_sm")

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

def generate_relevant_phrases(document_content, num_phrases=5):
    """
    Genera frases relevantes del documento utilizando spaCy.
    """
    doc = nlp(document_content)
    phrases = []
    for sent in doc.sents:
        if len(phrases) < num_phrases:
            phrases.append(sent.text)
        else:
            break
    return phrases

def generate_concept_map(document_content, max_nodes=10):
    """
    Genera un mapa conceptual del documento utilizando spaCy y NetworkX.
    """
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

def answer_document_question(document_content, question):
    """
    Responde a una pregunta específica sobre el contenido del documento.
    """
    try:
        # Limitamos el contexto a los primeros 512 tokens para evitar exceder los límites del modelo
        context = ' '.join(document_content.split()[:512])
        
        result = qa_model(question=question, context=context)
        
        return result['answer']
    except Exception as e:
        print(f"Error answering document question: {str(e)}")
        return "Lo siento, no pude encontrar una respuesta a tu pregunta en el documento. Por favor, intenta reformularla o sé más específico."