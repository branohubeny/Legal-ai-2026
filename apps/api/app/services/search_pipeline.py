from datetime import date
from typing import Iterable

from .search import hybrid_search, metadata_filter
from .temporal_filter import filter_effective_versions


def search_pipeline(
    documents: Iterable[object],
    query: str,
    query_vector: list[float],
    on_date: date,
    metadata: dict[str, object] | None = None,
    limit: int = 10,
) -> list[object]:
    filtered = filter_effective_versions(documents, on_date)

    if metadata:
        filtered = metadata_filter(filtered, metadata)

    return hybrid_search(
        filtered,
        query,
        query_vector,
        limit,
    )
