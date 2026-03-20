---
allowed-tools: Read, Write, Grep, Glob
description: "Brain nach team-relevanten Zettel durchsuchen und fuer Vault vorschlagen"
---

# /vaultkeeper:vault-scan

Den Zettelkasten nach Inhalten durchsuchen die fuer das Team relevant sind.

## Ablauf

1. Settings aus `~/.claude/vaultkeeper.local.md` lesen (Felder `brain_path` und `vault_inbox`)
2. Alle Zettel in `05-Zettelkasten/` lesen
3. Jeden Zettel bewerten:
   - **Team-relevant:** Prozesse, Anleitungen, Fachkompetenz, How-Tos
   - **Nicht relevant:** Persoenliche Reflexionen, individuelle Notizen, Meinungen
4. Kandidaten als Liste mit Begruendung anzeigen
5. Auf Bestaetigung des Users warten (welche sollen gepusht werden?)
6. Bestaetigte Zettel als `.json` in die Vault-Inbox schreiben (Text + Metadaten in einer Datei)
7. Skill `vorderland-vault` laden fuer JSON-Format

## Wichtig

- NIEMALS automatisch pushen — immer Bestaetigung abwarten
- Zettel die bereits in der Inbox liegen ueberspringen (Duplikat-Check via Dateiname)
- `~/.claude/vaultkeeper.local.md` nur LESEN, niemals aendern
- Nur `.md`-Dateien in `05-Zettelkasten/` lesen. Symlinks ignorieren.
