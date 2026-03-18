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
3. Python-Script ausfuehren:
   ```bash
   python "${CLAUDE_PLUGIN_ROOT}/scripts/prepare.py" <datei-pfad>
   ```
   Auf Windows `python` verwenden (nicht `python3`).

4. Exit Code auswerten:
   - **Exit 0** → Erfolg: Schritt 5
   - **Exit 1** → Technischer Fehler: Fehlermeldung anzeigen, Ursache benennen
   - **Exit 2** → Scan-PDF erkannt: Schritt 4b (Claude liest multimodal)

4b. **Scan-PDF Fallback — Claude liest das Dokument selbst:**
   - Datei mit dem Read-Tool oeffnen (Claude unterstuetzt PDF nativ)
   - Inhalt vollstaendig und 1:1 als strukturierten Klartext extrahieren
   - Regeln: NICHTS zusammenfassen, NICHTS weglassen, Tabellen als Pipe-Format
   - Bilder/Grafiken beschreiben: "Grafik: [Inhalt, alle Texte, Zahlen]"
   - Ergebnis als `.txt` in die Inbox schreiben (Dateiname: `YYYY-MM-DD-[originalname].txt`)
   - Hinweis ausgeben: "Scan-PDF — Claude hat das Dokument multimodal gelesen"

5. Bei Erfolg: "Dateien liegen in der Inbox. Dashboard → Import & Status → Einpflegen"

## Beispiele

```
/vaultkeeper:prepare-dokument C:\Users\horvaths\Downloads\Bericht-2026.pdf
/vaultkeeper:prepare-dokument ./protokoll.docx
```

## Unterstuetzte Formate

PDF (inkl. Scan-PDF via Fallback), XLSX, XLS, DOCX, TXT, MD, CSV

## Bei Fehler

Falls Python-Libraries fehlen:
```bash
pip install pdfplumber openpyxl python-docx
```
