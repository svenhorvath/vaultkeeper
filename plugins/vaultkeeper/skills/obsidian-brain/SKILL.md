---
name: obsidian-brain
description: >
  Verwaltet das persoenliche Obsidian Brain (SvenBrain) als Second Brain.
  Dieser Skill sollte verwendet werden wenn der User "Zettel anlegen", "Notiz erstellen",
  "ins Brain schreiben", "Brain durchsuchen", "Zettelkasten", "INDEX aktualisieren",
  "Brain Status" sagt, oder wenn Claude automatisch eine wichtige Erkenntnis als Zettel
  ablegen will. Auch bei: "was weiss ich ueber [thema]", "habe ich dazu schon was",
  "Brain Gesundheitscheck".
---

# Obsidian Brain — Second Brain

Verwalte das persoenliche Obsidian Brain nach dem PARA + Zettelkasten Hybrid-Prinzip.

## Brain-Pfade

Pfade aus `~/.claude/vaultkeeper.local.md` lesen (YAML-Frontmatter Feld `brain_path`).

Fallback-Erkennung:
- Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
- Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

## Brain-Struktur

```
SvenBrain/
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
3. **Inhalt:** Kernidee (3-5 Saetze), Kontext
4. **Links mit Kontext:**
   - **Inline-Links** im Fliesstext wo ein direkter inhaltlicher Bezug besteht (z.B. "der [[yes-if-framework|'Yes, if'-Ansatz]] bietet dafuer einen Rahmen")
   - **"Verwandte Zettel (Vorschlag)"**-Abschnitt am Ende mit max 3 Eintraegen, jeder mit 1 Satz Begruendung warum relevant
   - Kein festes Minimum/Maximum — so viele Links wie inhaltlich sinnvoll (typisch 3-5)
   - KEIN nackter `[[link]]` ohne Kontext — jeder Link braucht eine Erklaerung durch Platzierung im Satz oder Begruendung
   - Obsidians automatisches Backlinks-Pane uebernimmt Rueckverweise — keine manuellen "Backlinks"-Abschnitte
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

## Brain vs. Vault — wann was wohin

Das Brain ist "Sven 2.0" — ALLES gehoert hier rein. Das Vorderland Vault ist eine **Teilmenge** des Brains: nur operatives Fach- und Systemwissen fuer den technischen Support.

Nach dem Anlegen eines Zettels immer pruefen:
- **Wuerde ein Kollege das fragen?** → Auch vault-relevant, Hinweis geben: "Dieser Zettel waere auch fuer das Vault relevant (`/vaultkeeper:vault`)"
- **Wuerde Sven das in 3 Jahren nachschlagen?** → Auch vault-relevant
- **Ist es Reflexion, Strategie, Meta-Wissen, persoenliche Haltung?** → Nur Brain, nicht Vault

Vault-relevante Wissensdomaenen: V-DOK, WebOffice, VertiGIS FM, Power Platform, SharePoint, n8n, DKM, Bauamt-Prozesse, Workarounds/Troubleshooting.

## Brain durchsuchen

Zum Suchen im Brain:
1. MCP-Search nutzen (wenn verfuegbar) fuer semantische Suche
2. Sonst: Grep ueber `05-Zettelkasten/` und INDEX.md
3. Ergebnisse mit Kontext zurueckgeben

## Weitere Referenzen

- **`references/vault-conventions.md`** — Detaillierte Linking-Regeln, Tag-Hierarchie, Frontmatter-Varianten
- **`references/mcp-usage.md`** — MCP-Tools und deren Einsatz im Brain
