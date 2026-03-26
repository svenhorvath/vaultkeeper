---
name: vorderland-vault
description: Pusht Wissen ins Vorderland Vault (Team-Wissensdatenbank auf Qdrant). Trigger bei "Vault:", "ins Vault pushen", "Vault scan", "fuer das Team aufbereiten", "in die Inbox legen", "Dokument fuer Qdrant", "Dokument vorbereiten", "Datei fuer Ingestion", "Dokument splitten", "das sollte das Team wissen", "das ist relevant fuer die Kollegen".
---

# Vorderland Vault — Wissen ins Team pushen

## Was das Vault ist

Das Vorderland Vault ist ein **interner technischer Support-Assistent** — ein spezialisiertes RAG-System (Qdrant) das operatives Fach- und Systemwissen des Bauamts Vorderland buendelt und per Chat abfragbar macht. Kein allgemeiner Chatbot, sondern ein Support-Desk fuer die Systeme und Prozesse die taeglich genutzt werden.

**Zielgruppe:**
1. Sven selbst — Wissenssicherung: "Wie hab ich das vor 3 Jahren gemacht?"
2. Kollegen (30+) — Self-Service statt Sven fragen: "Wie mach ich X in V-DOK?"
3. Kevin / zukuenftige Entwickler — technische Dokumentation der gebauten Loesungen

## Was ins Vault gehoert

| Kategorie | Beispiele |
|---|---|
| **Anleitungen** | Wie erstelle ich ein Ausgangsstueck in V-DOK? Wie konfiguriere ich einen Layer in WebOffice? |
| **Troubleshooting** | Ausgangsstueck laesst sich nicht abfertigen → Adressat fehlt |
| **Konfigurationswissen** | Einstellungen in VertiGIS FM, SharePoint Mailbox-Config |
| **Prozesse** | Wann muessen DKM-Stichtagsdaten aktualisiert werden? Wo kommen Daten vom Land? |
| **Selbst gebaute Loesungen** | Wie funktioniert die Power Apps Stundenerfassung? Power Automate Flow-Aufbau |
| **Datenquellen** | Wo finde ich Daten fuer diesen WebOffice-Layer? Welche Access-DB gehoert wozu? |
| **Workarounds & Fallen** | Komma/Punkt in Power Apps, OneDrive Non-Breaking Spaces |

## Was NICHT ins Vault gehoert

- Persoenliche Reflexionen, Fuehrungsphilosophie, Haltung
- KI/RAG-Architektur-Wissen (Meta-Wissen ueber das Vault selbst)
- Strategie, Governance-Ueberlegungen
- Allgemeinwissen (kann jeder LLM beantworten)

**Faustregel fuer Vault-Scan:** Wuerde ein Kollege das fragen? Oder wuerde Sven das in 3 Jahren nachschlagen? → Vault. Ist es Reflexion, Strategie, Meta-Wissen? → Nur Brain.

## Inbox-Pfade

Pfade aus `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `vault_inbox`).

Fallback-Erkennung:
- Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/Claude/Dev/vorderland-vault/docker/shared/inbox`
- Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\Claude\Dev\vorderland-vault\docker\shared\inbox`

## Inbox-Format: JSON

Alle Inhalte werden als einzelne `.json` Dateien in die Inbox geschrieben.
Text und Metadaten in einer Datei — keine separaten Sidecar-Dateien.

Details zum Schema: siehe `references/sidecar-format.md`

## Kommando: Vault Push

Wenn der User `→ Vault: [inhalt]` oder `/vaultkeeper:vault [inhalt]` sagt:

Eine `.json` Datei erstellen (`YYYY-MM-DD-[kebab-titel].json`):

> **WICHTIG: KEIN FELD DARF LEER BLEIBEN.** Alle Werte aus dem Inhalt ableiten.

```json
{
  "dokument_id": "[YYYY-MM-DD-kebab-titel]",
  "title": "[klarer, beschreibender Titel]",
  "document_type": "[aus Inhalt ableiten — siehe Regeln unten]",
  "bereich": "[aus Inhalt ableiten — siehe Regeln unten]",
  "abteilung": "BAV",
  "verantwortlich": "Sven Horvath",
  "erstellt_am": "[heutiges Datum: YYYY-MM-DD]",
  "geprueft_am": "[heutiges Datum: YYYY-MM-DD]",
  "berechtigung": "alle",
  "content": "[Titel]\n================================================================================\n[Inhalt — vollstaendig, kein Informationsverlust]\n\nSchlagworte: [relevante Suchbegriffe, Synonyme, Abkuerzungen]"
}
```

**`dokument_id`:** Identifiziert das Quelldokument. Bei Vault Push (einzelne Zettel) = gleich wie Dateiname ohne `.json`.
Max 1.500 Zeichen im content-Feld (jede JSON = ein Chunk in Qdrant, n8n splittet nicht mehr). Kleinere Chunks liefern praezisere Suchergebnisse bei Faktenfragen (RAG Best Practice: 256-512 Tokens).

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

Danach Hinweis: "Dashboard (localhost:8501) → Import & Status → Einpflegen"

## Kommando: Vault Scan

Wenn der User `→ Vault scan` oder `/vaultkeeper:vault-scan` sagt:

1. Alle Zettel in `SvenBrain/05-Zettelkasten/` lesen
2. Jeden Zettel gegen die Vault-Kriterien pruefen:
   - **JA:** Anleitungen, Troubleshooting, Konfigurationen, Prozesse, Workarounds, Datenquellen, selbst gebaute Loesungen — alles was ein Kollege fragen wuerde oder Sven in 3 Jahren nachschlagen muesste
   - **NEIN:** Persoenliche Reflexionen, Strategie, Fuehrung, KI/RAG-Architektur-Meta-Wissen, Haltung
   - **Vault-relevante Domaenen:** V-DOK, WebOffice, VertiGIS FM, Power Platform, SharePoint, n8n, DKM, Bauamt-Prozesse
3. Kandidaten mit kurzem Grund auflisten
4. Auf Bestaetigung warten
5. Bestaetigte Zettel als `.json` in die Inbox schreiben (gleiches Schema wie Vault Push)

## Kommando: Dokument vorbereiten

Wenn der User Dokumente (PDF, XLSX, DOCX) fuer die Ingestion aufbereiten will:

Claude liest das Dokument selbst (multimodal) und extrahiert den kompletten Inhalt.
Kein Python-Script — Claude versteht Kontext, Tabellen, Grafiken nativ.

Details zum Ablauf: siehe Command `/vaultkeeper:prepare-dokument`.
Details zum Format: siehe `references/prepare-dokument.md`.

## Bereiche fuer Metadaten

Gueltige Werte fuer das `bereich`-Feld:
`ki`, `v-dok`, `sharepoint`, `bauamt-allgemein`, `power-platform`, `n8n`, `gis`, `governance`, `digitalisierung`

## Weitere Referenzen

- **`references/sidecar-format.md`** — JSON-Schema fuer Inbox-Dateien
- **`references/prepare-dokument.md`** — Dokumentkonvertierung (Claude multimodal)
