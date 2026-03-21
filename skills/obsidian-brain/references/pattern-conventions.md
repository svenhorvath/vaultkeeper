# Pattern-Konventionen

Patterns sind wiederverwendbare Loesungsmuster die ueber einzelne Projekte hinweg gelten. Sie leben als normale Zettel im `05-Zettelkasten/` — kein eigener Ordner.

## Erkennung

Ein Zettel ist ein Pattern wenn:
- Eine Loesung in 2+ Projekten anwendbar ist
- Ein bewaehrtes Vorgehen fuer ein wiederkehrendes Problem existiert
- Ein Framework oder Prinzip identifiziert wurde

## Tagging

Patterns bekommen den Tag `#pattern` zusaetzlich zu thematischen Tags:
```yaml
tags: [pattern, entwicklung, spfx]
```

## Struktur eines Pattern-Zettels

```markdown
---
type: zettel
tags: [pattern, BEREICH]
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: Projekt oder Erfahrung
---

# Pattern-Name

## Problem
Welches wiederkehrende Problem loest dieses Pattern?

## Loesung
Wie funktioniert das Pattern? (konkret, mit Beispiel)

## Wann anwenden
In welchen Situationen ist dieses Pattern sinnvoll?

## Wann NICHT anwenden
Wo fuehrt das Pattern in die Irre?

## Verwandte Zettel (Vorschlag)
- [[...]] — Warum relevant
```

## Finden

Patterns finden via:
- Tag-Suche: `#pattern`
- Dashboard.md: Dataview-Query zeigt alle Patterns
- CLI: `obsidian search query="tags: [pattern"` oder `obsidian tags name="#pattern" verbose`
