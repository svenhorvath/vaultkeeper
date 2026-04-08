---
allowed-tools: Read, Grep, Glob, Bash
description: "Brain-Gesundheitscheck: Verwaiste Zettel, Tag-Audit, Link-Qualitaet, fehlende INDEXes und Staleness-Report. Optional mit --fix fuer automatische Korrekturen."
argument-hint: "[--fix]"
---

# /vaultkeeper:brain-health

Tiefgehende Analyse des SvenBrain mit optionalen Auto-Fixes.

## Pfad-Ermittlung

1. `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_path`)
2. Fallback per Plattform:
   - Mac (`Platform: darwin`): `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
   - Windows (`Platform: win32`): `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

## Zugriffs-Strategie

Primaer Obsidian CLI, Fallback file-basiert (Read/Grep/Glob).

## Analyse-Bereiche

### 1. Verwaiste Zettel (Orphan Detection)

Zettel in `05-Zettelkasten/` die von keiner anderen Datei im Brain referenziert werden.

Effizienter Ansatz (ein Durchlauf statt pro-Datei):
1. Alle `[[...]]`-Links im gesamten Brain sammeln:
   ```bash
   grep -roh '\[\[[^]|]*' <brain_path>/ --include="*.md" | sed 's/\[\[//' | sort -u
   ```
2. Alle Dateinamen in `05-Zettelkasten/` sammeln (ohne .md Extension, ohne INDEX)
3. Set-Differenz: Dateinamen die in keinem Link vorkommen = Orphans

### 2. Tag-Audit

- **Ohne Tags:** INDEX.md Zeilen mit leerer Tags-Spalte
- **Nicht-hierarchisch:** Tags ohne Praefix wo einer existiert (z.B. `rag` statt `ki/rag`)
- **Singletons (1x verwendet):** Moeglicherweise Tippfehler
- **Inkonsistent:** `lesson-learned` vs `lessons-learned`

Tag-Hierarchie als Referenz (aus Brain CLAUDE.md):
`ki/llm, ki/rag, ki/governance, ki/infrastruktur | bav/governance, bav/prozesse, bav/technik | tools/power-automate, tools/sharepoint, tools/n8n`

### 3. Link-Qualitaet

- **Broken Links:** `[[target]]` wo target.md nicht existiert im Brain
- **Einseitige Links:** A verlinkt B, aber B hat keinen Link zurueck zu A (nur informativ, kein Auto-Fix — Obsidian Backlinks-Pane reicht)

### 4. Fehlende INDEXes

Pruefen ob INDEX.md oder MOC existiert in:
- `02-Areas/` (jeder Unterordner)
- `03-Resources/` (jeder Unterordner)
- `06-People/` (Gesamt-Ordner)

### 5. Staleness-Report

- Zettel mit `updated`-Datum aelter als 30 Tage: gruppiert nach Alter (30-60, 60-90, 90+ Tage)
- Projekte mit `status: active` aber ohne Update seit 30 Tagen

### 6. Struktur-Check

- Dateien in `00-Inbox/` die seit 7+ Tagen dort liegen (nicht verarbeitet)
- Zettel mit `type: zettel` ausserhalb von `05-Zettelkasten/`

## Auto-Fix Modus (--fix)

Nur wenn `$ARGUMENTS` den Wert `--fix` enthaelt:

| Problem | Fix | Methode |
|---------|-----|---------|
| Nicht-hierarchische Tags | Tag via CLI korrigieren | `obsidian property:set` |
| Fehlende INDEXes | INDEX.md mit Dateiliste generieren | `obsidian create` |
| Broken Links | User fragen: Link entfernen oder Ziel korrigieren | Interaktiv |

**NICHT automatisch fixen:**
- Verwaiste Zettel (koennten absichtlich alleinstehend sein)
- Einseitige Links (Obsidian Backlinks-Pane reicht)
- Staleness (nur informieren, nicht aendern)
- Zettel ohne Tags (User muss Tags waehlen — kein Auto-Tag)

## Ausgabe-Format

```
=== Brain Health Report ===
Stand: YYYY-MM-DD | Zettel: X | Projekte: Y | Personen: Z

Kritisch (X)
- Broken Links: [[target1]] in datei.md, ...
- Zettel ohne Tags: datei1.md, datei2.md

Verbesserbar (X)
- X Verwaiste Zettel (keine eingehenden Links): [liste]
- X Singleton-Tags: tag1, tag2, tag3
- X Inbox-Dateien seit 7+ Tagen

Gesund
- Tag-Hierarchie konsistent
- Alle Projekt-MOCs aktuell
- Keine Staleness-Probleme

Tipp: Mit --fix automatisch korrigierbare Probleme beheben.
```

## Wichtig

- brain-health aktualisiert NICHT die BRAIN_MAP.md — das macht ausschliesslich brain-sync (Schritt 4d)
- Analyse ist rein lesend, Fixes nur mit --fix und nur ueber Obsidian CLI
- Ohne --fix: Informativer Report, keine Aenderungen am Brain
