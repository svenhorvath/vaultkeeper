# Sidecar-Metadaten Format

## Schema

Jedes Dokument in der Brain-Inbox braucht eine begleitende `.meta.json` Datei.

### Dateinamen-Konvention

- Inhalt: `YYYY-MM-DD-[kebab-titel].txt`
- Metadaten: `YYYY-MM-DD-[kebab-titel].meta.json`

Beispiel:
- `2026-03-18-shadow-ai-governance.txt`
- `2026-03-18-shadow-ai-governance.meta.json`

### JSON-Schema

```json
{
  "title": "Titel des Dokuments",
  "document_type": "zettel|anleitung|protokoll|prozess|faq|referenz",
  "bereich": "ki|v-dok|sharepoint|bauamt-allgemein|power-platform|n8n|gis|governance|digitalisierung",
  "abteilung": "BAV",
  "verantwortlich": "Sven Horvath",
  "erstellt_am": "YYYY-MM-DD",
  "geprueft_am": "YYYY-MM-DD",
  "berechtigung": "alle|intern|fuehrung"
}
```

### Feldregeln

> **KEIN FELD DARF LEER BLEIBEN. Alle Werte aus dem Inhalt ableiten — niemals "" schreiben.**

| Feld | Pflicht | Wert |
|------|---------|------|
| title | Ja | Klarer, beschreibender Titel aus dem Inhalt |
| document_type | Ja | Aus Inhalt ableiten: `faq`, `anleitung`, `zettel`, `protokoll`, `prozess`, `referenz` |
| bereich | Ja | Aus Inhalt ableiten: `v-dok`, `ki`, `sharepoint`, `power-platform`, `n8n`, `gis`, `governance`, `bauamt-allgemein`, `digitalisierung` |
| abteilung | Ja | Immer `"BAV"` |
| verantwortlich | Ja | Immer `"Sven Horvath"` |
| erstellt_am | Ja | Heutiges Datum `YYYY-MM-DD` — niemals leer |
| geprueft_am | Ja | Heutiges Datum `YYYY-MM-DD` bei neuen Dokumenten |
| berechtigung | Ja | Standard: `"alle"` |

### document_type Entscheidung

- `zettel` — Einzelne Erkenntnis oder Konzept
- `anleitung` — Schritt-fuer-Schritt Anweisung
- `protokoll` — Meeting-Protokoll oder Besprechungsnotiz
- `prozess` — Wiederkehrender Ablauf
- `faq` — Haeufig gestellte Frage mit Antwort
- `referenz` — Nachschlagewerk, Faktenwissen

### Inhaltsdatei Format

```
[Titel]
================================================================================
[Inhalt — vollstaendig, kein Informationsverlust]

Absaetze mit Leerzeilen trennen.
Keine Markdown-Formatierung (reiner Text fuer Embeddings).
```
