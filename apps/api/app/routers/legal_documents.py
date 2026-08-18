from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.fallback_data import FALLBACK_DOCUMENTS
from app.models.legal import LegalDocument, LegalVersion, LegalSection


router = APIRouter(
    prefix="/api/legal-documents",
    tags=["Legal Documents"],
)


class LegalDocumentCreate(BaseModel):
    document_number: str
    title: str
    document_type: str | None = None
    jurisdiction: str = "SK"
    authority: str | None = None
    publication_date: date | None = None
    source_url: str
    source_hash: str | None = None


class LegalVersionCreate(BaseModel):
    valid_from: date
    valid_to: date | None = None
    amendment_number: str | None = None
    full_text: str | None = None
    source_url: str | None = None
    source_hash: str | None = None


class LegalSectionCreate(BaseModel):
    section_number: str | None = None
    subsection: str | None = None
    letter: str | None = None
    title: str | None = None
    text: str


@router.get("")
async def list_legal_documents(
    db: AsyncSession = Depends(get_db),
):
    try:
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
    except Exception:
        return FALLBACK_DOCUMENTS


@router.post("")
async def create_legal_document(
    data: LegalDocumentCreate,
    db: AsyncSession = Depends(get_db),
):
    document = LegalDocument(
        document_number=data.document_number,
        title=data.title,
        document_type=data.document_type,
        jurisdiction=data.jurisdiction,
        authority=data.authority,
        publication_date=data.publication_date,
        source_url=data.source_url,
        source_hash=data.source_hash,
    )

    db.add(document)
    await db.commit()
    await db.refresh(document)

    return {
        "id": str(document.id),
        "document_number": document.document_number,
        "title": document.title,
        "jurisdiction": document.jurisdiction,
        "source_url": document.source_url,
    }


@router.get("/{document_id}/versions")
async def list_legal_versions(
    document_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalVersion)
        .where(LegalVersion.document_id == document_id)
        .order_by(LegalVersion.valid_from)
    )

    versions = result.scalars().all()

    return [
        {
            "id": str(version.id),
            "document_id": str(version.document_id),
            "valid_from": version.valid_from,
            "valid_to": version.valid_to,
            "amendment_number": version.amendment_number,
            "full_text": version.full_text,
            "source_url": version.source_url,
        }
        for version in versions
    ]


@router.get("/{document_id}")
async def get_legal_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalDocument).where(LegalDocument.id == document_id)
    )

    document = result.scalar_one_or_none()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Legal document not found",
        )

    return {
        "id": str(document.id),
        "document_number": document.document_number,
        "title": document.title,
        "document_type": document.document_type,
        "jurisdiction": document.jurisdiction,
        "authority": document.authority,
        "publication_date": document.publication_date,
        "source_url": document.source_url,
    }


@router.post("/{document_id}/versions")
async def create_legal_version(
    document_id: str,
    data: LegalVersionCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalDocument).where(LegalDocument.id == document_id)
    )

    document = result.scalar_one_or_none()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Legal document not found",
        )

    version = LegalVersion(
        document_id=document.id,
        valid_from=data.valid_from,
        valid_to=data.valid_to,
        amendment_number=data.amendment_number,
        full_text=data.full_text,
        source_url=data.source_url,
        source_hash=data.source_hash,
    )

    db.add(version)
    await db.commit()
    await db.refresh(version)

    return {
        "id": str(version.id),
        "document_id": str(version.document_id),
        "valid_from": version.valid_from,
        "valid_to": version.valid_to,
        "amendment_number": version.amendment_number,
        "source_url": version.source_url,
    }


@router.post("/{document_id}/versions/{version_id}/sections")
async def create_legal_section(
    document_id: str,
    version_id: str,
    data: LegalSectionCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalVersion).where(
            LegalVersion.id == version_id,
            LegalVersion.document_id == document_id,
        )
    )

    version = result.scalar_one_or_none()

    if version is None:
        raise HTTPException(
            status_code=404,
            detail="Legal version not found",
        )

    section = LegalSection(
        version_id=version.id,
        section_number=data.section_number,
        subsection=data.subsection,
        letter=data.letter,
        title=data.title,
        text=data.text,
    )

    db.add(section)
    await db.commit()
    await db.refresh(section)

    return {
        "id": str(section.id),
        "version_id": str(section.version_id),
        "section_number": section.section_number,
        "subsection": section.subsection,
        "letter": section.letter,
        "title": section.title,
        "text": section.text,
    }


@router.get("/{document_id}/versions/{version_id}/sections")
async def list_legal_sections(
    document_id: str,
    version_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalSection)
        .join(LegalVersion)
        .where(
            LegalVersion.id == version_id,
            LegalVersion.document_id == document_id,
        )
        .order_by(LegalSection.section_number)
    )

    sections = result.scalars().all()

    return [
        {
            "id": str(section.id),
            "version_id": str(section.version_id),
            "section_number": section.section_number,
            "subsection": section.subsection,
            "letter": section.letter,
            "title": section.title,
            "text": section.text,
        }
        for section in sections
    ]


@router.get("/{document_id}/versions/effective")
async def get_effective_version(
    document_id: str,
    on_date: date,
    db: AsyncSession = Depends(get_db),
):
    from app.services.temporal import is_effective_on

    result = await db.execute(
        select(LegalVersion)
        .where(LegalVersion.document_id == document_id)
        .order_by(LegalVersion.valid_from)
    )

    versions = result.scalars().all()

    effective = [
        version
        for version in versions
        if is_effective_on(version, on_date)
    ]

    if not effective:
        raise HTTPException(
            status_code=404,
            detail="No effective legal version found for this date",
        )

    if len(effective) > 1:
        raise HTTPException(
            status_code=409,
            detail="Overlapping effective legal versions found",
        )

    version = effective[0]

    return {
        "id": str(version.id),
        "document_id": str(version.document_id),
        "valid_from": version.valid_from,
        "valid_to": version.valid_to,
        "amendment_number": version.amendment_number,
        "full_text": version.full_text,
        "source_url": version.source_url,
        "classification": "effective",
        "on_date": on_date,
    }


@router.patch("/{document_id}/versions/{version_id}")
async def update_legal_version(
    document_id: str,
    version_id: str,
    data: LegalVersionCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LegalVersion).where(
            LegalVersion.id == version_id,
            LegalVersion.document_id == document_id,
        )
    )

    version = result.scalar_one_or_none()

    if version is None:
        raise HTTPException(
            status_code=404,
            detail="Legal version not found",
        )

    version.valid_from = data.valid_from
    version.valid_to = data.valid_to
    version.amendment_number = data.amendment_number
    version.full_text = data.full_text
    version.source_url = data.source_url
    version.source_hash = data.source_hash

    await db.commit()
    await db.refresh(version)

    return {
        "id": str(version.id),
        "document_id": str(version.document_id),
        "valid_from": version.valid_from,
        "valid_to": version.valid_to,
        "amendment_number": version.amendment_number,
        "full_text": version.full_text,
        "source_url": version.source_url,
    }
