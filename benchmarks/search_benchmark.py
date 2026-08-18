import time
from datetime import date
from types import SimpleNamespace

from app.services.search import keyword_search, vector_search, hybrid_search


documents = [
    SimpleNamespace(
        content=f"Právny dokument číslo {i} o zmluvách a náhrade škody",
        embedding=[1.0, 0.0, 0.0],
    )
    for i in range(1000)
]

query = "zmluva náhrada škody"
query_vector = [1.0, 0.0, 0.0]


def benchmark(name, function, runs=100):
    start = time.perf_counter()

    for _ in range(runs):
        function()

    elapsed = time.perf_counter() - start
    average_ms = elapsed / runs * 1000

    print(f"{name}: {average_ms:.3f} ms")


benchmark(
    "keyword_search",
    lambda: keyword_search(documents, query),
)

benchmark(
    "vector_search",
    lambda: vector_search(documents, query_vector, limit=10),
)

benchmark(
    "hybrid_search",
    lambda: hybrid_search(
        documents,
        query,
        query_vector,
        limit=10,
    ),
)
