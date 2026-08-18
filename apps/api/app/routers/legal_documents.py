from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.legal import LegalDocument

router = APIRouter(
    prefix="/api/legal-documents",
    tags=["Legal Documents"],
)


@router.get("")
async def list_legal_documents(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalDocument).order_by(LegalDocument.document_number)
    )

    documents = result.scalars().all()

    return [
        {
            "id": str(document.id),
            "document_number": document.document_number,
            "title": document.title,
            "document_type": document.document_type,
            "jurisdiction": document.jurisdiction,
            "authority": document.authority,
            "publication_date": document.publication_date,
            "source_url": document.source_url,
        }
        for document in documents
    ]
