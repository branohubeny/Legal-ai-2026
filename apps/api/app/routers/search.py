from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select

from app.db import AsyncSessionLocal
from app.models.legal import LegalSection
from app.services.embeddings import EmbeddingQuotaError, create_embedding
from app.services.search import vector_search_db

router = APIRouter(
    prefix="/api/v1/search",
    tags=["Legal Search"],
)


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    on_date: date | None = None
    jurisdiction: str | None = None
    limit: int = Field(default=10, ge=1, le=50)


@router.post("")
async def search(request: SearchRequest):
    on_date = request.on_date or date.today()

    try:
        query_vector = create_embedding(request.query)
    except EmbeddingQuotaError as exc:
        raise HTTPException(
            status_code=503,
            detail="Semantic search is temporarily unavailable because the embedding service quota is unavailable.",
        ) from exc

    async with AsyncSessionLocal() as session:
        vector_results = await vector_search_db(
            session,
            query_vector,
            limit=request.limit,
            jurisdiction=request.jurisdiction,
            on_date=on_date,
        )

        results = []

        for section, distance in vector_results:
            results.append(
                {
                    "id": str(section.id),
                    "version_id": str(section.version_id),
                    "section_number": section.section_number,
                    "subsection": section.subsection,
                    "letter": section.letter,
                    "title": section.title,
                    "text": section.text,
                    "vector_distance": float(distance),
                }
            )

    return {
        "query": request.query,
        "on_date": on_date,
        "jurisdiction": request.jurisdiction,
        "limit": request.limit,
        "results": results,
    }
