# Obsidian MCP-Integration

## Voraussetzungen

- Obsidian muss laufen (MCP-Server laeuft als Obsidian-Plugin)
- "Local REST API" Community Plugin in Obsidian installiert und aktiviert
- MCP-Server in Claude Code registriert:
  ```bash
  claude mcp add --scope user obsidian -e OBSIDIAN_API_KEY=KEY -e OBSIDIAN_BASE_URL=https://127.0.0.1:27124 -e OBSIDIAN_VERIFY_SSL=false -- npx -y obsidian-mcp-server
  ```
  **Wichtig:** `OBSIDIAN_HOST`/`OBSIDIAN_PORT` werden vom Package ignoriert. Nur `OBSIDIAN_BASE_URL` funktioniert.

## Verfuegbarkeit pruefen

MCP ist verfuegbar wenn Tools mit Praefix `mcp__obsidian__` existieren.
Falls nicht verfuegbar: auf File-basierten Zugriff zurueckfallen (Read/Write/Grep).

## Verfuegbare MCP-Tools

| Tool | Zweck |
|------|-------|
| `mcp__obsidian__obsidian_read_note` | Notiz lesen (Inhalt + Frontmatter) |
| `mcp__obsidian__obsidian_update_note` | Notiz erstellen/aktualisieren (targetType, modificationType, wholeFileMode noetig) |
| `mcp__obsidian__obsidian_search_replace` | Suchen und Ersetzen in Notizen |
| `mcp__obsidian__obsidian_global_search` | Vault-weite Suche |
| `mcp__obsidian__obsidian_list_notes` | Dateien/Ordner auflisten |
| `mcp__obsidian__obsidian_manage_tags` | Tags verwalten |
| `mcp__obsidian__obsidian_manage_frontmatter` | Frontmatter lesen/aendern |
| `mcp__obsidian__obsidian_delete_note` | Notiz loeschen (VORSICHT — besser in 04-Archive verschieben) |

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
