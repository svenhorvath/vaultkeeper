---
name: vorderland-brain
description: >
  Pusht Wissen aus dem persoenlichen Vault ins Vorderland Brain (Team-Wissensdatenbank auf Qdrant).
  Dieser Skill sollte verwendet werden wenn der User "Brain:", "ins Brain pushen",
  "Brain scan", "fuer das Team aufbereiten", "in die Inbox legen", "Dokument fuer Qdrant",
  "Dokument vorbereiten", "Datei fuer Ingestion", "Dokument splitten" sagt.
  Auch bei: "das sollte das Team wissen", "das ist relevant fuer die Kollegen".
---

# Vorderland Brain — Wissen ins Team pushen

Erstelle und verwalte Inhalte fuer die Vorderland Brain Ingestion-Pipeline.
Das Brain ist eine Qdrant-basierte Wissensdatenbank fuer das Bauamt Vorderland.

## Inbox-Pfade

Pfade aus `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_inbox`).

Fallback-Erkennung:
- Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/Claude/Dev/vorderland-brain/docker/shared/inbox`
- Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\Claude\Dev\vorderland-brain\docker\shared\inbox`

## Kommando: Brain Push

Wenn der User `→ Brain: [inhalt]` oder `/vaultkeeper:brain [inhalt]` sagt:

1. **Inhaltsdatei** erstellen (`YYYY-MM-DD-[kebab-titel].txt`):
   ```
   [Titel]
   ================================================================================
   [Inhalt — vollstaendig, kein Informationsverlust]
   ```

2. **Sidecar-Metadaten** erstellen (`YYYY-MM-DD-[kebab-titel].meta.json`):

   > **WICHTIG: KEIN FELD DARF LEER BLEIBEN.** Alle Werte aus dem Inhalt ableiten.

   ```json
   {
     "title": "[klarer, beschreibender Titel]",
     "document_type": "[aus Inhalt ableiten — siehe Regeln unten]",
     "bereich": "[aus Inhalt ableiten — siehe Regeln unten]",
     "abteilung": "BAV",
     "verantwortlich": "Sven Horvath",
     "erstellt_am": "[heutiges Datum: YYYY-MM-DD]",
     "geprueft_am": "[heutiges Datum: YYYY-MM-DD]",
     "berechtigung": "alle"
   }
   ```

   **`document_type` ableiten:**
   - `faq` — Frage + Antwort, Problemloesung, "wie mache ich X"
   - `anleitung` — Schritt-fuer-Schritt Vorgehen, Prozessbeschreibung
   - `zettel` — Einzelne Erkenntnis, Konzept, Notiz
   - `protokoll` — Meeting, Besprechung, Entscheidung
   - `prozess` — Wiederkehrender Ablauf, Workflow
   - `referenz` — Nachschlagewerk, Glossar, Faktenwissen

   **`bereich` ableiten:**
   - `v-dok` — V-DOK, Akten, Schriftstuecke, Abfertigen, Reinschrift
   - `ki` — KI, ChatGPT, Claude, Automatisierung, Prompt
   - `sharepoint` — SharePoint, Teams, OneDrive, Microsoft 365
   - `power-platform` — Power Apps, Power Automate, Power BI
   - `n8n` — n8n, Workflows, Automation, Webhooks
   - `gis` — VertiGIS, WebOffice, GIS, Karten, Geodaten
   - `governance` — IT-Governance, Security, DSGVO, Richtlinien
   - `bauamt-allgemein` — alles andere, allgemeine Bauamt-Prozesse
   - `digitalisierung` — Digitalisierungsprojekte, Transformation

3. **Hinweis:** "Dashboard (localhost:8501) → Import & Status → Einpflegen"

## Kommando: Brain Scan

Wenn der User `→ Brain scan` oder `/vaultkeeper:brain-scan` sagt:

1. Alle Zettel in `SvenVault/05-Zettelkasten/` lesen
2. Bewerten welche **team-relevant** sind:
   - JA: Prozesse, Anleitungen, Fachkompetenz fuer Kollegen
   - NEIN: Persoenliche Reflexionen, individuelle Notizen
3. Kandidaten mit kurzem Grund auflisten
4. Auf Bestaeigung warten
5. Bestaetigte Zettel als `.txt` + `.meta.json` in die Inbox schreiben

## Kommando: Dokument vorbereiten

Wenn der User Dokumente (PDF, XLSX, DOCX) fuer die Ingestion aufbereiten will:

Das Script `${CLAUDE_PLUGIN_ROOT}/scripts/prepare.py` ausfuehren:
```bash
python "${CLAUDE_PLUGIN_ROOT}/scripts/prepare.py" <datei-pfad>
```

Auf Windows `python` verwenden (nicht `python3`).

Details zum Script und dessen Funktionsweise: siehe `references/prepare-dokument.md`.

## Bereiche fuer Metadaten

Gueltige Werte fuer das `bereich`-Feld in Sidecar-Metadaten:
`ki`, `v-dok`, `sharepoint`, `bauamt-allgemein`, `power-platform`, `n8n`, `gis`, `governance`, `digitalisierung`

## Weitere Referenzen

- **`references/sidecar-format.md`** — JSON-Schema fuer .meta.json Dateien
- **`references/prepare-dokument.md`** — Dokumentkonvertierung und Qualitaetscheck
