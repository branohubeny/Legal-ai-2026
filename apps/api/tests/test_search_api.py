from datetime import date
from unittest.mock import patch

from fastapi.testclient import TestClient

from main import app
from app.services.embeddings import EmbeddingQuotaError


client = TestClient(app)


def test_search_returns_503_when_embedding_quota_unavailable():
    with patch(
        "app.routers.search.create_embedding",
        side_effect=EmbeddingQuotaError("quota unavailable"),
    ):
        response = client.post(
            "/api/v1/search",
            json={
                "query": "trestné právo",
                "on_date": "2026-08-18",
                "jurisdiction": "SK",
                "limit": 10,
            },
        )

    assert response.status_code == 503
    assert "quota" in response.json()["detail"].lower()
