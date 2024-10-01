import spacy from 'spacy';
import networkx from 'networkx';
import matplotlib from 'matplotlib';

// Cargar el modelo de lenguaje de spaCy
const nlp = spacy.load('es_core_news_sm');

export const generateConceptMap = (text, maxNodes = Infinity) => {
  // Procesar el texto con spaCy
  const doc = nlp(text);

  // Crear un grafo dirigido
  const G = new networkx.DiGraph();

  // Extraer entidades y relaciones
  const entities = [];
  const relations = [];

  doc.ents.forEach(ent => {
    if (entities.length < maxNodes) {
      entities.push(ent.text);
      G.addNode(ent.text);
    }
  });

  doc.forEach(token => {
    if (token.dep_ === 'nsubj' || token.dep_ === 'dobj') {
      if (G.numberOfNodes() < maxNodes) {
        relations.push([token.head.text, token.text]);
        G.addEdge(token.head.text, token.text);
      }
    }
  });

  // Generar la visualización del mapa conceptual
  matplotlib.figure(figsize=(12, 8));
  const pos = networkx.spring_layout(G);
  networkx.draw(G, pos, with_labels=true, node_color='lightblue', node_size=3000, font_size=10, font_weight='bold');
  
  // Guardar la imagen en un buffer
  const buffer = new Buffer();
  matplotlib.savefig(buffer, format='png');
  buffer.seek(0);

  return buffer;
};