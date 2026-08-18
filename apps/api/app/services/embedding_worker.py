from sqlalchemy import select

from app.db import AsyncSessionLocal
from app.models.legal import LegalSection
from app.services.embeddings import (
    EmbeddingQuotaError,
    create_embedding,
)


async def embed_missing_sections(limit: int = 100) -> int:
    """
    Generate embeddings for legal sections that do not have one yet.

    Returns the number of successfully embedded sections.
    """

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(LegalSection)
            .where(LegalSection.embedding.is_(None))
            .limit(limit)
        )

        sections = result.scalars().all()

        embedded_count = 0

        for section in sections:
            try:
                section.embedding = create_embedding(section.text)
            except EmbeddingQuotaError:
                await session.rollback()
                break

            embedded_count += 1

        if embedded_count:
            await session.commit()

        return embedded_count
