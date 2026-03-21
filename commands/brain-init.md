---
allowed-tools: Read, Write, Grep, Glob, Bash, Edit
description: "Neues Projekt im SvenBrain anlegen und CLAUDE.md im Arbeitsverzeichnis erstellen/ergaenzen"
argument-hint: "[projektname]"
---

# /vaultkeeper:brain-init

Erstellt einen Brain-Eintrag fuer ein neues Projekt und richtet die CLAUDE.md im Arbeitsverzeichnis ein.

## Pfad-Ermittlung

1. `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_path`)
2. Fallback per Plattform:
   - Mac (`Platform: darwin`): `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
   - Windows (`Platform: win32`): `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

## Zugriffs-Strategie

1. **Obsidian CLI verfuegbar?** (via Bash: `obsidian version` oder `/Applications/Obsidian.app/Contents/MacOS/Obsidian version`) → CLI-Commands verwenden
2. **CLI nicht verfuegbar?** → File-basiert mit absolutem `brain_path` arbeiten

## Ablauf

### Schritt 1: Projektname ermitteln
- Falls als Argument uebergeben: `$ARGUMENTS` verwenden
- Falls kein Argument: Aus aktuellem Verzeichnisnamen ableiten, User bestaetigen lassen

### Schritt 2: Brain-Eintrag pruefen/erstellen

Pruefen ob `01-Projects/[Projektname]/` im Brain existiert.

**Falls nicht vorhanden — MOC erstellen:**

Dateiname: `01-Projects/[Projektname]/[projektname-kebab].md`

```markdown
---
type: project
tags: [project]
created: [HEUTE]
updated: [HEUTE]
status: active
---

# [Projektname]

## Ziel
<!-- Kurzbeschreibung -->

## Status
Aktiv

## Schluessel-Dokumente
-

## Beteiligte Personen
-

## Timeline / Meilensteine
- [ ]

## Entscheidungen
-

## Offene Fragen
-

## Verwandte Themen
-
```

**Falls vorhanden:** Melden: "Brain-Eintrag existiert bereits" und `updated`-Datum aktualisieren.

### Schritt 3: CLAUDE.md im Arbeitsverzeichnis

**Fall A: CLAUDE.md existiert, hat keinen Brain-Kontext Block**
→ Block am Ende einfuegen

**Fall B: CLAUDE.md existiert, hat Brain-Kontext Block**
→ Projektpfad aktualisieren falls abweichend

**Fall C: Keine CLAUDE.md vorhanden**
→ Neue CLAUDE.md erstellen:

```markdown
# [Projektname]

## Zweck
<!-- Kurzbeschreibung: Was macht dieses Projekt? -->

## Brain-Kontext
Projekt-Eintrag: `01-Projects/[Projektname]/[projektname-kebab].md`
Zugriff via Obsidian CLI oder Vaultkeeper.
- Vor Architektur-Entscheidungen: Brain-Eintrag lesen
- Bei Session-Ende: Erkenntnisse im Brain festhalten
- Patterns pruefen: `05-Zettelkasten/` (#pattern)

## Regeln
- Alle Dateien im Projektordner
- Deutsch als Kommunikationssprache
```

### Schritt 4: Bestaetigung

Ausgabe:
```
Brain-Eintrag: 01-Projects/[Projektname]/[projektname-kebab].md [erstellt|aktualisiert]
CLAUDE.md: Brain-Kontext [erstellt|ergaenzt|aktualisiert]
```
