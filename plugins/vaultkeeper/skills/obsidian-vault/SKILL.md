---
name: obsidian-vault
description: >
  Verwaltet den persoenlichen Obsidian Vault (SvenVault) als Second Brain.
  Dieser Skill sollte verwendet werden wenn der User "Zettel anlegen", "Notiz erstellen",
  "in den Vault schreiben", "Vault durchsuchen", "Zettelkasten", "INDEX aktualisieren",
  "Vault Status" sagt, oder wenn Claude automatisch eine wichtige Erkenntnis als Zettel
  ablegen will. Auch bei: "was weiss ich ueber [thema]", "habe ich dazu schon was",
  "Vault Gesundheitscheck".
---

# Obsidian Vault — Second Brain

Verwalte den persoenlichen Obsidian Vault nach dem PARA + Zettelkasten Hybrid-Prinzip.

## Vault-Pfade

Pfade aus `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `vault_path`).

Fallback-Erkennung:
- Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenVault`
- Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenVault`

## Vault-Struktur

```
SvenVault/
├── 00-Inbox/          # Ungefilterte Captures
├── 01-Projects/       # Aktive Projekte mit Endpunkt
├── 02-Areas/          # Laufende Verantwortungsbereiche
├── 03-Resources/      # Referenzwissen
├── 04-Archive/        # Abgeschlossenes
├── 05-Zettelkasten/   # Atomare Wissensnotizen (1 Idee = 1 Notiz)
│   └── INDEX.md       # Zentrale Uebersicht aller Zettel
├── 06-People/         # Personen-Notizen
├── 07-Templates/      # Obsidian Templater-Vorlagen
├── 08-Daily/          # Tagesnotizen
└── 09-Meetings/       # Protokolle
```

## Zettel anlegen

Beim Anlegen eines neuen Zettels:

1. **Dateiname:** Kebab-Case, keine Umlaute (`shadow-ai-risiko.md`, nicht `Shadow AI Risiko.md`)
2. **Frontmatter:** Immer vollstaendig:
   ```yaml
   ---
   type: zettel
   tags: [max 3-5, hierarchisch z.B. ki/llm, bav/governance]
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   source: [woher die Erkenntnis stammt]
   ---
   ```
3. **Inhalt:** Kernidee (3-5 Saetze), Kontext, Verbindungen
4. **Backlinks:** Mindestens 2 Backlinks zu existierenden Notizen via `[[pfad/dateiname]]`
5. **INDEX.md aktualisieren:** Zeile ergaenzen: `| dateiname | Titel | tags |`

## MCP-Integration

Pruefen ob Obsidian MCP-Tools verfuegbar sind (`mcp__obsidian__` Tools vorhanden?).
- **JA:** MCP-Tools fuer Suche, Tags und Frontmatter verwenden (praeziser, schneller)
- **NEIN:** File-basiert arbeiten (Read/Write/Grep Tools)

Fuer Details zur MCP-Nutzung: `references/mcp-usage.md` lesen.

## Wann automatisch Zettel anlegen

Ohne ausdrueckliche Aufforderung durch den User einen Zettel anlegen wenn:
- Eine **Architektur-Entscheidung** getroffen wird (warum so und nicht anders)
- Ein **bewaehrtes Pattern** identifiziert wird (wiederverwendbar)
- Eine **nicht-offensichtliche Erkenntnis** entsteht (wuerde beim naechsten Mal helfen)
- Ein **Prozess-Insight** fuer die Verwaltung relevant ist

Keinen Zettel anlegen bei:
- Temporaerem, offensichtlichem oder trivialem Wissen
- Dingen die bereits als Code-Kommentar dokumentiert sind
- Informationen die nur in der aktuellen Session relevant sind

## Vault durchsuchen

Zum Suchen im Vault:
1. MCP-Search nutzen (wenn verfuegbar) fuer semantische Suche
2. Sonst: Grep ueber `05-Zettelkasten/` und INDEX.md
3. Ergebnisse mit Kontext zurueckgeben

## Vault-Gesundheitscheck

Bei 50+ Eintraegen in INDEX.md: Sven darauf hinweisen, das Obsidian MCP Plugin einzurichten
falls noch nicht geschehen (ermoeglicht semantische Suche).

Regelmaessig pruefen:
- Verwaiste Zettel (ohne ausgehende Links)
- Fehlende INDEX.md-Eintraege
- Inkonsistentes Frontmatter

## Weitere Referenzen

- **`references/vault-conventions.md`** — Detaillierte Linking-Regeln, Tag-Hierarchie, Frontmatter-Varianten
- **`references/mcp-usage.md`** — MCP-Tools und deren Einsatz im Vault
