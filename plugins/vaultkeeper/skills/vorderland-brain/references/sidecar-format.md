# Inbox-Format — JSON-Schema

## Ein Dateiformat fuer alles

Jedes Dokument in der Brain-Inbox ist eine einzelne `.json` Datei.
Text und Metadaten zusammen — kein Sidecar, kein zweites File.

### Dateinamen-Konvention

`YYYY-MM-DD-[kebab-titel].json`

Beispiele:
- `2026-03-18-shadow-ai-governance.json`
- `2026-03-18-grundteilungen-kapitel-1.json`

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
  "berechtigung": "alle|intern|fuehrung",
  "content": "Der vollstaendige Text des Dokuments oder Abschnitts."
}
```

### Feldregeln

> **KEIN FELD DARF LEER BLEIBEN. Alle Werte aus dem Inhalt ableiten — niemals "" schreiben.**

| Feld | Pflicht | Wert |
|------|---------|------|
| title | Ja | Klarer, beschreibender Titel aus dem Inhalt |
| document_type | Ja | Aus Inhalt ableiten (siehe unten) |
| bereich | Ja | Aus Inhalt ableiten (siehe unten) |
| abteilung | Ja | Immer `"BAV"` |
| verantwortlich | Ja | Immer `"Sven Horvath"` |
| erstellt_am | Ja | Heutiges Datum `YYYY-MM-DD` — niemals leer |
| geprueft_am | Ja | Heutiges Datum `YYYY-MM-DD` bei neuen Dokumenten |
| berechtigung | Ja | Standard: `"alle"` |
| content | Ja | Vollstaendiger Text, 1:1 aus dem Originaldokument |

### document_type Entscheidung

- `zettel` — Einzelne Erkenntnis oder Konzept
- `anleitung` — Schritt-fuer-Schritt Anweisung
- `protokoll` — Meeting-Protokoll oder Besprechungsnotiz
- `prozess` — Wiederkehrender Ablauf
- `faq` — Haeufig gestellte Frage mit Antwort
- `referenz` — Nachschlagewerk, Faktenwissen

### bereich Entscheidung

- `v-dok` — V-DOK, Akten, Schriftstuecke, Abfertigen
- `ki` — KI, ChatGPT, Claude, Automatisierung
- `sharepoint` — SharePoint, Teams, OneDrive, Microsoft 365
- `power-platform` — Power Apps, Power Automate, Power BI
- `n8n` — n8n, Workflows, Automation
- `gis` — VertiGIS, WebOffice, GIS, Geodaten
- `governance` — IT-Governance, Security, DSGVO
- `bauamt-allgemein` — alles andere
- `digitalisierung` — Digitalisierungsprojekte

### content-Feld Format

```
[Titel]
================================================================================
[Inhalt — vollstaendig, kein Informationsverlust]

Absaetze mit Leerzeilen trennen.
Keine Markdown-Formatierung (reiner Text fuer Embeddings).
```
