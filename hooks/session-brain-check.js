// Session-Start: Prueft ob das aktuelle Projekt einen Brain-Eintrag hat
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const claudeMd = path.join(cwd, 'CLAUDE.md');

try {
  if (fs.existsSync(claudeMd)) {
    const content = fs.readFileSync(claudeMd, 'utf8');
    if (!content.includes('Brain-Kontext')) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "SessionStart",
          additionalContext: "Hinweis: Dieses Projekt hat noch keinen Brain-Eintrag. Bei passender Gelegenheit /vaultkeeper:brain-init vorschlagen."
        }
      }));
    }
  }
} catch (e) { /* still ignorieren */ }
