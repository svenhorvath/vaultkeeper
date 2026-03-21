---
allowed-tools: Read, Write, Grep, Glob, Bash, Edit
description: "Session-Erkenntnisse extrahieren, als Zettel im SvenBrain anlegen und betroffene Projekt-MOCs automatisch anreichern. Mit --enrich-all: Batch-Modus fuer alle bestehenden Zettel → MOCs."
argument-hint: "[optionaler fokus] [--enrich-all]"
---

# /vaultkeeper:brain-sync

Extrahiert Erkenntnisse aus der aktuellen Session und schreibt sie als Zettel ins Brain.

## Pfad-Ermittlung

1. `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_path`)
2. Fallback per Plattform:
   - Mac (`Platform: darwin`): `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
   - Windows (`Platform: win32`): `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

## Zugriffs-Strategie

1. **Obsidian CLI verfuegbar?** (via Bash: `obsidian version` oder `/Applications/Obsidian.app/Contents/MacOS/Obsidian version`) → CLI-Commands verwenden
2. **CLI nicht verfuegbar?** → File-basiert mit absolutem `brain_path`

## Ablauf

### Schritt 1: Session analysieren

Den bisherigen Gespraechsverlauf nach folgenden Kategorien durchsuchen:

| Kategorie | Tag | Beispiel |
|---|---|---|
| **Architektur-Entscheidung** | #adr | "Wir nehmen X statt Y weil..." |
| **Wiederverwendbares Pattern** | #pattern | "Dieses Muster funktioniert gut fuer..." |
| **Lesson Learned** | #lessons-learned | "Das hat nicht funktioniert weil..." |
| **Workaround** | #workaround | "Offiziell geht das nicht, aber..." |
| **Allgemeine Erkenntnis** | (thematisch) | Nicht-offensichtliches Wissen |

### Schritt 2: Vorschau zeigen

Fuer jede identifizierte Erkenntnis anzeigen:
- Vorgeschlagener Titel (kebab-case Dateiname)
- Kategorie/Tags
- 1-2 Saetze Zusammenfassung
- Vorgeschlagene Links zu existierenden Zetteln

**Beispiel-Ausgabe:**
```
Ich moechte folgende Zettel anlegen:

1. spfx-webpart-caching-pattern.md (#pattern, #spfx)
   → SPFx WebParts cachen Daten im SessionStorage fuer Offline-Faehigkeit
   → Links: [[frozen-stack-pattern]], [[spfx-1-18-breaking-changes]]

2. adr-zustand-statt-context-api.md (#adr, #entwicklung)
   → Zustand gewaehlt wegen einfacherer DevTools und weniger Boilerplate
   → Links: [[qualitaet-vor-geschwindigkeit-prinzip]]

Anlegen? (ja/nein/anpassen)
```

### Schritt 3: Nach Bestaetigung anlegen

Fuer jeden bestaetigten Zettel:
1. Datei unter `05-Zettelkasten/` erstellen mit vollstaendigem Frontmatter
2. Skill `obsidian-brain` fuer Format-Details laden (Linking-Regeln, Frontmatter)
3. INDEX.md aktualisieren (neue Zeile **oben** in der Tabelle — chronologisch, neueste zuerst)

### Schritt 4: Projekt-MOCs anreichern (automatisch)

Dieser Schritt laeuft automatisch ohne User-Bestaetigung. Fuer jeden in Schritt 3 angelegten Zettel:

1. **Projekt identifizieren:** `source`-Feld des Zettels auswerten (z.B. `source: BAV-Stunden-Live-v2 Projekt`)
2. **Projekt-MOC finden:** Unter `01-Projects/` nach passender MOC suchen
3. **MOC anreichern:**

| Was pruefen | Wo in der MOC | Aktion |
|---|---|---|
| Neuer Zettel hat `source` zum Projekt | Schluessel-Dokumente | `[[zettel-name]]` als Link ergaenzen (falls nicht schon vorhanden) |
| Zettel ist ein ADR (`#adr` Tag) | Entscheidungen / Architektur-Entscheidungen | Zeile in Entscheidungs-Tabelle ergaenzen (Datum, Kurzfassung, Link) |
| Zettel erwaehnt Personen aus `06-People/` | Beteiligte Personen | Person verlinken falls nicht schon vorhanden |
| Zettel hat `#pattern` oder `#lessons-learned` | Schluessel-Dokumente | Ebenfalls verlinken |
| Session hat Projekt-Status veraendert | Status | Status-Text aktualisieren |
| Session hat Meilenstein erledigt | Timeline / Meilensteine | Checkbox abhaken, Datum ergaenzen |

4. **`updated`-Datum** im Frontmatter der MOC aktualisieren
5. **Verwandte Themen** ergaenzen falls neue Querverbindungen zu anderen Projekten oder Areas entstanden sind

**Mapping Projekt-Name → MOC-Pfad:**

Bekannte Zuordnungen (erweitern wenn neue Projekte entstehen):

| source-Pattern (im Zettel) | MOC-Pfad |
|---|---|
| `BAV-Stunden-Live` | `01-Projects/BAV-Stundenerfassung/bav-stundenerfassung.md` |
| `Vorderland Vault` / `Vorderland-Vault` | `01-Projects/Brain-und-Vault/brain-und-vault.md` |
| `BAV Vorlagen` | (kein eigener MOC — ggf. unter BAV-Stundenerfassung oder eigenen MOC vorschlagen) |
| `KIWI` | `01-Projects/KIWI-Initiative/kiwi-initiative.md` |
| `SharePoint` / `Ablagestruktur` | `01-Projects/SharePoint-Ablagestruktur/sharepoint-ablagestruktur.md` |
| `SPFx` / `Dashboard` | `01-Projects/SPFx-Dashboard/spfx-dashboard.md` |
| `Governance` | `01-Projects/Governance-Framework/governance-framework.md` |
| `Brain` / `Obsidian` / `Vaultkeeper` | `01-Projects/Brain-und-Vault/brain-und-vault.md` |

Falls kein Mapping passt: Zettel wird trotzdem angelegt, aber kein MOC-Update. Kein Fehler, kein Hinweis noetig.

**Token-Budget:** Dieser Schritt kostet ca. 500-1000 Tokens pro betroffenem Projekt (1x MOC lesen + 1x MOC updaten). Maximal 2-3 Projekte pro Session = ~2000 Tokens Overhead.

### Schritt 4b: Projekt-MOCs anreichern — Batch-Modus

Wenn `$ARGUMENTS` den Wert `--enrich-all` enthaelt:

1. **Alle Zettel scannen:** `05-Zettelkasten/INDEX.md` lesen, alle `source`-Felder extrahieren
2. **Pro Projekt:** Alle zugehoerigen Zettel sammeln
3. **Jede Projekt-MOC** unter `01-Projects/` anreichern (gleiche Logik wie Schritt 4)
4. **Vorschau zeigen** vor dem Schreiben (Batch ist groesser, daher Bestaetigung)

Dieser Modus ueberspringt Schritte 1-3 (keine Session-Analyse, keine neuen Zettel) und geht direkt zum Enrichment aller bestehenden Zettel → MOCs.

### Schritt 5: Vault-Check

Nach dem Anlegen pruefen:
- Sind davon Zettel team-relevant? (Prozesse, Anleitungen, Workarounds, Troubleshooting)
- Falls ja: "X Zettel waeren auch fuer das Vault relevant. `/vaultkeeper:vault-scan` ausfuehren?"

### Schritt 6: Zusammenfassung

```
Brain-Sync abgeschlossen:
- X Zettel angelegt (Y ADRs, Z Patterns, ...)
- INDEX.md aktualisiert
- X Projekt-MOCs angereichert: [Liste der Projekte]
- Vault-Kandidaten: [liste oder "keine"]
```

## Wichtig

- NIEMALS Zettel automatisch anlegen — immer Vorschau zeigen und Bestaetigung abwarten
- Projekt-MOC-Enrichment (Schritt 4) laeuft OHNE Bestaetigung — es verlinkt nur, aendert keinen Inhalt
- Batch-Modus (Schritt 4b) zeigt Vorschau weil der Umfang groesser ist
- Keine Duplikate: Vor dem Anlegen pruefen ob aehnlicher Zettel existiert (INDEX.md + Suche)
- Lieber weniger gute Zettel als viele duenne
- Session-Kontext ist fluechtig — nur nicht-offensichtliches Wissen extrahieren
