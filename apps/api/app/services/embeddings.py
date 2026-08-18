from openai import OpenAI
from openai import APIError, RateLimitError

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536


class EmbeddingServiceError(RuntimeError):
    """Base error for embedding generation."""


class EmbeddingQuotaError(EmbeddingServiceError):
    """OpenAI API quota or billing is unavailable."""


def create_embedding(text: str) -> list[float]:
    text = text.strip()

    if not text:
        raise ValueError("Text for embedding cannot be empty")

    client = OpenAI()

    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text,
        )
    except RateLimitError as exc:
        raise EmbeddingQuotaError(
            "OpenAI embedding quota is unavailable."
        ) from exc
    except APIError as exc:
        raise EmbeddingServiceError(
            "OpenAI embedding service failed."
        ) from exc

    vector = response.data[0].embedding

    if len(vector) != EMBEDDING_DIMENSIONS:
        raise EmbeddingServiceError(
            f"Expected {EMBEDDING_DIMENSIONS} dimensions, "
            f"got {len(vector)}"
        )

    return vector
