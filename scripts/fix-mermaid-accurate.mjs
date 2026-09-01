import fs from 'fs';
import path from 'path';

const postsDir = path.resolve('src/content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

// 精准修复 Mermaid 图表
function sanitizeMermaidCode(rawMermaid) {
  const lines = rawMermaid.split('\n');
  const processedLines = lines.map(line => {
    let l = line.trim();
    if (!l || l.startsWith('graph') || l.startsWith('subgraph') || l.startsWith('end') || l.startsWith('%%') || l.startsWith('classDef') || l.startsWith('sequenceDiagram') || l.startsWith('classDiagram')) {
      return line;
    }

    // 先还原错误连接的双引号：例如 `UserDev["..."] --> PolicyEnforcer[..."]`
    // 匹配所有的 `Identifier[...]`
    // 正则：针对 `(\b[\w\d_\-]+)\[(.*?)\]` 或 `(\b[\w\d_\-]+)\((.*?)\)`
    // 注意：非贪婪匹配
    let replaced = line;

    // 1. 修复 Node[Text] 形式
    replaced = replaced.replace(/(\b[\w\d_\-]+)\[(.*?)\]/g, (match, id, text) => {
      // 去除可能误加在首尾的双引号
      let cleanText = text.replace(/^"|"$/g, '').trim();
      // 如果包含特殊字符，用双引号包裹
      if (cleanText.includes('(') || cleanText.includes(')') || cleanText.includes('[') || cleanText.includes(']') || cleanText.includes(':') || cleanText.includes(',') || cleanText.includes('\'') || cleanText.includes('->') || cleanText.includes('&')) {
        cleanText = `"${cleanText.replace(/"/g, "'")}"`;
      }
      return `${id}[${cleanText}]`;
    });

    // 2. 修复 Node(Text) 形式（避免圆角节点）
    replaced = replaced.replace(/(\b[\w\d_\-]+)\(([^)]*?)\)/g, (match, id, text) => {
      if (id === 'subgraph') return match;
      let cleanText = text.replace(/^"|"$/g, '').trim();
      if (cleanText.includes('(') || cleanText.includes(')') || cleanText.includes('[') || cleanText.includes(']') || cleanText.includes(':') || cleanText.includes(',') || cleanText.includes('\'') || cleanText.includes('&')) {
        cleanText = `"${cleanText.replace(/"/g, "'")}"`;
      }
      return `${id}(${cleanText})`;
    });

    return replaced;
  });

  return processedLines.join('\n');
}

let count = 0;
files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  content = content.replace(/```mermaid([\s\S]*?)```/g, (match, raw) => {
    const fixed = sanitizeMermaidCode(raw);
    if (fixed !== raw) {
      changed = true;
      return '```mermaid' + fixed + '```';
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    count++;
    console.log(`Accurately fixed Mermaid in: ${file}`);
  }
});

console.log(`Finished! Total fixed files: ${count}`);
