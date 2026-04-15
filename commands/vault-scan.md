---
allowed-tools: Read, Write, Grep, Glob, Bash
description: "Brain nach team-relevanten Zettel durchsuchen und fuer Vault vorschlagen"
---

# /vaultkeeper:vault-scan

Den Zettelkasten nach Inhalten durchsuchen die fuer das Team relevant sind.

## Ablauf

1. Settings aus `~/.claude/vaultkeeper.local.md` lesen (Felder `brain_path` und `vault_inbox`)
2. Alle `.md`-Dateien im gesamten Brain rekursiv lesen (`brain_path/**/*.md`)
3. Jede Datei bewerten und in **drei Kategorien** einordnen (siehe Vault-Tracking unten):
   - **Neu:** Team-relevant UND kein `vault:`-Block im Frontmatter → Push-Kandidat
   - **Stale im Vault:** `vault:`-Block vorhanden UND `updated > vault.pushed` → Re-Push-Kandidat
   - **Synced:** `vault:`-Block vorhanden UND `updated <= vault.pushed` → ueberspringen
   - **Nicht relevant:** Persoenliche Reflexionen, individuelle Notizen, Meinungen → ueberspringen
4. Kandidaten pro Kategorie als Liste mit Begruendung anzeigen (Neu / Stale)
5. Auf Bestaetigung des Users warten (welche sollen gepusht werden?)
6. Bestaetigte Zettel als `.json` in die Vault-Inbox schreiben (Text + Metadaten in einer Datei)
7. Skill `vorderland-vault` laden fuer JSON-Format
8. **Frontmatter-Stamping:** Nach erfolgreichem Inbox-Write das Brain-Zettel-Frontmatter mit `vault:`-Block ergaenzen/aktualisieren (siehe Vault-Tracking unten)

## Vault-Tracking im Frontmatter (ADR 2026-04-15)

Jeder gepushte Brain-Eintrag bekommt einen `vault:`-Block im YAML-Frontmatter. Das Feld ist die einzige Wahrheitsquelle ueber den Vault-Status des Zettels.

**Schema:**
```yaml
vault:
  pushed: 2026-04-15        # ISO-Datum des letzten erfolgreichen Pushs
  doc_id: zettel-slug       # Qdrant-Dokument-ID (default: Dateiname ohne .md)
  version: 1                # inkrementiert bei jedem Re-Push nach Update
  collection: vorderland    # Qdrant-Collection (default: vorderland)
```

**Stamping-Methode (plattformabhaengig):**
- **Windows (Platform: win32):** `perl -i -pe` um den Block vor die schliessende `---` des Frontmatters einzufuegen oder `pushed`/`version` zu aktualisieren
- **Mac (Platform: darwin):** `sed -i ''` mit aequivalenter Logik

**Stale-Kriterium:** `frontmatter.updated > frontmatter.vault.pushed` → Zettel ist stale im Vault.

**Bei Re-Push:** `vault.version` um 1 erhoehen, `vault.pushed` auf heute setzen.

## Wichtig

- NIEMALS automatisch pushen — immer Bestaetigung abwarten
- Zettel die bereits in der Inbox liegen ueberspringen (Duplikat-Check via Dateiname)
- Synced-Zettel (Kategorie 3) NICHT in der Kandidatenliste zeigen — nur als Kennzahl ("X bereits synced")
- `~/.claude/vaultkeeper.local.md` nur LESEN, niemals aendern
- Nur `.md`-Dateien lesen. Symlinks, `07-Templates/` und versteckte Ordner ignorieren.
- Frontmatter-Stamping ist eine Schreiboperation ins Brain — laeuft nur hier (innerhalb vault-scan) als Ausnahme der "nur brain-sync darf schreiben"-Regel, da vault-scan Teil des Vaultkeeper-Plugins ist.
