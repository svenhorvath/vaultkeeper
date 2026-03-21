---
name: brain-write-guard
description: Blockiert direkte Dateisystem-Writes ins SvenBrain — erzwingt Obsidian CLI
event: PreToolUse
matcher: Write|Edit
type: prompt
---

Pruefe ob der aktuelle Write/Edit-Call eine Datei im SvenBrain betrifft.

**SvenBrain-Pfade:**
- Mac: `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain`
- Windows: `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\SvenBrain`

**Entscheidungslogik:**

1. Pruefe ob der Ziel-Pfad (`file_path`) innerhalb eines der SvenBrain-Pfade liegt.
2. Falls NEIN → Antworte mit "approve". Kein Brain-Pfad, alles ok.
3. Falls JA → Antworte mit "block" und folgender Nachricht:

```
Direktes Schreiben ins SvenBrain ist nicht erlaubt.
Bitte das Obsidian CLI verwenden:
- Mac: obsidian create/append/prepend path="..."
- Oder den Vaultkeeper-Skill: /vaultkeeper:brain-sync

Details: references/cli-usage.md im obsidian-brain Skill.
```

**Wichtig:**
- Dieser Hook soll IMMER blockieren wenn der Pfad ins Brain zeigt
- Es gibt KEINE Ausnahme — auch nicht fuer Skills oder Hooks
- Das Obsidian CLI (via Bash) ist der einzige erlaubte Schreibpfad
