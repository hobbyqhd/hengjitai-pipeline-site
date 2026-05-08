#!/usr/bin/env node
/**
 * 把所有页面里的 Google Fonts <link rel="stylesheet"> 改为非阻塞加载（C3）。
 *
 * 替换前：
 *   <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
 *
 * 替换后（async + noscript fallback）：
 *   <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=..." onload="this.onload=null;this.rel='stylesheet'">
 *   <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=..."></noscript>
 *
 * 关键：跳过 <noscript>...</noscript> 内部的 link，避免反复劫持已生成的 fallback。
 * 幂等：用 data-fonts-async 标记已优化的 link。
 *
 * SEO 收益：消除字体 CSS 对首屏渲染的阻塞，改善 LCP/FCP。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const ALREADY_OPTIMIZED_MARK = 'data-fonts-async="1"';

function walkHtml(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walkHtml(full, results);
        else if (e.isFile() && e.name.endsWith('.html')) results.push(full);
    }
    return results;
}

const LINK_TAG_RE = /<link\b[^>]*?\/?>/gi;
const NOSCRIPT_OPEN = /<noscript\b/gi;
const NOSCRIPT_CLOSE = /<\/noscript\s*>/gi;
const HREF_FONTS_RE = /href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]*)"/i;

function isInsideNoscript(text, position) {
    let depth = 0;
    NOSCRIPT_OPEN.lastIndex = 0;
    let m;
    while ((m = NOSCRIPT_OPEN.exec(text)) && m.index < position) depth++;
    NOSCRIPT_CLOSE.lastIndex = 0;
    while ((m = NOSCRIPT_CLOSE.exec(text)) && m.index < position) depth--;
    return depth > 0;
}

function processFile(file) {
    const original = fs.readFileSync(file, 'utf8');
    let touched = 0;
    let updated = '';
    let cursor = 0;

    LINK_TAG_RE.lastIndex = 0;
    let match;
    while ((match = LINK_TAG_RE.exec(original)) !== null) {
        const tag = match[0];
        const start = match.index;

        const isFonts = HREF_FONTS_RE.test(tag);
        const isStylesheet = /\brel\s*=\s*"stylesheet"/i.test(tag);
        const isAlready = tag.includes(ALREADY_OPTIMIZED_MARK) || /\brel\s*=\s*"preload"/i.test(tag);

        if (isFonts && isStylesheet && !isAlready && !isInsideNoscript(original, start)) {
            const href = tag.match(HREF_FONTS_RE)[1];
            const replacement = [
                `<link rel="preload" as="style" ${ALREADY_OPTIMIZED_MARK} href="${href}" onload="this.onload=null;this.rel='stylesheet'">`,
                `<noscript><link rel="stylesheet" href="${href}"></noscript>`
            ].join('\n    ');
            updated += original.slice(cursor, start) + replacement;
            cursor = start + tag.length;
            touched++;
        }
    }
    updated += original.slice(cursor);

    if (touched > 0) {
        fs.writeFileSync(file, updated, 'utf8');
    }
    return touched;
}

let touchedFiles = 0;
let touchedLinks = 0;
const files = SCAN_DIRS.flatMap((d) => walkHtml(path.join(ROOT, d)));

for (const file of files) {
    const n = processFile(file);
    if (n > 0) {
        touchedFiles++;
        touchedLinks += n;
    }
}

console.log(`扫描 ${files.length} 个 HTML，优化 ${touchedLinks} 个 Google Fonts <link>，写回 ${touchedFiles} 个文件。`);
