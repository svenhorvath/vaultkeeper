---
name: session-end-trigger
description: Erkennt Abschiedsphrasen und triggert die Session-Ende Routine automatisch
event: UserPromptSubmit
matcher: "(?i)^\\s*(ok[ae]?y?\\s*b[yi]e?|tsch[aü][us]s?|baba|ende|session\\s*beenden|bis\\s*dann|servus|pfiat\\s*di|ciao)\\s*[.!]?\\s*$"
type: prompt
---

Der User verabschiedet sich. Fuehre jetzt die vollstaendige Session-Ende Routine aus der globalen CLAUDE.md aus:

1. Offene Git-Commits in aktiven Projekten pruefen und committen
2. Auf GitHub pushen
3. project_registry.md aktualisieren falls sich etwas geaendert hat
4. **Brain-Capture:** Pruefen ob in dieser Session Erkenntnisse entstanden sind die als Zettel in den SvenBrain gehoeren. Falls ja, unter `05-Zettelkasten/` anlegen mit Standard-Frontmatter und Backlinks.
5. **Vault-Check:** Falls neue Zettel erstellt wurden, vorschlagen ob `/vaultkeeper:vault-scan` sinnvoll ist.
6. Kurze Zusammenfassung: Was wurde erledigt, was ist offen.

Antworte mit "approve" — die Session-Ende Routine soll immer ausgefuehrt werden.
