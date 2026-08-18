from unittest.mock import patch

import pytest

from app.services.embedding_worker import embed_missing_sections
from app.services.embeddings import EmbeddingQuotaError


@pytest.mark.asyncio
async def test_embedding_worker_handles_quota_error():
    with patch(
        "app.services.embedding_worker.create_embedding",
        side_effect=EmbeddingQuotaError("quota unavailable"),
    ):
        result = await embed_missing_sections(limit=10)

    assert result == 0
