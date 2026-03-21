# Obsidian CLI-Integration

## Voraussetzungen

- Obsidian v1.12.4+ muss laufen (CLI kommuniziert via IPC mit der App)
- CLI in Obsidian aktiviert: Settings → General → Advanced → CLI → Register CLI
- CLI-Binary:
  - Mac: `/Applications/Obsidian.app/Contents/MacOS/Obsidian`
  - Windows: CLI nach Registration im PATH verfuegbar (`obsidian`)

## CLI-Aufruf

```bash
# Mac (voller Pfad, falls nicht im PATH)
/Applications/Obsidian.app/Contents/MacOS/Obsidian <command> [options]

# Windows (nach Registration automatisch im PATH)
obsidian <command> [options]
```

## Verfuegbare Commands

| Zweck | Command | Beispiel |
|-------|---------|---------|
| Notiz lesen | `read` | `obsidian read path="05-Zettelkasten/frozen-stack-pattern.md"` |
| Notiz erstellen | `create` | `obsidian create path="05-Zettelkasten/neuer-zettel.md" content="---\ntype: zettel\n---\n\n# Titel"` |
| Inhalt anhaengen | `append` | `obsidian append path="pfad.md" content="Neuer Absatz"` |
| Inhalt voranstellen | `prepend` | `obsidian prepend path="pfad.md" content="Neuer Absatz"` |
| Vault-weite Suche | `search` | `obsidian search query="pattern" limit=10` |
| Suche mit Kontext | `search:context` | `obsidian search:context query="pattern" limit=5` |
| Dateien auflisten | `files` | `obsidian files folder="05-Zettelkasten"` |
| Ordner auflisten | `folders` | `obsidian folders` |
| Tags auflisten | `tags` | `obsidian tags counts sort=count` |
| Tags einer Datei | `tags` | `obsidian tags path="pfad.md"` |
| Frontmatter lesen | `properties` | `obsidian properties path="pfad.md" format=yaml` |
| Property lesen | `property:read` | `obsidian property:read name="tags" path="pfad.md"` |
| Property setzen | `property:set` | `obsidian property:set name="updated" value="2026-03-21" path="pfad.md"` |
| Property entfernen | `property:remove` | `obsidian property:remove name="draft" path="pfad.md"` |
| Datei verschieben | `move` | `obsidian move path="00-Inbox/note.md" to="04-Archive/"` |
| Datei umbenennen | `rename` | `obsidian rename path="pfad.md" name="neuer-name.md"` |
| Tasks auflisten | `tasks` | `obsidian tasks todo` |
| Task abschliessen | `task` | `obsidian task path="pfad.md" line=5 done` |
| Backlinks | `backlinks` | `obsidian backlinks path="pfad.md"` |
| Outgoing Links | `links` | `obsidian links path="pfad.md"` |
| Vault-Info | `vault` | `obsidian vault` |
| Daily Note lesen | `daily:read` | `obsidian daily:read` |
| Daily Note anhaengen | `daily:append` | `obsidian daily:append content="- Task erledigt"` |

## Wann CLI bevorzugen

- **Immer** wenn Obsidian laeuft — CLI ist der primaere Zugriffspfad
- **Suche:** `search` und `search:context` sind schneller und praeziser als Grep ueber Dateien
- **Tags:** `tags` gibt alle Tags im Vault zurueck — ideal fuer Konsistenz-Checks
- **Frontmatter:** `properties` und `property:read` parsen YAML zuverlaessig
- **Moves:** CLI aktualisiert automatisch Wikilinks (File-basiert kann das nicht)
- **Tasks:** Checkboxen programmatisch setzen/abhaken

## Wann File-basiert arbeiten

- Wenn Obsidian nicht laeuft (CLI nicht verfuegbar)
- Beim Lesen der INDEX.md (einfache Textdatei, CLI-Overhead unnoetig)

## Fallback-Strategie

```
1. CLI testen: obsidian version (Exit-Code pruefen)
2. Erfolgreich → CLI verwenden
3. Fehlgeschlagen → File-basiert (Read/Write/Grep mit absolutem brain_path)
4. Beides nicht moeglich → Hinweis an User: "Obsidian und Vault nicht erreichbar"
```

## Hinweise

- Pfade mit Leerzeichen in Quotes: `path="01-Projects/Mein Projekt/note.md"`
- Newlines in Content mit `\n` escapen
- Output-Formate: `format=json|tsv|csv|yaml` je nach Command
- `--copy` Flag kopiert Output in die Zwischenablage
