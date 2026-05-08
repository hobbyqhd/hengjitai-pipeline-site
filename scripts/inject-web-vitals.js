#!/usr/bin/env node
/**
 * 把 web-vitals 上报脚本注入到所有核心页面（G3）。
 * 幂等：已注入的页面跳过。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const CORE = ['index', 'about', 'cases', 'contact', 'products', 'quality', 'news'];

const MARKER = 'web-vitals-reporter.js';
const SCRIPT_TAG = '<script defer src="../js/web-vitals-reporter.js"></script>';

let touched = 0;
let scanned = 0;
for (const lang of LANGS) {
    for (const page of CORE) {
        const file = path.join(ROOT, lang, `${page}.html`);
        if (!fs.existsSync(file)) continue;
        scanned++;
        const html = fs.readFileSync(file, 'utf8');
        if (html.includes(MARKER)) continue;
        if (!html.includes('</body>')) continue;
        const updated = html.replace('</body>', () => `    ${SCRIPT_TAG}\n</body>`);
        fs.writeFileSync(file, updated, 'utf8');
        touched++;
    }
}
console.log(`扫描 ${scanned} 个核心页面，注入 ${touched} 个 web-vitals reporter。`);
