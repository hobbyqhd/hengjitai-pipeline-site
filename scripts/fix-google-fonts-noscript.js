#!/usr/bin/env node
/**
 * 修复 optimize-google-fonts.js 旧 bug 留下的两类残留：
 *
 *  Case A：noscript 内被错误改写为 preload 但未闭合
 *    <noscript><link rel="preload" as="style" data-fonts-async="1" href="X" onload="...">
 *  → <noscript><link rel="stylesheet" href="X"></noscript>
 *
 *  Case B：紧随其后还跟着一个完整正确的 noscript + 一个孤立 </noscript>
 *    <noscript><link rel="stylesheet" href="X"></noscript></noscript>
 *  → 删除（与 Case A 修复后的行重复，且尾部多了一个 </noscript>）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];

function walkHtml(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walkHtml(full, results);
        else if (e.isFile() && e.name.endsWith('.html')) results.push(full);
    }
    return results;
}

const CASE_A = /<noscript>\s*<link\s+rel="preload"\s+as="style"\s+data-fonts-async="1"\s+href="([^"]+)"\s+onload="[^"]*"\s*\/?\s*>(?!\s*<\/noscript>)/gi;
// 紧跟另一个完整 noscript + 多余 </noscript>
const CASE_B = /<noscript>\s*<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?\s*><\/noscript>\s*<\/noscript>/gi;

let touchedFiles = 0;
let fixedA = 0;
let fixedB = 0;
const files = SCAN_DIRS.flatMap((d) => walkHtml(path.join(ROOT, d)));

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const before = html;

    // 先处理 Case A：把残缺的 preload 改回 stylesheet
    html = html.replace(CASE_A, (_m, href) => {
        fixedA++;
        return `<noscript><link rel="stylesheet" href="${href}"></noscript>`;
    });

    // 再处理 Case B：删除残留的 "<noscript>...</noscript></noscript>"
    html = html.replace(CASE_B, () => {
        fixedB++;
        return '';
    });

    // 清理可能多出的连续空行
    html = html.replace(/\n[ \t]*\n[ \t]*\n+/g, '\n\n');

    if (html !== before) {
        fs.writeFileSync(file, html, 'utf8');
        touchedFiles++;
    }
}

console.log(`扫描 ${files.length} 个 HTML，修复 Case A ${fixedA} 处、Case B ${fixedB} 处，写回 ${touchedFiles} 个文件。`);
