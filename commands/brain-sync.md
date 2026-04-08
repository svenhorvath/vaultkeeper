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

### Schritt 2: Vorschau zeigen und direkt anlegen

Kurze Vorschau ausgeben was angelegt wird (zur Transparenz), dann SOFORT anlegen — NICHT auf Bestaetigung warten.

```
Brain-Sync — lege an:
- spfx-webpart-caching-pattern.md (#pattern, #spfx)
- mueller.md (Person, NEU)
- Tools-und-Workflows/playwright-cli-setup.md (Ressource)
- 2026-03-22-abstimmung-datenmodell.md (Meeting)
- Daily Note: 2026-03-22.md
- MOC-Enrichment: brain-und-vault.md, datenmanagement.md
```

### Schritt 3: Anlegen

**VOR jedem Schreibvorgang** den Skill `obsidian-brain` laden (Linking-Regeln, Frontmatter-Schema, INDEX-Format). Das gilt fuer ALLE Eintragstypen, nicht nur Zettel.

#### Universelle Linking-Regel (gilt fuer JEDEN Eintragstyp)

**Vor dem Schreiben** eines Eintrags (Zettel, Person, Ressource, Meeting, Daily Note) bestehende Brain-Eintraege scannen und als Wikilinks einsetzen:

1. **Scan:** Bestehende Eintraege im Brain ermitteln:
   - `05-Zettelkasten/INDEX.md` lesen (alle Zettel auf einen Blick)
   - `06-People/` per Glob pruefen (Personen)
   - `01-Projects/` per Glob pruefen (Projekte + Sub-MOCs)
   - `02-Areas/` per Glob pruefen (Verantwortungsbereiche)
   - `03-Resources/` per Glob pruefen (Tools, Referenzen)
   - `09-Meetings/` bei Bezug auf vergangene Meetings
2. **Matchen:** Jede Entitaet im Text (Personennamen, Projektnamen, Fachbegriffe, Tools, Areas) gegen bestehende Eintraege pruefen
3. **Verlinken:** Treffer als `[[dateiname|Anzeigename]]` einsetzen (Pipe-Syntax fuer lesbaren Text):
   - Projekte: `[[projekt-name|Anzeigename]]`
   - Personen: `[[06-People/nachname|Vorname Nachname]]`
   - Zettel: `[[zettel-name|Anzeigename]]`
   - Areas: `[[area-name|Anzeigename]]`
   - Ressourcen: `[[ressource-name|Anzeigename]]`
4. **Kein Zwangs-Linking:** Nur verlinken wenn ein Eintrag tatsaechlich existiert — keine Links auf nicht-existierende Dateien

Diese Regel ersetzt nicht die typ-spezifischen Linking-Hinweise unten, sondern ergaenzt sie. Sie stellt sicher, dass KEIN Eintrag ohne Verlinkungen geschrieben wird, wenn verlinkbare Eintraege im Brain existieren.

Fuer jeden Eintrag:

**Zettel (05-Zettelkasten/):**
1. Datei erstellen mit Template aus `07-Templates/zettel.md` (Templater-Platzhalter ersetzen)
2. INDEX.md aktualisieren (neue Zeile **oben** in der Tabelle — chronologisch, neueste zuerst)

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
4. Universelle Linking-Regel anwenden (siehe oben)
5. Session-Log eintragen:
   - Unter `## Notizen`: Was wurde in dieser Session gemacht (2-5 Bullet Points)
   - Unter `## Captures`: Interessante Links, Ideen, Randnotizen
   - Unter `## Action Items`: Offene Todos aus der Session

### Schritt 4: MOC-Enrichment (automatisch, ohne Bestaetigung)

Dieser Schritt laeuft automatisch. Er verlinkt nur, aendert keinen inhaltlichen Text.

#### 4a: Projekt-MOCs (01-Projects/)

Fuer JEDEN in Schritt 3 angelegten oder geaenderten Eintrag (Zettel, Daily Note, Person, Ressource, Meeting) sowie fuer jede projekt-relevante Session-Aenderung (Status, Chronik, Pfade, Meilensteine):

1. **Projekt identifizieren:** `source`-Feld, Arbeitsverzeichnis oder Session-Kontext auswerten
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
| Daily Note fuer diesen Tag angelegt | Entwicklungschronik | Zeile mit Datum + Zusammenfassung ergaenzen |
| Neue Person mit Projektbezug | Beteiligte Personen | Person verlinken |
| Neue Ressource mit Projektbezug | Schluessel-Dokumente | Ressource verlinken |

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

Fuer jeden angelegten oder geaenderten Eintrag pruefen ob er thematisch zu einer Area passt:

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

#### 4d: Brain Map aktualisieren (BRAIN_MAP.md)

Regeneriert die kompakte Topologie-Uebersicht im Brain-Root. Diese Datei dient als "Routing Table" — Claude liest sie bei jedem Session-Start automatisch via SessionStart-Hook.

**Analyse (deterministisch, kein LLM noetig):**

1. **Kennzahlen sammeln** — Dateien pro Ordner zaehlen:
   - `05-Zettelkasten/*.md` (minus INDEX.md)
   - `01-Projects/*/` (Anzahl Unterordner)
   - `02-Areas/*/` (Anzahl Unterordner)
   - `06-People/*.md`
   - `03-Resources/**/*.md`
   - `08-Daily/*.md`
   - `09-Meetings/*.md`

2. **Top-Tags ermitteln** — `05-Zettelkasten/INDEX.md` lesen, Tags-Spalte parsen, nach Haeufigkeit sortieren. Top 8 Tags auflisten.

3. **Hub-Zettel finden** — Einen einzelnen Grep-Durchlauf ueber alle .md-Dateien im Brain:
   ```bash
   grep -roh '\[\[[^]|]*' <brain_path>/ --include="*.md" | sed 's/\[\[//' | sort | uniq -c | sort -rn | head -10
   ```
   Ergebnis: Die 10 meistverlinkte Dateinamen. Nur Eintraege mit >=4 eingehenden Referenzen als Hub listen.

4. **Wachstum berechnen** — In INDEX.md zaehlen wie viele Eintraege ein Datum der letzten 7 Tage haben.

5. **Luecken identifizieren:**
   - Zettel mit leerer Tags-Spalte in INDEX.md zaehlen
   - Leere Unterordner in `03-Resources/`
   - Ordner ohne INDEX.md pruefen (02-Areas, 03-Resources, 06-People)

**Schreiben via Obsidian CLI:**

Zuerst: Falls `BRAIN_MAP.md` bereits existiert, `created`-Datum auslesen (via `obsidian properties path="BRAIN_MAP.md" format=yaml` oder Read). Bei Neuanlage: heutiges Datum verwenden.

Dann den generierten Inhalt schreiben:
```bash
obsidian create vault=SvenBrain path="BRAIN_MAP.md" content="<GENERIERTER_INHALT>" overwrite=true
```

**BRAIN_MAP.md Ziel-Format:**

```markdown
<!-- Auto-generated by brain-sync. Aenderungen werden ueberschrieben. -->
---
type: map
tags: [wissensmanagement, meta]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Brain Map

## Kennzahlen
| Bereich | Anzahl |
|---------|--------|
| Zettel | X |
| Projekte | X |
| Areas | X |
| Personen | X |
| Ressourcen | X |
| Daily Notes | X |
| Meetings | X |

## Wissenscluster (Top-Tags)
| Tag | Zettel | Hub |
|-----|--------|-----|
| ki/rag | 13 | rag-chunk-groesse-1500-zeichen-sweet-spot |
| lessons-learned | 15 | — |
| ... | ... | ... |

## Hub-Zettel (>=4 eingehende Referenzen)
- brain-claude-code-system-architektur (12 refs)
- vault-vs-brain-architektur (8 refs)
- ...

## Wachstum (letzte 7 Tage)
+X Zettel | +Y Personen | +Z Ressourcen

## Luecken
- X Zettel ohne Tags
- Leere Ressourcen-Ordner: [liste]
- Fehlende INDEXes: [liste]
```

**Edge Cases:**
- Brain leer (0 Zettel): Trotzdem generieren mit Nullwerten
- Obsidian CLI nicht verfuegbar: Warnung ausgeben, Schritt ueberspringen — Session nicht blockieren
- `created`-Datum: Bei Neuanlage heute, bei Update aus bestehender Datei uebernehmen

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
- Brain Map: BRAIN_MAP.md [erstellt|aktualisiert] (X Zettel, Y Hubs, Z Luecken)
```

## Wichtig

- Brain-Sync arbeitet EIGENSTAENDIG — Vorschau zur Transparenz, aber KEINE Bestaetigung abwarten
- Alles wird direkt angelegt: Zettel, Personen, Ressourcen, Meetings, Daily Note, MOC-Enrichment
- Batch-Modus (--enrich-all) zeigt Vorschau weil der Umfang groesser ist — hier Bestaetigung abwarten
- Keine Duplikate: Vor dem Anlegen pruefen ob aehnlicher Eintrag existiert (INDEX.md + Glob + Grep)
- Lieber weniger gute Eintraege als viele duenne
- Session-Kontext ist fluechtig — nur nicht-offensichtliches Wissen extrahieren
- Templates aus `07-Templates/` verwenden, Templater-Platzhalter (`<% ... %>`) durch echte Werte ersetzen
