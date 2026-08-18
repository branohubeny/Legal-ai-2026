from datetime import date


def is_effective_on(version, on_date: date) -> bool:
    valid_from = version.valid_from
    valid_to = version.valid_to

    if on_date < valid_from:
        return False

    if valid_to is not None and on_date > valid_to:
        return False

    return True


def classify_version(version, on_date: date) -> str:
    if is_effective_on(version, on_date):
        return "effective"

    if on_date < version.valid_from:
        return "future"

    if version.valid_to is not None and on_date > version.valid_to:
        return "historical"

    return "unknown"
