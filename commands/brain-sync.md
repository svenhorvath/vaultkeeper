---
allowed-tools: Read, Write, Grep, Glob, Bash, Edit
description: "Session-Erkenntnisse extrahieren und das gesamte SvenBrain automatisch wachsen lassen: Zettel, Projekt-MOCs, Area-MOCs, Ressourcen, Personen, Daily Notes, Meeting-Notizen. Mit --enrich-all: Batch-Modus fuer alle bestehenden Zettel → MOCs."
argument-hint: "[optionaler fokus] [--enrich-all]"
---

# /vaultkeeper:brain-sync

Extrahiert Erkenntnisse aus der aktuellen Session und laesst das gesamte SvenBrain mitwachsen.

## Pfad-Ermittlung

1. `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_path`)
2. Fallback per Plattform:
   - Mac (`Platform: darwin`): `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
   - Windows (`Platform: win32`): `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

## Zugriffs-Strategie

1. **Obsidian CLI verfuegbar?** (via Bash: `obsidian version` oder `/Applications/Obsidian.app/Contents/MacOS/Obsidian version`) → CLI-Commands verwenden
2. **CLI nicht verfuegbar?** → File-basiert mit absolutem `brain_path`

## Brain-Ordner Uebersicht

| Ordner | Zweck | brain-sync Aktion |
|--------|-------|-------------------|
| `01-Projects/` | Projekt-MOCs | Anreichern mit Zettel-Links, ADRs, Status |
| `02-Areas/` | Verantwortungsbereiche | Anreichern mit thematisch passenden Zetteln/Links |
| `03-Resources/` | Tools, Referenzen, Wissenssammlungen | Neue Ressourcen anlegen |
| `05-Zettelkasten/` | Atomare Wissenseinheiten | Neue Zettel anlegen, INDEX aktualisieren |
| `06-People/` | Personen und Kontakte | Neue Personen anlegen, bestehende erweitern |
| `08-Daily/` | Tages-Log | Session-Log als Daily Note (append) |
| `09-Meetings/` | Meeting-Protokolle | Meeting-Notizen anlegen |

## Ablauf

### Schritt 1: Session analysieren

Den bisherigen Gespraechsverlauf vollstaendig durchsuchen nach:

**Zettel-Kandidaten (05-Zettelkasten/):**

| Kategorie | Tag | Beispiel |
|---|---|---|
| **Architektur-Entscheidung** | #adr | "Wir nehmen X statt Y weil..." |
| **Wiederverwendbares Pattern** | #pattern | "Dieses Muster funktioniert gut fuer..." |
| **Lesson Learned** | #lessons-learned | "Das hat nicht funktioniert weil..." |
| **Workaround** | #workaround | "Offiziell geht das nicht, aber..." |
| **Allgemeine Erkenntnis** | (thematisch) | Nicht-offensichtliches Wissen |

**Personen (06-People/):**
- Neue Personen die in der Session erwaehnt wurden (Name, Organisation, Rolle, Kontext)
- Bestehende Personen mit neuen Interaktionen oder Projektbeteiligungen

**Ressourcen (03-Resources/):**
- Neue Tools, Libraries, Services die entdeckt/evaluiert wurden
- Nuetzliche Links, Dokumentationen, Referenzmaterialien
- Konfigurationsrezepte oder Anleitungen

**Meetings (09-Meetings/):**
- Wurde ein Meeting besprochen, vorbereitet oder nachbereitet?
- Gibt es Entscheidungen, Action Items oder Teilnehmer die festgehalten werden sollen?

### Schritt 2: Vorschau zeigen

Fuer alle identifizierten Brain-Updates eine Gesamtvorschau anzeigen:

```
Ich moechte folgende Brain-Updates durchfuehren:

📝 ZETTEL (05-Zettelkasten/):
1. spfx-webpart-caching-pattern.md (#pattern, #spfx)
   → SPFx WebParts cachen Daten im SessionStorage
   → Links: [[frozen-stack-pattern]]

👤 PERSONEN (06-People/):
2. mueller.md (NEU)
   → Thomas Mueller, Gemeinde Goetzis, GIS-Verantwortlicher

📚 RESSOURCEN (03-Resources/):
3. Tools-und-Workflows/playwright-cli-setup.md (NEU)
   → Playwright CLI als Browser-Automation Alternative zu MCP

📅 MEETINGS (09-Meetings/):
4. 2026-03-22-abstimmung-datenmodell.md (NEU)
   → Abstimmung Datenmodell BAV mit 3 Action Items

📖 DAILY NOTE (08-Daily/):
→ 2026-03-22.md — Session-Log wird angehaengt

🔗 AUTO-ENRICHMENT (kein Approval noetig):
→ 01-Projects/: brain-und-vault.md
→ 02-Areas/: datenmanagement.md

Anlegen? (ja/nein/anpassen)
```

### Schritt 3: Nach Bestaetigung anlegen

Fuer jeden bestaetigten Eintrag:

**Zettel (05-Zettelkasten/):**
1. Datei erstellen mit Template aus `07-Templates/zettel.md` (Templater-Platzhalter ersetzen)
2. Skill `obsidian-brain` fuer Format-Details laden (Linking-Regeln, Frontmatter)
3. INDEX.md aktualisieren (neue Zeile **oben** in der Tabelle — chronologisch, neueste zuerst)

**Personen (06-People/):**
1. Pruefen ob Person schon existiert (Glob + Grep nach Name)
2. Wenn NEU: Datei erstellen mit Template aus `07-Templates/person.md`
3. Wenn BESTEHEND: Interaktionen-Sektion ergaenzen (Datum + Kontext), Projekte verlinken

**Ressourcen (03-Resources/):**
1. Passenden Unterordner waehlen oder erstellen:
   - `Tools-und-Workflows/` — Tools, CLIs, Automatisierung
   - `KI-und-LLMs/` — KI-Modelle, Prompting, RAG
   - `Power-Platform/` — Power Automate, Power Apps
   - `SharePoint-und-M365/` — SharePoint, Teams, M365
   - `n8n-Automatisierung/` — n8n Workflows, Nodes
   - `Foerderungen/` — Foerderprogramme, Antraege
   - `Verwaltungsrecht/` — Rechtliche Grundlagen
   - Neuer Ordner wenn keiner passt
2. Datei erstellen mit Frontmatter: `type: resource`, `tags`, `created`, `updated`
3. Inhalt: Was ist es, wofuer nuetzlich, Links/Referenzen

**Meetings (09-Meetings/):**
1. Datei erstellen mit Template aus `07-Templates/meeting-note.md`
2. Dateiname: `YYYY-MM-DD-thema-kebab-case.md`
3. Teilnehmer als `[[06-People/name]]` verlinken
4. Projekt-Referenz als `[[01-Projects/...]]` verlinken

**Daily Note (08-Daily/):**
1. Dateiname: `YYYY-MM-DD.md`
2. Wenn Datei schon existiert: Ans Ende **anhaengen** (append), nicht ueberschreiben
3. Wenn NEU: Mit Template aus `07-Templates/daily-note.md` erstellen
4. Session-Log eintragen:
   - Unter `## Notizen`: Was wurde in dieser Session gemacht (2-5 Bullet Points)
   - Unter `## Captures`: Interessante Links, Ideen, Randnotizen
   - Unter `## Action Items`: Offene Todos aus der Session

### Schritt 4: MOC-Enrichment (automatisch, ohne Bestaetigung)

Dieser Schritt laeuft automatisch. Er verlinkt nur, aendert keinen inhaltlichen Text.

#### 4a: Projekt-MOCs (01-Projects/)

Fuer jeden in Schritt 3 angelegten Zettel:

1. **Projekt identifizieren:** `source`-Feld des Zettels auswerten
2. **Projekt-MOC finden:** Unter `01-Projects/` nach passender MOC suchen
3. **MOC anreichern:**

| Was pruefen | Wo in der MOC | Aktion |
|---|---|---|
| Neuer Zettel hat `source` zum Projekt | Schluessel-Dokumente | `[[zettel-name]]` als Link ergaenzen |
| Zettel ist ein ADR (`#adr` Tag) | Entscheidungen | Zeile in Tabelle ergaenzen |
| Zettel erwaehnt Personen aus `06-People/` | Beteiligte Personen | Person verlinken |
| Zettel hat `#pattern` oder `#lessons-learned` | Schluessel-Dokumente | Ebenfalls verlinken |
| Session hat Projekt-Status veraendert | Status | Status-Text aktualisieren |
| Session hat Meilenstein erledigt | Timeline | Checkbox abhaken, Datum ergaenzen |
| Neues Meeting zum Projekt | Schluessel-Dokumente | Meeting-Note verlinken |

4. **`updated`-Datum** im Frontmatter aktualisieren

**Mapping Projekt-Name → MOC-Pfad:**

| source-Pattern | MOC-Pfad |
|---|---|
| `BAV-Stunden-Live` | `01-Projects/BAV-Stundenerfassung/bav-stundenerfassung.md` |
| `Vorderland Vault` / `Vorderland-Vault` | `01-Projects/Brain-und-Vault/brain-und-vault.md` |
| `BAV Vorlagen` | (unter BAV-Stundenerfassung oder eigenen MOC vorschlagen) |
| `KIWI` | `01-Projects/KIWI-Initiative/kiwi-initiative.md` |
| `SharePoint` / `Ablagestruktur` | `01-Projects/SharePoint-Ablagestruktur/sharepoint-ablagestruktur.md` |
| `SPFx` / `Dashboard` | `01-Projects/SPFx-Dashboard/spfx-dashboard.md` |
| `Governance` | `01-Projects/Governance-Framework/governance-framework.md` |
| `Brain` / `Obsidian` / `Vaultkeeper` | `01-Projects/Brain-und-Vault/brain-und-vault.md` |
| `Claude Code` / `claude-config` | `01-Projects/Brain-und-Vault/brain-und-vault.md` |

Falls kein Mapping passt: Kein MOC-Update, kein Fehler.

#### 4b: Area-MOCs (02-Areas/)

Fuer jeden neuen Zettel pruefen ob er thematisch zu einer Area passt:

| Themen-Keywords | Area-MOC |
|---|---|
| Datenqualitaet, Stammdaten, Schnittstellen, Migration | `02-Areas/Datenmanagement/datenmanagement.md` |
| Digitalisierung, Prozessoptimierung, Change | `02-Areas/Digitale-Transformation/` |
| Key-User, Schulung, Adoption | `02-Areas/Key-User-Programm/` |
| Fuehrung, Team, Organisation | `02-Areas/Team-Fuehrung/` |
| Weiterbildung, Zertifizierung, Skills | `02-Areas/Persoenliche-Entwicklung/` |

Wenn Area-MOC existiert:
1. Zettel unter `## Schluessel-Themen` verlinken (falls nicht schon vorhanden)
2. `updated`-Datum aktualisieren

Wenn Area-MOC noch nicht existiert (neues Themengebiet):
- Nur in der Zusammenfassung erwaehnen, nicht automatisch anlegen

#### 4c: Personen vernetzen (06-People/)

Fuer jede in Schritt 3 angelegte oder aktualisierte Person:
- Projekt-Links ergaenzen wenn Person an einem Projekt beteiligt ist
- `updated`-Datum aktualisieren

### Schritt 4-batch: Batch-Modus (--enrich-all)

Wenn `$ARGUMENTS` den Wert `--enrich-all` enthaelt:

1. **Alle Zettel scannen:** `05-Zettelkasten/INDEX.md` lesen, alle `source`-Felder extrahieren
2. **Pro Projekt:** Alle zugehoerigen Zettel sammeln
3. **Alle MOCs anreichern:** Projekt-MOCs (4a) + Area-MOCs (4b)
4. **Vorschau zeigen** vor dem Schreiben (Batch ist groesser, daher Bestaetigung)

Ueberspringt Schritte 1-3 (keine Session-Analyse, keine neuen Zettel).

### Schritt 5: Vault-Check

Nach dem Anlegen pruefen:
- Sind davon Zettel/Ressourcen team-relevant? (Prozesse, Anleitungen, Workarounds, Troubleshooting)
- Falls ja: "X Eintraege waeren auch fuer das Vault relevant. `/vaultkeeper:vault-scan` ausfuehren?"

### Schritt 6: Zusammenfassung

```
Brain-Sync abgeschlossen:
- X Zettel angelegt (Y ADRs, Z Patterns, ...)
- X Personen angelegt/aktualisiert
- X Ressourcen angelegt
- X Meetings dokumentiert
- Daily Note aktualisiert (08-Daily/YYYY-MM-DD.md)
- INDEX.md aktualisiert
- X Projekt-MOCs angereichert: [Liste]
- X Area-MOCs angereichert: [Liste]
- Vault-Kandidaten: [liste oder "keine"]
```

## Wichtig

- NIEMALS Zettel/Personen/Ressourcen/Meetings automatisch anlegen — immer Vorschau (Schritt 2) zeigen und Bestaetigung abwarten
- **Ausnahme Daily Note:** Wird IMMER angelegt/ergaenzt, ohne Bestaetigung — es ist nur ein Session-Log
- MOC-Enrichment (Schritt 4) laeuft OHNE Bestaetigung — es verlinkt nur, aendert keinen Inhalt
- Batch-Modus (Schritt 4-batch) zeigt Vorschau weil der Umfang groesser ist
- Keine Duplikate: Vor dem Anlegen pruefen ob aehnlicher Eintrag existiert (INDEX.md + Glob + Grep)
- Lieber weniger gute Eintraege als viele duenne
- Session-Kontext ist fluechtig — nur nicht-offensichtliches Wissen extrahieren
- Templates aus `07-Templates/` verwenden, Templater-Platzhalter (`<% ... %>`) durch echte Werte ersetzen
