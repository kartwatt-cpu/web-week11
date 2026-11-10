/**
 * W11 辅助脚本：把 src/ 打印成树，配合「组件拆分」的截图证据。
 * 用法：node scripts/tree.mjs src
 */
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'src';

function walk(dir, prefix) {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  entries.forEach((entry, index) => {
    const last = index === entries.length - 1;
    const full = join(dir, entry.name);
    console.log(prefix + (last ? '└── ' : '├── ') + entry.name + (entry.isDirectory() ? '/' : ''));
    if (entry.isDirectory()) {
      walk(full, prefix + (last ? '    ' : '│   '));
    }
  });
}

console.log(relative(process.cwd(), root).replaceAll('\\', '/') + '/');
walk(root, '');
const files = [];
(function count(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) count(full);
    else files.push({ full, size: statSync(full).size });
  }
})(root);
console.log(`\n${files.length} 个文件，合计 ${files.reduce((sum, f) => sum + f.size, 0)} 字节`);
