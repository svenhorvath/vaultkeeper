# ADR-Template (MADR-Format)

## Kurzversion (Standard)

```markdown
---
type: adr
tags: [adr, BEREICH]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: proposed
projekt: "[[01-Projects/PROJEKT/PROJEKT]]"
---

# ADR: Titel der Entscheidung

## Kontext und Problem
Warum stand diese Entscheidung an?

## Betrachtete Optionen
* Option A: ...
* Option B: ...

## Entscheidung
Gewaehlt: **Option A**, weil ...

## Konsequenzen
- Positiv: ...
- Negativ: ...

## Verwandte Zettel (Vorschlag)
- [[...]] — Warum relevant
```

## Langversion (fuer kritische Entscheidungen)

Zusaetzlich zur Kurzversion:

```markdown
## Decision Drivers
* Treiber 1 (z.B. Performance-Anforderung)
* Treiber 2 (z.B. Team-Kompetenz)

## Pros and Cons

### Option A
* Gut, weil ...
* Schlecht, weil ...

### Option B
* Gut, weil ...
* Schlecht, weil ...

## Bestaetigung
Wie pruefen wir ob die Entscheidung eingehalten wird?
```

## Status-Lifecycle

`proposed` → `accepted` → `deprecated` oder `superseded by [[adr-xyz]]`

## Dateiname-Konvention

`adr-[kebab-case-titel].md` — z.B. `adr-zustand-statt-context-api.md`
