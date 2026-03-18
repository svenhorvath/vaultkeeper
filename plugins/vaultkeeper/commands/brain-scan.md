---
allowed-tools: Read, Write, Grep, Glob, Bash
description: "Vault nach team-relevanten Zettel durchsuchen und fuer Brain vorschlagen"
---

# /vaultkeeper:brain-scan

Den Zettelkasten nach Inhalten durchsuchen die fuer das Team relevant sind.

## Ablauf

1. Settings aus `~/.claude/vaultkeeper.local.md` lesen (Felder `vault_path` und `brain_inbox`)
2. Alle Zettel in `05-Zettelkasten/` lesen
3. Jeden Zettel bewerten:
   - **Team-relevant:** Prozesse, Anleitungen, Fachkompetenz, How-Tos
   - **Nicht relevant:** Persoenliche Reflexionen, individuelle Notizen, Meinungen
4. Kandidaten als Liste mit Begruendung anzeigen
5. Auf Bestaetigung des Users warten (welche sollen gepusht werden?)
6. Bestaetigte Zettel als `.txt` + `.meta.json` in die Brain-Inbox schreiben
7. Skill `vorderland-brain` laden fuer Sidecar-Format

## Wichtig

- NIEMALS automatisch pushen — immer Bestaetigung abwarten
- Zettel die bereits in der Inbox liegen ueberspringen (Duplikat-Check via Dateiname)
