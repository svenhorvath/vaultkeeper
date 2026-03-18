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

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| title | Ja | Klarer, beschreibender Titel |
| document_type | Ja | Art des Dokuments |
| bereich | Ja | Fachbereich — aus Kontext ableiten |
| abteilung | Ja | Immer "BAV" |
| verantwortlich | Ja | Immer "Sven Horvath" |
| erstellt_am | Ja | Erstelldatum im Format YYYY-MM-DD |
| geprueft_am | Ja | Gleich wie erstellt_am bei neuen Dokumenten |
| berechtigung | Ja | Zugriffsebene — Standard: "alle" |

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
