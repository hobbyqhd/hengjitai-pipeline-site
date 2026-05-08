#!/usr/bin/env node
/**
 * 清理本次批量 HTML/脚本改动产生的行尾空格。
 * 只处理 Git 中已修改/新增/删除列表里仍存在的文本文件，避免碰 node_modules。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TEXT_EXTENSIONS = new Set([
    '.html', '.js', '.json', '.xml', '.css', '.yml', '.yaml', '.md', '.txt'
]);

const files = execSync('git diff --name-only --diff-filter=ACMR', {
    cwd: ROOT,
    encoding: 'utf8'
})
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !file.startsWith('node_modules/'))
    .filter((file) => TEXT_EXTENSIONS.has(path.extname(file)));

let changed = 0;
for (const file of files) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    const original = fs.readFileSync(abs, 'utf8');
    const updated = original
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/g, ''))
        .join('\n');
    if (updated !== original) {
        fs.writeFileSync(abs, updated, 'utf8');
        changed++;
    }
}

console.log(`清理 ${changed}/${files.length} 个文本文件的行尾空格。`);
