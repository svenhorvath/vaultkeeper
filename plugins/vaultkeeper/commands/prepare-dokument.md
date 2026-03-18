---
allowed-tools: Read, Write, Bash, Glob, Grep
description: "Dokumente (PDF, XLSX, DOCX) fuer die Vorderland Brain Ingestion aufbereiten"
argument-hint: "<datei-pfad>"
---

# /vaultkeeper:prepare-dokument

Externe Dokumente fuer die Brain-Ingestion-Pipeline aufbereiten.
Claude liest das Dokument selbst (multimodal) und extrahiert den KOMPLETTEN Inhalt.
Ergebnis: Eine oder mehrere `.json` Dateien in der Inbox.

## Ablauf

### 1. Datei finden

Falls kein Argument: den User nach dem Dateipfad fragen.
Pruefen ob die Datei existiert.

### 2. Inbox-Pfad ermitteln

Settings aus `~/.claude/vaultkeeper.local.md` lesen (Feld `brain_inbox`).
Fallback:
- Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/Claude/Dev/vorderland-brain/docker/shared/inbox`
- Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\Claude\Dev\vorderland-brain\docker\shared\inbox`

### 3. Dokument lesen

Datei mit dem Read-Tool oeffnen. Claude kann nativ lesen:
- **PDF**: Text, Tabellen, eingebettete Bilder (beschreiben!)
- **DOCX**: Paragraphen, Tabellen, Kommentare, Annotationen
- **XLSX**: Alle Sheets, alle Zellen, Kommentare, Formeln (Ergebniswerte)
- **Bilder** (PNG, JPG): Inhalt beschreiben
- **TXT, MD, CSV**: Direkt lesen

### 4. Vollstaendige Text-Extraktion

Den KOMPLETTEN Inhalt als strukturierten Klartext extrahieren. Regeln:

- **NICHTS ZUSAMMENFASSEN. NICHTS WEGLASSEN. NICHTS UMFORMULIEREN.**
- **1:1 Abschrift.** Jedes Wort, jede Zahl, jeder Satz — genau so wie im Original.
- **Kein Interpretieren, kein Kuerzen.** Auch redundante Inhalte uebernehmen.
- **Tabellen** als lesbare Textform mit Pipe-Trennung (`|`). Jede Zeile, jede Zelle.
- **Bilder/Grafiken** beschreiben: "Grafik: [Detaillierte Beschreibung, alle Texte, Zahlen, Beschriftungen]"
- **Kommentare/Annotationen** kennzeichnen: "Kommentar: [exakter Wortlaut]"
- **Struktur exakt beibehalten**: Ueberschriften, Abschnitte, Nummerierungen.
- **Sprache exakt beibehalten**: Nicht uebersetzen, nicht korrigieren, Tippfehler beibehalten.

### 5. Struktur analysieren und Splitplan erstellen

**Immer die Dokumentstruktur analysieren** — unabhaengig von der Groesse.

Erkenne ob das Dokument klare logische Abschnitte hat:
- Nummerierte Kapitel oder Hauptkategorien (z.B. `[xx0]`, `1.`, `A.`)
- Benannte Abschnitte oder Themenbloecke
- Wiederholende Strukturmuster (z.B. Formular-Typen, Prozess-Schritte)
- Bei XLSX: Sheets als natuerliche Grenzen

**Splitplan dem User vorlegen und bestaetigen lassen:**
> "Das Dokument hat 10 Hauptkategorien. Ich wuerde es in 10 JSON-Dateien aufteilen, eine pro Kategorie. Soll ich so vorgehen?"

**Splitregeln:**
- **Klare Struktur vorhanden** → nach logischen Grenzen splitten, nicht nach Groesse
- **Keine klare Struktur, unter 40 KB Text** → eine Datei
- **Keine klare Struktur, ueber 40 KB Text** → an natuerlichen Textgrenzen aufteilen
- **Kein Overlap** zwischen Dateien — saubere thematische Trennung

### 6. JSON-Dateien erstellen

**Eine `.json` Datei pro Abschnitt** in die Inbox schreiben.

**Dateiname:** `YYYY-MM-DD-[originalname]-[abschnittsname].json`
- Sprechende Namen, nicht `teil1`, `teil2`
- Kebab-Case, keine Umlaute (oe, ae, ue)

**JSON-Struktur:**
```json
{
  "title": "[Dokumenttitel — Abschnittsname]",
  "document_type": "[aus Inhalt ableiten]",
  "bereich": "[aus Inhalt ableiten]",
  "abteilung": "BAV",
  "verantwortlich": "Sven Horvath",
  "erstellt_am": "YYYY-MM-DD",
  "geprueft_am": "YYYY-MM-DD",
  "berechtigung": "alle",
  "content": "[Der vollstaendige extrahierte Text dieses Abschnitts]"
}
```

**Kontext-Header im `content`-Feld:**
Jeder Abschnitt beginnt im `content` mit:
```
[Dokumenttitel]
Abschnitt: [Abschnittsname]
================================================================================
[Inhalt]
```

**Metadaten-Regeln:**

`document_type` ableiten:
- `faq` — Frage + Antwort, Problemloesung
- `anleitung` — Schritt-fuer-Schritt Vorgehen
- `zettel` — Einzelne Erkenntnis, Notiz
- `protokoll` — Meeting, Besprechung
- `prozess` — Wiederkehrender Ablauf, Workflow
- `referenz` — Nachschlagewerk, Glossar, Faktenwissen

`bereich` ableiten:
- `v-dok` — V-DOK, Akten, Abfertigen
- `ki` — KI, ChatGPT, Claude, Automatisierung
- `sharepoint` — SharePoint, Teams, OneDrive, Microsoft 365
- `power-platform` — Power Apps, Power Automate, Power BI
- `n8n` — n8n, Workflows, Automation
- `gis` — VertiGIS, WebOffice, GIS, Geodaten
- `governance` — IT-Governance, Security, DSGVO
- `bauamt-allgemein` — alles andere
- `digitalisierung` — Digitalisierungsprojekte

**KEIN FELD DARF LEER BLEIBEN.** Alle Werte aus dem Inhalt ableiten.

### 7. Ergebnis melden

Dem User mitteilen:
- Welche JSON-Dateien erstellt wurden (mit Titel und Bereich)
- Ob gesplittet wurde und warum
- Hinweis: "Dashboard (localhost:8501) → Import & Status → Einpflegen"

## Beispiele

```
/vaultkeeper:prepare-dokument C:\Users\horvaths\Downloads\Bericht-2026.pdf
/vaultkeeper:prepare-dokument ./protokoll.docx
/vaultkeeper:prepare-dokument ~/Documents/kernprozesse.xlsx
```

## Unterstuetzte Formate

PDF, XLSX, XLS, DOCX, TXT, MD, CSV, PNG, JPG

## Qualitaetsprinzip

- **Qualitaet vor Geschwindigkeit.** Lieber laenger lesen als Informationen verlieren.
- **Bei Unsicherheit fragen.** Wenn ein Dokument unklar ist, den User fragen statt raten.
- **Kein Python-Script.** Claude liest und verarbeitet selbst — kein Informationsverlust.
