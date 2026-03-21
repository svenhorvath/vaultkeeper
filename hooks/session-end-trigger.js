// Session-Ende Trigger: Erkennt Abschiedsphrasen und triggert den Workflow
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const msg = (data.user_message || data.message || '').trim().toLowerCase();

    const farewells = [
      /^(ok(a?e?y?)?[\s,]*)?b[yi]e?\s*[.!]?$/,
      /^tsch[aü][us]s?\s*[.!]?$/,
      /^baba\s*[.!]?$/,
      /^session\s*beenden\s*[.!]?$/,
      /^bis\s*(dann|bald|morgen|sp[aä]ter)\s*[.!]?$/,
      /^servus\s*[.!]?$/,
      /^pfi?at\s*di\s*[.!]?$/,
      /^ciao\s*[.!]?$/,
      /^gute\s*nacht\s*[.!]?$/,
      /^(ich\s*)?(mach|mache)\s*feierabend\s*[.!]?$/,
      /^feierabend\s*[.!]?$/,
      /^das\s*war'?s\s*[.!]?$/,
      /^ich\s*(bin|geh)\s*(dann\s*)?(mal\s*)?(weg|raus|off)\s*[.!]?$/,
      /^sch[oö]nen\s*(abend|feierabend)\s*[.!]?$/,
    ];

    if (farewells.some(r => r.test(msg))) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: [
            "WICHTIG: Der User verabschiedet sich. Fuehre jetzt die Session-Ende Routine aus:",
            "1. Git: Offene Aenderungen pruefen, committen, pushen",
            "2. project_registry.md aktualisieren falls noetig",
            "3. Brain-Capture: /vaultkeeper:brain-sync ausfuehren fuer wertvolle Erkenntnisse",
            "4. Vault-Check: Bei neuen Zetteln /vaultkeeper:vault-scan vorschlagen",
            "5. Kurze Zusammenfassung was erledigt wurde",
            "Fuehre diese Schritte AUTOMATISCH aus, nicht nur auflisten."
          ].join("\n")
        }
      }));
    }
  } catch (e) { /* still ignorieren */ }
});
