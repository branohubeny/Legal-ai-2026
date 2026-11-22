from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.routers.legal_documents import router as legal_documents_router
from app.routers.search import router as search_router

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="LEGAL AI 2026",
    description="AI pr?vny v?skumn? a asisten?n? syst?m",
    version="0.1.0",
)

app.include_router(legal_documents_router)
app.include_router(search_router)

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "LEGAL AI 2026",
        "version": "0.1.0",
    }


@app.get("/api/info")
async def api_info():
    return {
        "message": "LEGAL AI 2026 API",
        "status": "running",
    }


@app.get("/")
async def root():
    if STATIC_DIR.exists():
        return FileResponse(STATIC_DIR / "index.html")
    return {
        "message": "LEGAL AI 2026 API",
        "status": "running",
    }
