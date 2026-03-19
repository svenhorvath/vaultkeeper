---
allowed-tools: Read, Write, Grep, Glob, Bash, Edit
description: "Wissen ins Vorderland Vault pushen — erstellt .json in der Inbox"
argument-hint: "[inhalt oder thema]"
---

# /vaultkeeper:vault

Inhalt fuer das Vorderland Vault aufbereiten und als `.json` in die Inbox schreiben.

## Ablauf

1. Settings aus `~/.claude/vaultkeeper.local.md` lesen (Feld `vault_inbox`)
2. Falls kein Argument: den User fragen was gepusht werden soll
3. Skill `vorderland-vault` laden fuer Format-Details
4. Eine `.json` Datei in die Inbox schreiben (Text + Metadaten in einer Datei)
5. Hinweis: "Dashboard (localhost:8501) → Import & Status → Einpflegen"

## Beispiele

```
/vaultkeeper:vault Shadow AI ist das groesste Risiko fuer die oeffentliche Verwaltung...
/vaultkeeper:vault Die KIWI-Roadmap 2026 hat drei Schwerpunkte: Governance, Schulung, Pilotprojekte
```
