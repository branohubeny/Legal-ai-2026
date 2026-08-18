import sys
from datetime import date
from pathlib import Path
from types import SimpleNamespace

# ensure project package root is on sys.path so `app` can be imported
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from app.services.temporal import classify_version, is_effective_on


def version(valid_from, valid_to=None):
    return SimpleNamespace(
        valid_from=valid_from,
        valid_to=valid_to,
    )


def test_effective_version():
    v = version(date(2026, 1, 1), date(2026, 12, 31))

    assert is_effective_on(v, date(2026, 6, 1))
    assert classify_version(v, date(2026, 6, 1)) == "effective"


def test_historical_version():
    v = version(date(2025, 1, 1), date(2025, 12, 31))

    assert not is_effective_on(v, date(2026, 1, 1))
    assert classify_version(v, date(2026, 1, 1)) == "historical"


def test_future_version():
    v = version(date(2027, 1, 1), None)

    assert not is_effective_on(v, date(2026, 8, 12))
    assert classify_version(v, date(2026, 8, 12)) == "future"


def test_open_ended_current_version():
    v = version(date(2026, 1, 1), None)

    assert is_effective_on(v, date(2026, 8, 12))
    assert classify_version(v, date(2026, 8, 12)) == "effective"


def test_version_expired():
    v = SimpleNamespace(
        valid_from=date(2026, 1, 1),
        valid_to=date(2026, 6, 30),
    )

    assert not is_effective_on(v, date(2026, 8, 12))
    assert classify_version(v, date(2026, 8, 12)) == "historical"


def test_overlapping_versions():
    v1 = SimpleNamespace(
        valid_from=date(2026, 1, 1),
        valid_to=date(2026, 12, 31),
    )

    v2 = SimpleNamespace(
        valid_from=date(2026, 6, 1),
        valid_to=date(2026, 12, 31),
    )

    versions = [v1, v2]

    effective = [
        v for v in versions
        if is_effective_on(v, date(2026, 8, 12))
    ]

    assert len(effective) == 2


def test_missing_version():
    v = SimpleNamespace(
        valid_from=date(2027, 1, 1),
        valid_to=None,
    )

    assert not is_effective_on(v, date(2026, 8, 12))
    assert classify_version(v, date(2026, 8, 12)) == "future"


def test_filter_effective_versions():
    from app.services.temporal_filter import filter_effective_versions

    versions = [
        SimpleNamespace(
            name="historical",
            valid_from=date(2025, 1, 1),
            valid_to=date(2025, 12, 31),
        ),
        SimpleNamespace(
            name="current",
            valid_from=date(2026, 1, 1),
            valid_to=None,
        ),
        SimpleNamespace(
            name="future",
            valid_from=date(2027, 1, 1),
            valid_to=None,
        ),
    ]

    result = filter_effective_versions(
        versions,
        date(2026, 8, 12),
    )

    assert [v.name for v in result] == ["current"]


def test_keyword_search():
    from app.services.search import keyword_search

    documents = [
        SimpleNamespace(content="Zmluva o náhrade škody"),
        SimpleNamespace(content="Pracovná zmluva"),
        SimpleNamespace(content="Obchodný zákonník"),
    ]

    result = keyword_search(documents, "NÁHRADE ŠKODY")

    assert len(result) == 1
    assert result[0].content == "Zmluva o náhrade škody"


def test_vector_search():
    from app.services.search import vector_search

    documents = [
        SimpleNamespace(
            content="A",
            embedding=[1.0, 0.0, 0.0],
        ),
        SimpleNamespace(
            content="B",
            embedding=[0.0, 1.0, 0.0],
        ),
        SimpleNamespace(
            content="C",
            embedding=[0.9, 0.1, 0.0],
        ),
    ]

    result = vector_search(
        documents,
        [1.0, 0.0, 0.0],
        limit=2,
    )

    assert [doc.content for doc in result] == ["A", "C"]


def test_metadata_filter():
    from app.services.search import metadata_filter

    documents = [
        SimpleNamespace(
            content="A",
            document_type="law",
            source="slov-lex",
        ),
        SimpleNamespace(
            content="B",
            document_type="contract",
            source="internal",
        ),
        SimpleNamespace(
            content="C",
            document_type="law",
            source="slov-lex",
        ),
    ]

    result = metadata_filter(
        documents,
        {
            "document_type": "law",
            "source": "slov-lex",
        },
    )

    assert [doc.content for doc in result] == ["A", "C"]


def test_rerank():
    from app.services.search import rerank

    documents = [
        SimpleNamespace(
            content="zmluva obsahuje všeobecné ustanovenia"
        ),
        SimpleNamespace(
            content="zmluva zmluva obsahuje náhradu škody"
        ),
        SimpleNamespace(
            content="pracovný pomer a dovolenka"
        ),
    ]

    result = rerank(
        documents,
        "zmluva náhrada škody",
        limit=2,
    )

    assert result[0].content == "zmluva zmluva obsahuje náhradu škody"


def test_hybrid_search():
    from app.services.search import hybrid_search

    documents = [
        SimpleNamespace(
            content="zmluva náhrada škody",
            embedding=[1.0, 0.0, 0.0],
        ),
        SimpleNamespace(
            content="pracovná zmluva",
            embedding=[0.9, 0.1, 0.0],
        ),
        SimpleNamespace(
            content="obchodný zákonník",
            embedding=[0.0, 1.0, 0.0],
        ),
    ]

    result = hybrid_search(
        documents,
        "zmluva",
        [1.0, 0.0, 0.0],
        limit=3,
    )

    assert len(result) == 3
    assert result[0].content == "zmluva náhrada škody"


def test_search_pipeline():
    from app.services.search_pipeline import search_pipeline

    documents = [
        SimpleNamespace(
            content="Zmluva náhrada škody",
            embedding=[1.0, 0.0, 0.0],
            document_type="law",
            source="slov-lex",
            valid_from=date(2026, 1, 1),
            valid_to=None,
        ),
        SimpleNamespace(
            content="Zmluva náhrada škody staré znenie",
            embedding=[1.0, 0.0, 0.0],
            document_type="law",
            source="slov-lex",
            valid_from=date(2025, 1, 1),
            valid_to=date(2025, 12, 31),
        ),
        SimpleNamespace(
            content="Zmluva budúce znenie",
            embedding=[1.0, 0.0, 0.0],
            document_type="law",
            source="slov-lex",
            valid_from=date(2027, 1, 1),
            valid_to=None,
        ),
        SimpleNamespace(
            content="Zmluva interný dokument",
            embedding=[1.0, 0.0, 0.0],
            document_type="internal",
            source="internal",
            valid_from=date(2026, 1, 1),
            valid_to=None,
        ),
    ]

    result = search_pipeline(
        documents,
        "zmluva",
        [1.0, 0.0, 0.0],
        date(2026, 8, 12),
        metadata={
            "document_type": "law",
            "source": "slov-lex",
        },
        limit=10,
    )

    assert len(result) == 1
    assert result[0].content == "Zmluva náhrada škody"
