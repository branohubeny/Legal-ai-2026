from fastapi import FastAPI
from app.routers.legal_documents import router as legal_documents_router
from app.routers.search import router as search_router

app = FastAPI(
    title="LEGAL AI 2026",
    description="AI právny výskumný a asistenčný systém",
    version="0.1.0",
)

app.include_router(legal_documents_router)
app.include_router(search_router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "LEGAL AI 2026",
        "version": "0.1.0",
    }


@app.get("/")
async def root():
    return {
        "message": "LEGAL AI 2026 API",
        "status": "running",
    }
