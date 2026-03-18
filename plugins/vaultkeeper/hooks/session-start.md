---
event: SessionStart
---

# Vaultkeeper — Session Start

Beim Start jeder Session den Obsidian Vault-Kontext laden.

## Ablauf

1. **Settings lesen:** Datei `~/.claude/vaultkeeper.local.md` lesen.
   - Falls nicht vorhanden: Betriebssystem erkennen und bekannte Pfade pruefen:
     - Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenVault`
     - Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenVault`
   - Pruefen ob der Pfad existiert. Falls ja: `vaultkeeper.local.md` automatisch anlegen.
   - Falls kein Vault gefunden: Hinweis ausgeben und Hook beenden.

2. **INDEX.md laden:** Datei `[vault-pfad]/05-Zettelkasten/INDEX.md` lesen.
   - Falls nicht vorhanden: Leere INDEX.md anlegen mit Header-Zeile.

3. **Kontext herstellen:** Basierend auf dem aktuellen Arbeitsverzeichnis und Projektkontext
   2-3 thematisch relevante Zettel aus der INDEX.md auswaehlen und lesen.

4. **Kurze Meldung:** "Vaultkeeper: [X] Zettel im Vault. Kontext geladen: [zettel-namen]"

## Wichtig

- Kein Fehler wenn Vault nicht erreichbar — nur Hinweis.
- INDEX.md ist eine Markdown-Tabelle: `| dateiname | Titel | tags |`
- Maximal 3 Zettel laden um Token-Budget zu schonen.
