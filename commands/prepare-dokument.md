---
allowed-tools: Read, Write, Bash, Glob
description: "Dokumente (PDF, XLSX, DOCX) fuer die Vorderland Brain Ingestion aufbereiten"
argument-hint: "<datei-pfad>"
---

# /vaultkeeper:prepare-dokument

Externe Dokumente fuer die Brain-Ingestion-Pipeline aufbereiten.

## Ablauf

1. Falls kein Argument: den User nach dem Dateipfad fragen
2. Pruefen ob die Datei existiert
3. Script ausfuehren:
   ```bash
   python "${CLAUDE_PLUGIN_ROOT}/scripts/prepare.py" <datei-pfad>
   ```
   Auf Windows `python` verwenden (nicht `python3`).
4. Ergebnis anzeigen (Erfolg/Fehler, Qualitaetscheck)
5. Bei Erfolg: "Dateien liegen in der Inbox. Dashboard → Import & Status → Einpflegen"

## Beispiele

```
/vaultkeeper:prepare-dokument C:\Users\horvaths\Downloads\Bericht-2026.pdf
/vaultkeeper:prepare-dokument ./protokoll.docx
```

## Unterstuetzte Formate

PDF, XLSX, XLS, DOCX, TXT, MD, CSV

## Bei Fehler

Falls Python-Libraries fehlen:
```bash
pip install pdfplumber openpyxl python-docx
```
