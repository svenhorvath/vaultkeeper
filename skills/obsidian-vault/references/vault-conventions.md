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

## Linking-Regeln

- Jede neue Notiz MUSS mindestens 1 Backlink zu einer existierenden Notiz haben
- Personen immer als `[[06-People/vorname-nachname]]` verlinken
- Projekte immer als `[[01-Projects/projektname/projektname]]` verlinken
- Zettel untereinander verlinken mit `[[05-Zettelkasten/dateiname]]`
- Wiki-Syntax verwenden `[[...]]`, keine relativen Pfade

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
