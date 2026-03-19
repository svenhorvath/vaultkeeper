---
name: session-brain-capture
description: Erinnert am Session-Ende an Brain-Capture und Vault-Scan wenn neue Erkenntnisse entstanden sind
event: Stop
matcher: "*"
type: prompt
---

Bevor du die Session beendest, pruefe kurz:

1. **Brain-Capture:** Sind in dieser Session Erkenntnisse, Entscheidungen oder Patterns entstanden, die als Zettelkasten-Notiz im SvenBrain wertvoll waeren? Falls ja, erstelle sie unter `05-Zettelkasten/` mit Standard-Frontmatter (type: zettel, tags, created, updated, source) und mindestens 2 Backlinks zu existierenden Notizen.

2. **Vault-Check:** Falls neue Zettel erstellt wurden — waere davon etwas fuer das Vorderland Vault relevant? (Faustregel: Wuerde ein Kollege das fragen, oder wuerde Sven das in 3 Jahren nachschlagen?) Falls ja, weise kurz darauf hin dass `/vaultkeeper:vault-scan` sinnvoll waere.

Wenn nichts Neues entstanden ist, ueberspringe diesen Schritt kommentarlos.

Antworte mit "approve" — diese Pruefung soll immer stattfinden.
