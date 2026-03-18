---
allowed-tools: Read, Write, Bash, Glob, Grep
description: "Dokumente (PDF, XLSX, DOCX) fuer die Vorderland Brain Ingestion aufbereiten"
argument-hint: "<datei-pfad>"
---

# /vaultkeeper:prepare-dokument

Externe Dokumente fuer die Brain-Ingestion-Pipeline aufbereiten.
Claude liest das Dokument selbst (multimodal) und extrahiert den KOMPLETTEN Inhalt.
Ergebnis: Eine oder mehrere `.json` Dateien in der Inbox.

## Qualitaetsprinzip — GILT UEBER ALLEM

> **Qualitaet geht ueber alles.** Dieses System ist die Wissensbasis fuer 30+ Kolleg:innen.
> Jeder verlorene Satz, jeder fehlende Kommentar, jeder zerrissene Kontext ist ein Qualitaetsverlust
> der sich in schlechteren Antworten niederschlaegt. Lieber zu viel Information als zu wenig.

- **NICHTS ZUSAMMENFASSEN. NICHTS WEGLASSEN. NICHTS UMFORMULIEREN.**
- **Kein Python-Script.** Claude liest und verarbeitet selbst — kein Informationsverlust.
- **Bei Unsicherheit fragen.** Lieber einmal zu viel fragen als falsch abbiegen.
- **Kommentare/Notizen sind Gold.** Sie enthalten Synonyme und Querverweise die die Suche massiv verbessern.
- **Breadcrumb-Kontext einbauen.** Bei hierarchischen Dokumenten den Eltern-Pfad vor jedem Eintrag setzen.

## Chunking-Architektur

Das Chunking uebernimmt n8n (Recursive Character Text Splitter, 4.000 Zeichen, 500 Overlap).
Das Plugin muss sich NICHT um Chunk-Groessen kuemmern. Die JSON-Dateien koennen beliebig gross sein.

**Aufgabe des Plugins:** Maximale Qualitaet der Extraktion + intelligente thematische Trennung.
**Aufgabe von n8n:** Chunking in embedding-taugliche Stuecke.

Damit n8n beim Chunking keinen Kontext zerreisst, baut das Plugin **Breadcrumb-Headers** ein:
```
[Dokument > Kapitel > Unterkapitel > Abschnitt]
Inhalt des Abschnitts...
```
So weiss jeder Chunk wo er herkommt, auch wenn n8n ihn vom Rest trennt.

## Vault-Kontext

**KEIN Vault-Kontext laden bei diesem Command.** Hier geht es nur um Datenaufbereitung — der Obsidian Vault ist irrelevant. INDEX.md und Zettel NICHT lesen.

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
- **XLSX**: Alle Sheets, alle Zellen, Kommentare, Formeln (Ergebniswerte).
  Fuer XLSX: openpyxl via Bash verwenden (XLSX ist binaer, Read-Tool kann das nicht).
  `openpyxl.load_workbook(path, data_only=False)` — OHNE data_only damit Kommentare lesbar sind.
- **Bilder** (PNG, JPG): Inhalt beschreiben
- **TXT, MD, CSV**: Direkt lesen

### 4. Vollstaendige Text-Extraktion

Den KOMPLETTEN Inhalt als strukturierten Klartext extrahieren:

- **1:1 Abschrift.** Jedes Wort, jede Zahl, jeder Satz — genau so wie im Original.
- **Kein Interpretieren, kein Kuerzen.** Auch redundante Inhalte uebernehmen.
- **Tabellen** als lesbare Textform mit Pipe-Trennung (`|`). Jede Zeile, jede Zelle.
- **Bilder/Grafiken** beschreiben: "Grafik: [Detaillierte Beschreibung, alle Texte, Zahlen]"
- **Kommentare/Annotationen/Notizen** kennzeichnen: "Notiz: [exakter Wortlaut]"
  Diese enthalten oft Synonyme und Schlagworte — fuer die Suche in Qdrant kritisch wichtig.
- **Struktur exakt beibehalten**: Ueberschriften, Abschnitte, Nummerierungen.
- **Sprache exakt beibehalten**: Nicht uebersetzen, nicht korrigieren, Tippfehler beibehalten.

### 5. Breadcrumb-Headers einbauen

Bei hierarchischen Dokumenten (Aktenplaene, Gesetze, Handbuecher mit Kapiteln):

Vor jedem Eintrag den **vollstaendigen Pfad** als Breadcrumb setzen:
```
[Dokument > Hauptkategorie > Unterkategorie > Abschnitt]
Schluessel  Kurzbezeichnung
  Notiz: Synonyme, Querverweise, alternative Begriffe
```

Das stellt sicher dass n8n beim Chunking den Kontext nicht zerreisst.
Breadcrumbs werden mit-embedded und verbessern die semantische Suche um ~35%.

### 6. Struktur analysieren und Splitplan erstellen

Erkenne ob das Dokument klare logische Abschnitte hat:
- Nummerierte Kapitel oder Hauptkategorien
- Benannte Abschnitte oder Themenbloecke
- Bei XLSX: Sheets als natuerliche Grenzen

**Splitplan dem User vorlegen und bestaetigen lassen.**

**Splitregeln:**
- **Klare Struktur vorhanden** → nach logischen Grenzen splitten (thematisch, nicht nach Groesse!)
- **Keine klare Struktur** → eine einzige JSON-Datei (n8n chunked automatisch)
- **Kein KB-Limit.** Die JSON kann beliebig gross sein. n8n uebernimmt das Chunking.
- **Kein Overlap** zwischen Dateien — saubere thematische Trennung

### 7. JSON-Dateien erstellen

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
  "content": "[Der vollstaendige extrahierte Text mit Breadcrumbs]"
}
```

**Kontext-Header im `content`-Feld:**
```
[Dokumenttitel]
Abschnitt: [Abschnittsname]
================================================================================
[Inhalt mit Breadcrumbs]
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

### 8. Ergebnis melden

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
