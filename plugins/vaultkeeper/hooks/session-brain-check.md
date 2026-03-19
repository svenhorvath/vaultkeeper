---
name: session-brain-check
description: Prueft bei Session-Start ob das aktuelle Projekt einen Brain-Eintrag hat
event: SessionStart
matcher: startup
type: prompt
---

Pruefe kurz ob im aktuellen Arbeitsverzeichnis eine CLAUDE.md existiert die einen "## Brain-Kontext" Abschnitt enthaelt.

- Falls CLAUDE.md existiert UND "Brain-Kontext" enthaelt: Antworte mit "approve" — alles in Ordnung.
- Falls CLAUDE.md existiert OHNE "Brain-Kontext": Antworte mit "approve" aber merke dir fuer spaeter: Dieses Projekt hat noch keinen Brain-Eintrag. Schlage bei passender Gelegenheit `/vaultkeeper:brain-init` vor.
- Falls keine CLAUDE.md existiert: Antworte mit "approve" — nicht jedes Verzeichnis braucht eine.

Antworte IMMER mit "approve". Dieser Check soll nie blockieren, nur informieren.
