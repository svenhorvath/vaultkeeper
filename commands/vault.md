---
allowed-tools: Read, Write, Grep, Glob
description: "Wissen ins Vorderland Vault pushen — erstellt .json in der Inbox"
argument-hint: "[inhalt oder thema]"
---

# /vaultkeeper:vault

Inhalt fuer das Vorderland Vault aufbereiten und als `.json` in die Inbox schreiben.

## Sicherheitsregeln

- `~/.claude/vaultkeeper.local.md` nur LESEN, niemals aendern
- Vor dem Schreiben pruefen ob eine Datei mit gleichem Namen bereits in der Inbox existiert. Falls ja: Suffix `-2`, `-3` etc. anhaengen.

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
