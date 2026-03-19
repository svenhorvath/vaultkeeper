---
name: session-end-trigger
description: Erkennt Abschiedsphrasen und triggert Session-Ende Routine inkl. Brain-Capture
event: UserPromptSubmit
matcher: "(?i)^\\s*(ok[ae]?y?\\s*b[yi]e?|tsch[aü][us]s?|baba|ende|session\\s*beenden|bis\\s*dann|servus|pfiat\\s*di|ciao|gute\\s*nacht|feierabend|das\\s*wars?)\\s*[.!]?\\s*$"
type: prompt
---

Der User verabschiedet sich. Fuehre die Session-Ende Routine aus:

1. **Git:** Offene Commits in aktiven Projekten pruefen und committen, auf GitHub pushen.

2. **project_registry.md:** Aktualisieren falls sich etwas geaendert hat.

3. **Brain-Capture:** Pruefe ob in dieser Session wertvolle Erkenntnisse entstanden sind. Unterscheide:
   - **Architektur-Entscheidung** getroffen? → Zettel mit Tags `#adr` anlegen
   - **Wiederverwendbares Pattern** identifiziert? → Zettel mit `#pattern` anlegen
   - **Aus Fehler gelernt?** → Zettel mit `#lessons-learned` anlegen
   - **Workaround dokumentiert?** → Zettel mit `#workaround` anlegen + Vault-Hinweis
   - **Sonstige nicht-offensichtliche Erkenntnis?** → Zettel mit thematischen Tags
   Erstelle Zettel unter `05-Zettelkasten/` mit Standard-Frontmatter und mindestens 2 Links. INDEX.md aktualisieren.
   Falls nichts Neues: diesen Schritt kommentarlos ueberspringen.

4. **Vault-Check:** Falls neue Zettel erstellt — waere davon etwas team-relevant? Hinweis auf `/vaultkeeper:vault-scan`.

5. **Zusammenfassung:** Was wurde erledigt, was ist offen.

Antworte mit "approve" — die Routine soll immer ausgefuehrt werden.
