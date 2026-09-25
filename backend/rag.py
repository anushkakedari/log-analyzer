from sentence_transformers import SentenceTransformer
from supabase import create_client
import logging

from app.core.config import get_settings


logger = logging.getLogger(__name__)
settings = get_settings()

# Load embedding model — runs locally, no API key needed
model = SentenceTransformer("all-MiniLM-L6-v2")

# Supabase client for vector search
supabase = create_client(
    settings.supabase_url,
    settings.supabase_key,
)


def generate_embedding(text: str) -> list:
    """Convert text to a 384-dimensional vector"""
    embedding = model.encode(text)
    return embedding.tolist()


def retrieve_similar_logs(
    log_text: str,
    user_id: str,
    threshold: float = 0.7,
    limit: int = 3,
) -> list:
    """Find semantically similar past logs for this user"""
    try:
        query_embedding = generate_embedding(log_text)

        result = supabase.rpc(
            "match_logs",
            {
                "query_embedding": query_embedding,
                "match_user_id": user_id,
                "match_threshold": threshold,
                "match_count": limit,
            },
        ).execute()

        return result.data if result.data else []

    except Exception:
        logger.exception("RAG retrieval failed")
        return []


def store_embedding(log_id: str, log_text: str):
    """Generate and store embedding for a log analysis"""
    try:
        embedding = generate_embedding(log_text)

        supabase.table("log_analyses").update(
            {
                "embedding": embedding,
            }
        ).eq("id", log_id).execute()

        logger.info(
            "Embedding stored | log_id=%s",
            log_id[:8],
        )

    except Exception:
        logger.exception(
            "Failed to store embedding | log_id=%s",
            log_id,
        )