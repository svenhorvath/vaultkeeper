---
allowed-tools: Read, Write, Grep, Glob, Bash, Edit
description: "Wissen ins Vorderland Brain pushen — erstellt .txt + .meta.json in der Inbox"
argument-hint: "[inhalt oder thema]"
---

# /vaultkeeper:brain

Inhalt fuer das Vorderland Brain aufbereiten und in die Inbox schreiben.

## Ablauf

1. Settings aus `~/.claude/vaultkeeper.local.md` lesen (Feld `brain_inbox`)
2. Falls kein Argument: den User fragen was gepusht werden soll
3. Skill `vorderland-brain` laden fuer Format-Details
4. Inhaltsdatei und Sidecar-Metadaten in die Inbox schreiben
5. Hinweis: "Dashboard (localhost:8501) → Import & Status → Einpflegen"

## Beispiele

```
/vaultkeeper:brain Shadow AI ist das groesste Risiko fuer die oeffentliche Verwaltung...
/vaultkeeper:brain Die KIWI-Roadmap 2026 hat drei Schwerpunkte: Governance, Schulung, Pilotprojekte
```
