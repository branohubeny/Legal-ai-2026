from datetime import date
from types import SimpleNamespace

from services.temporal import classify_version, is_effective_on


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
