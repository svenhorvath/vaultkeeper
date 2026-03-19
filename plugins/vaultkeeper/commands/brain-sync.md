---
allowed-tools: Read, Write, Grep, Glob, Bash, Edit, mcp__obsidian__obsidian_read_note, mcp__obsidian__obsidian_update_note, mcp__obsidian__obsidian_list_notes, mcp__obsidian__obsidian_global_search, mcp__obsidian__obsidian_manage_frontmatter, mcp__obsidian__obsidian_manage_tags
description: "Session-Erkenntnisse extrahieren und als Zettel im SvenBrain anlegen"
argument-hint: "[optionaler fokus]"
---

# /vaultkeeper:brain-sync

Extrahiert Erkenntnisse aus der aktuellen Session und schreibt sie als Zettel ins Brain.

## Pfad-Ermittlung

1. `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_path`)
2. Fallback per Plattform:
   - Mac (`Platform: darwin`): `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
   - Windows (`Platform: win32`): `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

## Zugriffs-Strategie

1. **MCP verfuegbar?** → MCP-Tools mit vault-relativen Pfaden
2. **MCP nicht verfuegbar?** → File-basiert mit absolutem `brain_path`

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
3. INDEX.md aktualisieren (neue Zeile in der Tabelle)

### Schritt 4: Vault-Check

Nach dem Anlegen pruefen:
- Sind davon Zettel team-relevant? (Prozesse, Anleitungen, Workarounds, Troubleshooting)
- Falls ja: "X Zettel waeren auch fuer das Vault relevant. `/vaultkeeper:vault-scan` ausfuehren?"

### Schritt 5: Zusammenfassung

```
Brain-Sync abgeschlossen:
- X Zettel angelegt (Y ADRs, Z Patterns, ...)
- INDEX.md aktualisiert
- Vault-Kandidaten: [liste oder "keine"]
```

## Wichtig

- NIEMALS automatisch anlegen — immer Vorschau zeigen und Bestaetigung abwarten
- Keine Duplikate: Vor dem Anlegen pruefen ob aehnlicher Zettel existiert (INDEX.md + Suche)
- Lieber weniger gute Zettel als viele duenne
- Session-Kontext ist fluechtig — nur nicht-offensichtliches Wissen extrahieren
