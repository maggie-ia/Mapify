import spacy
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO

nlp = spacy.load("es_core_news_sm")

def generate_concept_map(text, max_nodes=6):
    """
    Genera un mapa conceptual a partir del texto proporcionado.
    
    :param text: Texto para generar el mapa conceptual.
    :param max_nodes: Número máximo de nodos en el mapa (por defecto 6 para membresía básica).
    :return: Imagen del mapa conceptual en formato bytes.
    """
    doc = nlp(text)
    
    # Extraer entidades y sus relaciones
    entities = [ent.text for ent in doc.ents]
    relations = []
    for token in doc:
        if token.dep_ in ["nsubj", "dobj", "pobj"]:
            relations.append((token.head.text, token.text))
    
    # Crear grafo
    G = nx.Graph()
    G.add_nodes_from(entities[:max_nodes])
    G.add_edges_from(relations[:max_nodes])
    
    # Generar visualización
    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3000, font_size=10, font_weight='bold')
    edge_labels = nx.get_edge_attributes(G, 'relation')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)
    
    # Guardar la imagen en memoria
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    
    return img_buffer.getvalue()