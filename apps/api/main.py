from fastapi import FastAPI

app = FastAPI(
    title="LEGAL AI 2026",
    description="AI právny výskumný a asistenčný systém",
    version="0.1.0",
)


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
