from __future__ import annotations

FALLBACK_DOCUMENTS = [
    {
        "id": "doc-1",
        "document_number": "Zákon č. 460/1992 Zb.",
        "title": "Občiansky zákonník",
        "document_type": "zákon",
        "jurisdiction": "SK",
        "authority": "Národná rada SR",
        "publication_date": "1992-01-01",
        "source_url": "https://www.slov-lex.sk/",
    },
    {
        "id": "doc-2",
        "document_number": "Zákon č. 513/1991 Zb.",
        "title": "Obchodný zákonník",
        "document_type": "zákon",
        "jurisdiction": "SK",
        "authority": "Národná rada SR",
        "publication_date": "1991-01-01",
        "source_url": "https://www.slov-lex.sk/",
    },
    {
        "id": "doc-3",
        "document_number": "Zákon č. 9/2002 Z. z.",
        "title": "Občiansky súdny poriadok",
        "document_type": "zákon",
        "jurisdiction": "SK",
        "authority": "Národná rada SR",
        "publication_date": "2002-01-01",
        "source_url": "https://www.slov-lex.sk/",
    },
]

FALLBACK_SECTIONS = [
    {
        "id": "sec-1",
        "version_id": "ver-1",
        "section_number": "1",
        "subsection": None,
        "letter": None,
        "title": "Všeobecné zásady",
        "text": "Osoba má právo na ochranu života, zdravia, majetku a slobodných práv. Zmluva musí byť uzavretá dobrovoľne a v súlade so zákonom.",
        "vector_distance": 0.08,
    },
    {
        "id": "sec-2",
        "version_id": "ver-1",
        "section_number": "2",
        "subsection": None,
        "letter": None,
        "title": "Zodpovednosť za škodu",
        "text": "Každý je povinný nahradiť škodu, ktorú spôsobí inej osobe porušením právnych povinností. Súd zohľadní rozsah škody, zavinenie a mieru zodpovednosti.",
        "vector_distance": 0.12,
    },
    {
        "id": "sec-3",
        "version_id": "ver-2",
        "section_number": "14",
        "subsection": "1",
        "letter": None,
        "title": "Právne úkony",
        "text": "Právne úkony sa uzatvárajú písomne, ústne alebo konkludentne, ak to zákon alebo obchodné zvykročia neodporujú. Vzťahy medzi podnikateľmi sa posudzujú podľa obchodného zákonníka.",
        "vector_distance": 0.15,
    },
    {
        "id": "sec-4",
        "version_id": "ver-3",
        "section_number": "104",
        "subsection": None,
        "letter": "a",
        "title": "Právo na informácie",
        "text": "Strana má právo na prístup k relevantným dokumentom, písomnostiam a záznamom, ktoré sú podstatné pre riadne uplatnenie práv a povinností.",
        "vector_distance": 0.19,
    },
]


def fallback_search(query: str, limit: int = 5, jurisdiction: str | None = None, on_date=None):
    q = (query or "").strip().lower()
    if not q:
        q = "zmluva"

    filtered = []
    for section in FALLBACK_SECTIONS:
        haystack = " ".join(
            [
                section.get("title") or "",
                section.get("text") or "",
                section.get("section_number") or "",
            ]
        ).lower()
        if q in haystack:
            filtered.append(section)

    if not filtered:
        filtered = FALLBACK_SECTIONS[:limit]

    return filtered[:limit]
