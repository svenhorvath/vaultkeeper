---
name: session-end-trigger
description: Erkennt Abschiedsphrasen und triggert Session-Ende Routine inkl. Brain-Capture
event: UserPromptSubmit
matcher: "(?i)^\\s*(ok[ae]?y?\\s*b[yi]e?|tsch[aü][us]s?|baba|session\\s*beenden|bis\\s*dann|servus|pfiat\\s*di|ciao|gute\\s*nacht|feierabend|das\\s*wars?)\\s*[.!]?\\s*$"
type: prompt
---

Der User verabschiedet sich. Fuehre die Session-Ende Routine aus:

1. **Git:** Offene Aenderungen pruefen, committen, auf GitHub pushen.
2. **project_registry.md:** Aktualisieren falls sich etwas geaendert hat.
3. **Brain-Sync:** `/vaultkeeper:brain-sync` ausfuehren — dieser Command uebernimmt das komplette Brain-Update eigenstaendig.
4. **Zusammenfassung:** Was wurde erledigt, was ist offen.

Fuehre diese Schritte AUTOMATISCH aus. Antworte mit "approve".
