# Dokument vorbereiten — Referenz

## Ansatz: Claude Multimodal

Claude liest Dokumente selbst (PDF, XLSX, DOCX, Bilder) und extrahiert den kompletten Inhalt
als strukturierten Text. Kein Python-Script, kein Informationsverlust.

## Warum kein Script?

- Python-Libraries (pdfplumber, openpyxl) verlieren Informationen bei Bildern, komplexen Layouts
- Claude versteht Kontext, Tabellen, Grafiken nativ
- Claude kann Metadaten (bereich, document_type) intelligent aus dem Inhalt ableiten
- Kein Dependency-Management noetig

## Output-Format: JSON

Jedes Dokument (oder jeder Abschnitt bei Splits) wird als eine `.json` Datei in die Inbox geschrieben.
Alles in einer Datei — Text und Metadaten zusammen. Keine separaten Sidecar-Dateien.

### JSON-Schema

```json
{
  "title": "Dokumenttitel — Abschnittsname",
  "document_type": "anleitung",
  "bereich": "v-dok",
  "abteilung": "BAV",
  "verantwortlich": "Sven Horvath",
  "erstellt_am": "2026-03-18",
  "geprueft_am": "2026-03-18",
  "berechtigung": "alle",
  "content": "Der vollstaendige Text..."
}
```

### Feldregeln

> **KEIN FELD DARF LEER BLEIBEN. Alle Werte aus dem Inhalt ableiten.**

| Feld | Pflicht | Wert |
|------|---------|------|
| title | Ja | Klarer Titel, bei Splits mit Abschnittsname |
| document_type | Ja | `faq`, `anleitung`, `zettel`, `protokoll`, `prozess`, `referenz` |
| bereich | Ja | `v-dok`, `ki`, `sharepoint`, `power-platform`, `n8n`, `gis`, `governance`, `bauamt-allgemein`, `digitalisierung` |
| abteilung | Ja | Immer `"BAV"` |
| verantwortlich | Ja | Immer `"Sven Horvath"` |
| erstellt_am | Ja | Heutiges Datum `YYYY-MM-DD` |
| geprueft_am | Ja | Heutiges Datum `YYYY-MM-DD` |
| berechtigung | Ja | Standard: `"alle"` |
| content | Ja | Vollstaendiger Text, 1:1 Abschrift |

### Dateinamen

`YYYY-MM-DD-[originalname]-[abschnittsname].json`
- Kebab-Case, keine Umlaute
- Sprechende Abschnittsnamen

### Kontext-Header im content-Feld

Jeder Abschnitt beginnt im `content` mit:
```
[Dokumenttitel]
Abschnitt: [Abschnittsname]
================================================================================
[Inhalt]
```

## Splitting

- Nach logischen Grenzen splitten (Kapitel, Sheets, Themenbloecke)
- Splitplan dem User vorlegen und bestaetigen lassen
- Kein Overlap — saubere thematische Trennung
- Ziel: 1.500–3.500 Zeichen pro content-Feld, harte Grenze 4.000 (jede JSON = ein Chunk in Qdrant, n8n splittet nicht mehr)
- Wenn ein logischer Abschnitt laenger ist: weiter splitten in Unterabschnitte
- Lieber zwei praezise Chunks als ein grosser mit gemischtem Inhalt
- **Screenshot-lastige Dokumente (>3 Screenshots pro Kapitel):** Feiner splitten — Screenshot-Beschreibungen brauchen ~300–500 Zeichen pro Bild. Lieber ein Kapitel in 2 Chunks aufteilen als Screenshots kuerzen oder weglassen.

## Was n8n mit der JSON macht

1. n8n liest die `.json` aus der Inbox
2. Jede JSON wird 1:1 als ein Punkt in Qdrant gespeichert (kein weiteres Chunking)
3. `content` wird embedded (Dense + BM25), alle anderen Felder als `payload.metadata`
4. Nach Ingestion wird die `.json` nach `eingepflegt/` verschoben

## Unterstuetzte Formate

| Format | Methode |
|--------|---------|
| PDF | Claude liest multimodal (Text, Tabellen, Grafiken) |
| XLSX/XLS | Claude liest multimodal (alle Sheets, Kommentare, Formeln) |
| DOCX | Claude liest multimodal (Absaetze, Tabellen, Kommentare) |
| TXT, MD, CSV | Claude liest direkt |
| Bilder (PNG, JPG) | Claude beschreibt den Inhalt |
