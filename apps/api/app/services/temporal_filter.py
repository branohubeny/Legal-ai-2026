from datetime import date
from typing import Iterable

from .temporal import is_effective_on


def filter_effective_versions(
    versions: Iterable[object],
    on_date: date,
) -> list[object]:
    return [
        version
        for version in versions
        if is_effective_on(version, on_date)
    ]
