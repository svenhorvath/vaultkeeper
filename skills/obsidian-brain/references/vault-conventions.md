# Vault-Konventionen — Detailreferenz

## Frontmatter-Varianten nach Notiz-Typ

### Zettel (05-Zettelkasten/)
```yaml
---
type: zettel
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: [Quelle der Erkenntnis]
---
```

### Meeting (09-Meetings/)
```yaml
---
type: meeting
tags: [meeting]
created: YYYY-MM-DD
project: [Projektname oder leer]
teilnehmer: []
---
```

### Person (06-People/)
```yaml
---
type: person
tags: [person]
created: YYYY-MM-DD
updated: YYYY-MM-DD
organisation: [Organisation]
rolle: [Rolle/Position]
---
```

### Projekt-MOC (01-Projects/)
```yaml
---
type: project
tags: [project]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active|completed|on-hold|archived
---
```

### Daily Note (08-Daily/)
```yaml
---
type: daily
tags: [daily]
created: YYYY-MM-DD
---
```

**Linking:** Daily Notes folgen denselben Linking-Regeln wie alle anderen Notiz-Typen. Projekte, Personen, Zettel, Areas und Ressourcen die im Text erwaehnt werden, muessen als `[[wikilink|Anzeigename]]` verlinkt werden — sofern ein passender Eintrag im Brain existiert.

## Linking-Regeln

### Grundprinzip: Links brauchen Kontext

Jeder Link muss erklaeren WARUM er gesetzt wird — entweder durch seine Position im Satz (Inline) oder durch eine kurze Begruendung (Footer). Ein nackter `[[link]]` ohne Kontext ist wertlos.

### Inline-Links (primaere Methode)

Links gehoeren in den Fliesstext, dort wo der inhaltliche Bezug besteht:
```markdown
Die Loesung ist nicht Verbote, sondern kontrolliertes Ermoeglichen —
der [[yes-if-framework|"Yes, if"-Ansatz]] bietet dafuer einen konkreten Rahmen.
```

### Verwandte Zettel (sekundaere Methode)

Am Ende der Notiz unter `## Verwandte Zettel (Vorschlag)` fuer allgemeine thematische Verbindungen — jeder Eintrag mit 1 Satz Begruendung:
```markdown
## Verwandte Zettel (Vorschlag)
- [[poc-auf-privatgeraet-strategie]] — ein Weg, Shadow AI in geordnete Bahnen zu lenken
- [[konstruktiver-rebell-haltung]] — die Haltung die dahintersteckt
```

Das Label "(Vorschlag)" zeigt an, dass die Links von Claude generiert und noch nicht von Sven reviewt wurden. Nach Review wird "(Vorschlag)" entfernt.

### Keine manuellen Backlinks

Obsidians automatisches Backlinks-Pane zeigt Rueckverweise. Kein manueller "Backlinks"-Abschnitt am Ende der Notiz.

### Verlinkungssyntax

- Personen: `[[06-People/vorname-nachname]]`
- Projekte: `[[01-Projects/projektname/projektname]]`
- Zettel untereinander: `[[dateiname]]` (Obsidian loest den Pfad automatisch auf)
- Wiki-Syntax verwenden `[[...]]`
- Display-Text mit Pipe: `[[dateiname|Anzeigename]]`

### Anzahl Links

Kein festes Minimum oder Maximum. Typisch 3-5 Links pro Zettel. Qualitaet schlaegt Quantitaet.

## Tag-Hierarchie

Tags sparsam verwenden, maximal 3-5 pro Notiz. Hierarchisch aufgebaut:

```
#ki/llm
#ki/mcp
#ki/governance
#bav/governance
#bav/digitalisierung
#bav/prozesse
#tools/power-automate
#tools/sharepoint
#tools/n8n
#projekt/kiwi
#projekt/stundenerfassung
```

## Dateinamen-Konventionen

- Kebab-Case: `shadow-ai-risiko-verwaltung.md`
- Keine Umlaute in Dateinamen (oe, ae, ue statt ö, ä, ü)
- Keine Leerzeichen
- Beschreibend aber kurz (max 50 Zeichen)
- Sprache: Deutsch fuer Inhalte, englische Fachbegriffe in Originalschreibweise

## INDEX.md Format

Die INDEX.md im Zettelkasten ist eine Markdown-Tabelle:

```markdown
# Zettelkasten Index

| Datei | Titel | Tags |
|-------|-------|------|
| shadow-ai-risiko-verwaltung | Shadow AI als Risiko in der Verwaltung | ki/governance, bav/governance |
| yes-if-framework | Yes-If Framework statt No-Because | bav/governance, ki/governance |
```

Neue Eintraege immer am Ende der Tabelle anfuegen.
