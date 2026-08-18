from datetime import date
from pydantic import BaseModel


class LegalDocumentCreate(BaseModel):
    document_number: str
    title: str
    document_type: str | None = None
    jurisdiction: str = "SK"
    authority: str | None = None
    publication_date: date | None = None
    source_url: str
    source_hash: str | None = None


class LegalDocumentResponse(BaseModel):
    id: str
    document_number: str
    title: str
    jurisdiction: str
    source_url: str

    class Config:
        from_attributes = True
