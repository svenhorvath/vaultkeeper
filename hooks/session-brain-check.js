// Session-Start: Prueft Brain-Eintrag + injiziert Brain Map als Routing Table
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const claudeMd = path.join(cwd, 'CLAUDE.md');
const homedir = process.env.HOME || process.env.USERPROFILE || '';
const localMd = path.join(homedir, '.claude', 'vaultkeeper.local.md');

function getBrainPath() {
  try {
    const content = fs.readFileSync(localMd, 'utf8');
    const match = content.match(/^brain_path:\s*"([^"]+)"/m);
    if (match) return match[1];
  } catch (e) { /* ignore */ }
  // Fallback per Plattform
  if (process.platform === 'win32') {
    return 'C:\\Users\\horvaths\\OneDrive - Region Vorderland-Feldkirch\\SvenBrain';
  }
  return '/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain';
}

const contextParts = [];

// 1. CLAUDE.md Brain-Kontext Check (bestehendes Verhalten)
try {
  if (fs.existsSync(claudeMd)) {
    const content = fs.readFileSync(claudeMd, 'utf8');
    if (!content.includes('Brain-Kontext')) {
      contextParts.push('Hinweis: Dieses Projekt hat noch keinen Brain-Eintrag. Bei passender Gelegenheit /vaultkeeper:brain-init vorschlagen.');
    }
  }
} catch (e) { /* ignore */ }

// 2. BRAIN_MAP.md Injection
try {
  const brainPath = getBrainPath();
  const mapFile = path.join(brainPath, 'BRAIN_MAP.md');

  if (fs.existsSync(mapFile)) {
    let mapContent = fs.readFileSync(mapFile, 'utf8');

    // Staleness Check: updated-Feld parsen
    const updatedMatch = mapContent.match(/^updated:\s*(\d{4}-\d{2}-\d{2})/m);
    if (updatedMatch) {
      const updated = new Date(updatedMatch[1]);
      const now = new Date();
      const diffDays = Math.floor((now - updated) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        contextParts.push('WARNUNG: Brain Map ist ' + diffDays + ' Tage alt. /vaultkeeper:brain-sync ausfuehren um sie zu aktualisieren.');
      }
    }

    // Frontmatter + HTML-Kommentar entfernen fuer kompaktere Injection
    mapContent = mapContent.replace(/<!--[\s\S]*?-->\n?/g, '');
    mapContent = mapContent.replace(/^---[\s\S]*?---\n?/, '');
    mapContent = mapContent.trim();

    // Truncation bei >2000 Zeichen
    if (mapContent.length > 2000) {
      mapContent = mapContent.substring(0, 1997) + '...';
    }

    contextParts.push('=== BRAIN MAP (SvenBrain Topologie) ===\n' + mapContent);
  } else {
    contextParts.push('Tipp: Noch keine Brain Map vorhanden. /vaultkeeper:brain-sync generiert sie automatisch.');
  }
} catch (e) { /* ignore — Brain nicht erreichbar */ }

// Output nur wenn es etwas zu sagen gibt
if (contextParts.length > 0) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: contextParts.join('\n\n')
    }
  }));
}
