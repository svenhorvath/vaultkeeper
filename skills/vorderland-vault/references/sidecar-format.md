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
  "dokument_id": "YYYY-MM-DD-kebab-titel",
  "title": "Titel des Dokuments — Abschnittsname",
  "document_type": "zettel|anleitung|protokoll|prozess|faq|referenz",
  "bereich": "ki|v-dok|sharepoint|bauamt-allgemein|power-platform|n8n|gis|governance|digitalisierung",
  "abteilung": "BAV",
  "verantwortlich": "Sven Horvath",
  "erstellt_am": "YYYY-MM-DD",
  "geprueft_am": "YYYY-MM-DD",
  "berechtigung": "alle|intern|fuehrung",
  "content": "Kontext-Header + Text + Schlagworte (max 4.000 Zeichen)"
}
```

### Feldregeln

> **KEIN FELD DARF LEER BLEIBEN. Alle Werte aus dem Inhalt ableiten — niemals "" schreiben.**

| Feld | Pflicht | Wert |
|------|---------|------|
| dokument_id | Ja | Identifiziert das Quelldokument (NICHT den Chunk). Alle Chunks eines Dokuments teilen dieselbe ID. Format: `YYYY-MM-DD-kebab-titel`. Keine Umlaute (ae, oe, ue). |
| title | Ja | Klarer Titel mit Abschnittsname: `"Dokumenttitel — Abschnitt"` |
| document_type | Ja | Aus Inhalt ableiten (siehe unten) |
| bereich | Ja | Aus Inhalt ableiten (siehe unten) |
| abteilung | Ja | Immer `"BAV"` |
| verantwortlich | Ja | Immer `"Sven Horvath"` |
| erstellt_am | Ja | Heutiges Datum `YYYY-MM-DD` — niemals leer |
| geprueft_am | Ja | Heutiges Datum `YYYY-MM-DD` bei neuen Dokumenten |
| berechtigung | Ja | Standard: `"alle"` |
| content | Ja | Kontext-Header + extrahierter Text + Schlagworte. **Max 4.000 Zeichen.** |

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

Jede JSON = ein Chunk = ein Punkt in Qdrant. n8n splittet NICHT mehr.

```
[Dokumenttitel]
Abschnitt: [Abschnittsname]
================================================================================
[Inhalt — vollstaendig, kein Informationsverlust]

Schlagworte: Begriff1, Begriff2, Abkuerzung1, Synonym1
```

**Regeln:**
- Absaetze mit Leerzeilen trennen
- Keine Markdown-Formatierung (reiner Text fuer Embeddings)
- **Max 4.000 Zeichen** pro content-Feld (inkl. Header + Schlagworte)
- Schlagworte am Ende verbessern BM25-Retrieval bei Fachbegriffen
- Kontext-Header am Anfang stellt sicher dass der Chunk allein verstaendlich ist
