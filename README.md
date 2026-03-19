# Vaultkeeper

Persoenliches Wissensmanagement-Plugin fuer Claude Code.

**Zwei Richtungen, ein System:**
- **Obsidian Vault** — Wissen sammeln (Second Brain)
- **Vorderland Brain** — Wissen teilen (Team-Wissensdatenbank auf Qdrant)

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
vault_path: "C:\\Users\\horvaths\\OneDrive - Region Vorderland-Feldkirch\\SvenVault"
brain_inbox: "C:\\Users\\horvaths\\OneDrive - Region Vorderland-Feldkirch\\Claude\\Dev\\vorderland-brain\\docker\\shared\\inbox"
---
```

## Commands

| Command | Beschreibung |
|---------|-------------|
| `/vaultkeeper:brain [inhalt]` | Wissen ins Vorderland Brain pushen |
| `/vaultkeeper:brain-scan` | Vault nach team-relevanten Inhalten durchsuchen |
| `/vaultkeeper:prepare-dokument [datei]` | Dokumente (PDF, XLSX, DOCX) fuer Brain aufbereiten |

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

### Brain Push

Wissen direkt aus dem Chat ins Brain pushen — Claude erstellt die JSON automatisch.

### Brain Scan

Vault nach team-relevanten Zetteln durchsuchen, User bestaeigt, dann als JSON in die Inbox.

## Skills

| Skill | Trigger |
|-------|---------|
| `obsidian-vault` | "Zettel anlegen", "Vault durchsuchen", automatisch bei Erkenntnissen |
| `vorderland-brain` | "Brain:", "ins Brain pushen", "Dokument vorbereiten" |

## Hook

**SessionStart:** Laedt automatisch den Zettelkasten-INDEX beim Start jeder Session.

## MCP-Integration (optional)

Fuer erweiterten Vault-Zugriff (semantische Suche, Tags, Frontmatter):

1. In Obsidian: Community Plugin "Local REST API" installieren
2. In Claude Code:
   ```bash
   claude mcp add --scope user obsidian -e OBSIDIAN_API_KEY=KEY -e OBSIDIAN_HOST=127.0.0.1 -e OBSIDIAN_PORT=27124 -- npx obsidian-mcp-server
   ```

Vaultkeeper erkennt automatisch ob MCP verfuegbar ist und nutzt es.

## Voraussetzungen

- Claude Code CLI
- Obsidian + Local REST API Plugin (optional, fuer MCP)
