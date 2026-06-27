from sentence_transformers import SentenceTransformer
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Load embedding model — runs locally, no API key needed
model = SentenceTransformer('all-MiniLM-L6-v2')

# Supabase client for vector search
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def generate_embedding(text: str) -> list:
    """Convert text to a 384-dimensional vector"""
    embedding = model.encode(text)
    return embedding.tolist()

def retrieve_similar_logs(log_text: str, user_id: str, threshold: float = 0.7, limit: int = 3) -> list:
    """Find semantically similar past logs for this user"""
    try:
        query_embedding = generate_embedding(log_text)

        result = supabase.rpc('match_logs', {
            'query_embedding': query_embedding,
            'match_user_id': user_id,
            'match_threshold': threshold,
            'match_count': limit
        }).execute()

        return result.data if result.data else []

    except Exception as e:
        print(f"RAG retrieval failed: {e}")
        return []

def store_embedding(log_id: str, log_text: str):
    """Generate and store embedding for a log analysis"""
    try:
        print(f"RAG: Starting embedding for {log_id[:8]}")
        embedding = generate_embedding(log_text)
        print(f"RAG: Embedding generated, size: {len(embedding)}")

        result = supabase.table('log_analyses').update({
            'embedding': embedding
        }).eq('id', log_id).execute()

        print(f"RAG: Supabase response: {response}")

    except Exception as e:
        print(f"RAG: FAILED to store embedding: {type(e).__name__}: {e}")