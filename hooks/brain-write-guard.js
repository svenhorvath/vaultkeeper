// PreToolUse Guard: Blockiert direkte Writes ins SvenBrain
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = (data.tool_input && (data.tool_input.file_path || data.tool_input.filePath)) || '';

    const brainPaths = [
      '/Users/svenhorvath/Library/CloudStorage/OneDrive-RegionVorderland-Feldkirch/SvenBrain',
      'C:\\Users\\horvaths\\OneDrive - Region Vorderland-Feldkirch\\SvenBrain'
    ];

    const isBrainPath = brainPaths.some(bp => filePath.startsWith(bp));

    if (isBrainPath) {
      console.log(JSON.stringify({
        decision: "block",
        reason: "Direktes Schreiben ins SvenBrain ist nicht erlaubt. Bitte das Obsidian CLI oder /vaultkeeper:brain-sync verwenden."
      }));
    }
  } catch (e) { /* still ignorieren */ }
});
