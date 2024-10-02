import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def generate_embeddings(text):
    return model.encode([text])[0]

def get_relevant_context(query, document_content, embeddings, max_length=1000):
    query_embedding = generate_embeddings(query)
    
    # Split the document into chunks
    chunks = [document_content[i:i+max_length] for i in range(0, len(document_content), max_length)]
    chunk_embeddings = [generate_embeddings(chunk) for chunk in chunks]
    
    # Calculate similarities
    similarities = cosine_similarity([query_embedding], chunk_embeddings)[0]
    
    # Get the most relevant chunks
    top_chunk_indices = np.argsort(similarities)[-3:][::-1]  # Get top 3 most similar chunks
    relevant_context = ' '.join([chunks[i] for i in top_chunk_indices])
    
    return relevant_context