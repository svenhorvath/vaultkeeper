# Dokument vorbereiten — Referenz

## Script

Das Script `scripts/prepare.py` bereitet externe Dokumente fuer die Brain-Ingestion vor.

## Verwendung

```bash
python scripts/prepare.py <datei-pfad>
```

Auf Windows `python` verwenden (nicht `python3`). Falls `python` nicht im PATH:
`C:\Users\horvaths\AppData\Local\Programs\Python\Python312\python.exe`

## Was das Script macht

1. **Dateigroesse pruefen** (Text >50KB, Binaer >100KB = zu gross)
2. **Binaere Formate konvertieren** (PDF, XLSX, DOCX → Text)
3. **Text bereinigen** (leere Zeilen, Timestamps, Pipe-Artefakte)
4. **Grosse Dateien splitten** an Absatzgrenzen in ~40KB Teile
5. **In Inbox ablegen** (`docker/shared/inbox/`)
6. **Qualitaetscheck** (Vollstaendigkeit, Inhaltsdichte, Anomalien)
7. **Bei Fehler:** Dateien entfernen + Bericht mit Verbesserungsvorschlaegen

## Konvertierungsregeln

- **XLSX/DOCX** → Immer zu Text (Embeddings API akzeptiert nur Text); XLSX inkl. Kommentare
- **DOCX** → Tabellen werden in Dokumentreihenfolge mit Absaetzen extrahiert
- **PDF** → Direkt kopieren wenn klein genug (n8n-Pipeline verarbeitet PDFs selbst)
- **Scan-PDF** → Exit Code 2: Claude liest multimodal als Fallback
- **TXT, MD, CSV** → Direkt kopieren wenn klein genug

## Qualitaetscheck

Automatische Pruefungen nach Konvertierung:
- Alle Blaetter aus XLSX vorhanden?
- Leerzeilen-Anteil unter 30%?
- Mindestens 100 Zeichen Inhalt?
- Keine Encoding-Probleme?
- Keine Pipe-Artefakte?

Bei FEHLER: Dateien werden aus Inbox entfernt, Exit Code 1.
Bei WARNUNG: Dateien bleiben, Hinweise werden ausgegeben.

## Unterstuetzte Formate

| Format | Methode | Library |
|--------|---------|---------|
| PDF | Direkt (klein) oder Text via pdfplumber | pdfplumber, PyPDF2 |
| Scan-PDF | Claude multimodal (Fallback, Exit Code 2) | — |
| XLSX/XLS | Text via openpyxl inkl. Kommentare | openpyxl |
| DOCX | Text via python-docx inkl. Tabellen | python-docx |
| TXT, MD, CSV | Direkt | — |

## Fehlende Libraries

```bash
pip install pdfplumber openpyxl python-docx
```

## Nach der Vorbereitung

Ingestion starten:
- Dashboard: `localhost:8501` → Ingestion
- Oder Webhook: `curl -X POST http://localhost:5678/webhook/ingestion-start`
