# Vaultkeeper

Persoenliches Wissensmanagement-Plugin fuer Claude Code.

**Zwei Richtungen, ein System:**
- **SvenBrain (Obsidian)** — Wissen sammeln (Second Brain)
- **Vorderland Vault** — Wissen teilen (Team-Wissensdatenbank auf Qdrant)

## Installation

```bash
# Plugin-Verzeichnis klonen
git clone git@github.com:svenhorvath/vaultkeeper.git

# In Claude Code registrieren (einmalig)
claude plugins add /pfad/zu/vaultkeeper
```

## Setup pro Geraet

Beim ersten Start erkennt Vaultkeeper automatisch das Betriebssystem und legt
`~/.claude/vaultkeeper.local.md` an. Alternativ manuell erstellen:

```markdown
---
brain_path: "C:\\Users\\horvaths\\OneDrive - Region Vorderland-Feldkirch\\SvenBrain"
vault_inbox: "C:\\Users\\horvaths\\OneDrive - Region Vorderland-Feldkirch\\Claude\\Dev\\vorderland-vault\\docker\\shared\\inbox"
---
```

## Commands

| Command | Beschreibung |
|---------|-------------|
| `/vaultkeeper:vault [inhalt]` | Wissen ins Vorderland Vault pushen |
| `/vaultkeeper:vault-scan` | Brain nach team-relevanten Inhalten durchsuchen |
| `/vaultkeeper:prepare-dokument [datei]` | Dokumente (PDF, XLSX, DOCX) fuer Vault aufbereiten |

## Wie es funktioniert

### Dokument-Aufbereitung (prepare-dokument)

Claude liest Dokumente selbst (multimodal) — kein Python-Script, kein Informationsverlust.
PDF, XLSX, DOCX, Bilder werden nativ gelesen und als `.json` in die Inbox geschrieben.

Jede JSON-Datei enthaelt Text und Metadaten zusammen:
```json
{
  "title": "Dokumenttitel",
  "document_type": "anleitung",
  "bereich": "v-dok",
  "content": "Der vollstaendige extrahierte Text..."
}
```

n8n holt die JSON aus der Inbox, chunked den Text, embedded und speichert in Qdrant.

### Vault Push

Wissen direkt aus dem Chat ins Vault pushen — Claude erstellt die JSON automatisch.

### Vault Scan

Brain nach team-relevanten Zetteln durchsuchen, User bestaetigt, dann als JSON in die Inbox.

## Skills

| Skill | Trigger |
|-------|---------|
| `obsidian-brain` | "Zettel anlegen", "Brain durchsuchen", automatisch bei Erkenntnissen |
| `vorderland-vault` | "Vault:", "ins Vault pushen", "Dokument vorbereiten" |

## Hook

**SessionStart:** Laedt automatisch den Zettelkasten-INDEX beim Start jeder Session.

## MCP-Integration (optional)

Fuer erweiterten Brain-Zugriff (semantische Suche, Tags, Frontmatter):

1. In Obsidian: Community Plugin "Local REST API" installieren
2. In Claude Code:
   ```bash
   claude mcp add --scope user obsidian -e OBSIDIAN_API_KEY=KEY -e OBSIDIAN_HOST=127.0.0.1 -e OBSIDIAN_PORT=27124 -- npx obsidian-mcp-server
   ```

Vaultkeeper erkennt automatisch ob MCP verfuegbar ist und nutzt es.

## Voraussetzungen

- Claude Code CLI
- Obsidian + Local REST API Plugin (optional, fuer MCP)
