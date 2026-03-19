# Obsidian MCP-Integration

## Voraussetzungen

- Obsidian muss laufen (MCP-Server laeuft als Obsidian-Plugin)
- "Local REST API" Community Plugin in Obsidian installiert und aktiviert
- MCP-Server in Claude Code registriert:
  ```bash
  claude mcp add --scope user obsidian -e OBSIDIAN_API_KEY=KEY -e OBSIDIAN_HOST=127.0.0.1 -e OBSIDIAN_PORT=27124 -- npx obsidian-mcp-server
  ```

## Verfuegbarkeit pruefen

MCP ist verfuegbar wenn Tools mit Praefix `mcp__obsidian__` existieren.
Falls nicht verfuegbar: auf File-basierten Zugriff zurueckfallen (Read/Write/Grep).

## Verfuegbare MCP-Tools

| Tool | Zweck |
|------|-------|
| `mcp__obsidian__read` | Notiz lesen (Inhalt + Frontmatter) |
| `mcp__obsidian__update` | Notiz aktualisieren |
| `mcp__obsidian__search_replace` | Suchen und Ersetzen in Notizen |
| `mcp__obsidian__global_search` | Vault-weite Suche |
| `mcp__obsidian__list` | Dateien/Ordner auflisten |
| `mcp__obsidian__get_tags` | Alle Tags im Vault abrufen |
| `mcp__obsidian__get_frontmatter` | Frontmatter einer Notiz lesen |
| `mcp__obsidian__delete` | Notiz loeschen (VORSICHT — besser in Archive verschieben) |

## Wann MCP bevorzugen

- **Suche:** `global_search` ist schneller und praeziser als Grep ueber Dateien
- **Tags:** `get_tags` gibt alle Tags im Vault zurueck — ideal fuer Konsistenz-Checks
- **Frontmatter:** `get_frontmatter` parsed YAML zuverlaessig
- **Batch-Operationen:** MCP vermeidet Dateisystem-Probleme bei vielen gleichzeitigen Zugriffen

## Wann File-basiert arbeiten

- Wenn Obsidian nicht laeuft (MCP nicht verfuegbar)
- Beim Erstellen neuer Dateien (Write Tool ist direkter)
- Beim Lesen der INDEX.md (einfache Textdatei, kein MCP noetig)

## Fallback-Strategie

```
1. Pruefen: Gibt es mcp__obsidian__ Tools?
2. JA → MCP verwenden
3. NEIN → File-basiert (Read/Write/Grep)
4. Beides nicht moeglich → Hinweis an User: "Obsidian und Vault nicht erreichbar"
```
