import fs from 'fs';
import path from 'path';

const postsDir = path.resolve('src/content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  content = content.replace(/```mermaid([\s\S]*?)```/g, (match, mermaidCode) => {
    const lines = mermaidCode.split('\n');
    const newLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('graph') || trimmed.startsWith('subgraph') || trimmed.startsWith('end') || trimmed.startsWith('%%') || trimmed.startsWith('classDef')) {
        return line;
      }

      // 匹配 NodeID[Content] 结构
      const bracketMatch = line.match(/^(\s*[\w\d_\-]+)\[(.*)\](\s*)$/);
      if (bracketMatch) {
        const prefix = bracketMatch[1];
        let innerText = bracketMatch[2];
        const suffix = bracketMatch[3];
        if ((innerText.includes('[') || innerText.includes(']') || innerText.includes('(') || innerText.includes(')') || innerText.includes(':')) && !innerText.startsWith('"')) {
          innerText = `"${innerText.replace(/"/g, "'")}"`;
          changed = true;
          return `${prefix}[${innerText}]${suffix}`;
        }
      }

      // 匹配 NodeID(Content) 结构
      const parenMatch = line.match(/^(\s*[\w\d_\-]+)\((.*)\)(\s*)$/);
      if (parenMatch) {
        const prefix = parenMatch[1];
        let innerText = parenMatch[2];
        const suffix = parenMatch[3];
        if ((innerText.includes('[') || innerText.includes(']') || innerText.includes('(') || innerText.includes(')') || innerText.includes(':')) && !innerText.startsWith('"')) {
          innerText = `"${innerText.replace(/"/g, "'")}"`;
          changed = true;
          return `${prefix}(${innerText})${suffix}`;
        }
      }

      return line;
    });

    return '```mermaid' + newLines.join('\n') + '```';
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
    console.log(`Fixed Mermaid syntax in: ${file}`);
  }
});

console.log(`Total fixed files: ${fixedCount}`);
