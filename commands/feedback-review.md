---
allowed-tools: Read, Bash, AskUserQuestion
description: "Offene Chat-Feedbacks aus Vorderland Vault reviewen und markieren (resolved/dismissed/in_progress)"
---

# /vaultkeeper:feedback-review

Ruft offene anonyme Feedback-Eintraege aus der Vorderland Vault Datenbank ab, zeigt sie an und erlaubt dem Review-Verantwortlichen, jeden Eintrag zu markieren.

## Zweck

Ersatz fuer das klassische User-Audit-Log (widerspricht dem No-Tracking-Prinzip). Statt User-Queries zu loggen, gibt das Frontend den Usern einen anonymen Feedback-Button (Thumbs Up/Down + Kategorie + optionaler Kommentar). Dieser Command schliesst den Review-Zyklus: offene Feedbacks durchgehen, Qualitaetsprobleme adressieren, Eintrag als erledigt markieren.

## Voraussetzungen

- Projekt-Verzeichnis `vorderland-vault` muss lokal verfuegbar sein (Token in `docker/.env`)
- n8n muss laufen (Container `docker-n8n-1`)
- Zwei n8n-Workflows aktiv: `Feedback Review Queue` + `Feedback Review Mark`

## Pfad-Ermittlung

Projekt-Root per Plattform:
- **Mac (`Platform: darwin`):** `/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/Claude/Dev/vorderland-vault`
- **Windows (`Platform: win32`):** `C:\Users\horvaths\OneDrive - Region Vorderland-Feldkirch\Claude\Dev\vorderland-vault`

n8n-Webhooks: `http://localhost:5678/webhook/feedback-review-queue` (GET), `.../feedback-review-mark` (POST).

## Ablauf

1. **Token lesen**
   ```bash
   TOKEN=$(grep ^FEEDBACK_REVIEW_TOKEN "<projekt-root>/docker/.env" | cut -d= -f2)
   ```
   Falls leer: Abbruch mit Hinweis "FEEDBACK_REVIEW_TOKEN in docker/.env fehlt — siehe vorderland-vault Roadmap P0 #3".

2. **Offene Feedbacks abrufen**
   ```bash
   curl -sS -H "Authorization: Bearer $TOKEN" http://localhost:5678/webhook/feedback-review-queue
   ```
   Erwartetes JSON: `{status, count, items:[{id, session_id, query_preview, answer_preview, rating, category, comment, response_ms, created_at, review_status}]}`.

3. **Wenn `count === 0`:** Ausgabe "Keine offenen Feedbacks. Alles reviewed." und Ende.

4. **Pro Eintrag anzeigen** (chronologisch absteigend, wie vom Workflow geliefert):
   ```
   [id 42 · 17.04.2026 14:32 · 👎 Ungenau]
   Frage:   "Was ist ein GWP?"
   Antwort: "Ein GWP ist ein..."
   Kommentar: "Antwort war zu oberflaechlich"
   Response-Zeit: 1200ms
   ```
   Bei Thumbs Up (rating=1) `👍` statt `👎`, Category kann leer sein.

5. **Pro Eintrag AskUserQuestion** mit Optionen:
   - `resolved` — Problem adressiert (z.B. Dokument nachgepflegt, Chunking verbessert)
   - `dismissed` — kein Handlungsbedarf (User-Fehler, nicht reproduzierbar, etc.)
   - `in_progress` — wird noch bearbeitet (bleibt in Queue, aber markiert)
   - `skip` — jetzt nicht, bleibt offen
   - `stop` — Review-Session beenden

6. **Bei `resolved`/`dismissed`/`in_progress`:** optionalen `review_note`-Freitext abfragen (max. 500 Zeichen), dann POST:
   ```bash
   curl -sS -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:5678/webhook/feedback-review-mark \
     -d "{\"id\": 42, \"review_status\": \"resolved\", \"review_note\": \"...\"}"
   ```
   Bei HTTP 200: kurz bestaetigen. Bei Fehler: melden und mit naechstem Eintrag weitermachen.

7. **Abschluss-Summary:** Wie viele `resolved`, `dismissed`, `in_progress`, `skipped` — und Rest als "bleiben offen".

## Fehlerbehandlung

| Fall | Reaktion |
|---|---|
| n8n nicht erreichbar (Connection refused) | Hinweis: "Docker Stack starten: `cd docker && docker compose up -d`" |
| HTTP 401 | Token in docker/.env stimmt nicht mit n8n-Env ueberein — `docker compose up -d n8n` zum Neuladen |
| HTTP 400 | Wird nur bei ungueltigem `review_status` ausgeloest; zeigt Fehlertext an |
| HTTP 500 / DB-Fehler | n8n Execution-Logs pruefen: `docker logs docker-n8n-1 --tail 50` |

## Datenschutz / No-Tracking-Prinzip

Es werden **keine** personenbezogenen Daten angezeigt oder verarbeitet. Das Feedback-Schema enthaelt nur:
- Anonyme Session-ID (nicht auf User rueckfuehrbar)
- Query-Preview (erste 200 Zeichen)
- Answer-Preview (erste 500 Zeichen)
- Rating, Kategorie, freiwilliger Kommentar

## Kontext

Gehoert zu P0 #3 der [Implementation Roadmap](../../vorderland-vault/docs/IMPLEMENTATION-ROADMAP.md). Ersetzt das zuvor geplante User-Audit-Log.
