import time
from datetime import date
from types import SimpleNamespace

from app.services.search_pipeline import search_pipeline


documents = [
    SimpleNamespace(
        content=f"Právny dokument číslo {i} o zmluvách a náhrade škody",
        embedding=[1.0, 0.0, 0.0],
        document_type="law",
        source="slov-lex",
        valid_from=date(2026, 1, 1),
        valid_to=None,
    )
    for i in range(1000)
]


start = time.perf_counter()

result = search_pipeline(
    documents,
    "zmluva náhrada škody",
    [1.0, 0.0, 0.0],
    date(2026, 8, 12),
    metadata={
        "document_type": "law",
        "source": "slov-lex",
    },
    limit=10,
)

elapsed = time.perf_counter() - start

print(f"results: {len(result)}")
print(f"time_ms: {elapsed * 1000:.3f}")
