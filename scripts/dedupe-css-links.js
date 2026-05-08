#!/usr/bin/env node
/**
 * 移除核心页面里重复的 all.min.css 引用（C6）。
 * combined.min.css 已通过 @import 包含 all.min.css（FontAwesome ~100KB），
 * 当页面同时引用两者时浪费 ~100KB 重复下载。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const CORE = ['index', 'about', 'cases', 'contact', 'products', 'quality', 'news'];

const ALL_LINK_RE = /\s*<link\s+rel=["']stylesheet["']\s+href=["'][^"']*all\.min\.css["']\s*\/?>\s*\n?/i;
const COMBINED_RE = /href=["'][^"']*combined\.min\.css["']/i;

let touched = 0;
let scanned = 0;
for (const lang of LANGS) {
    for (const page of CORE) {
        const file = path.join(ROOT, lang, `${page}.html`);
        if (!fs.existsSync(file)) continue;
        scanned++;
        const html = fs.readFileSync(file, 'utf8');
        if (!COMBINED_RE.test(html) || !ALL_LINK_RE.test(html)) continue;
        const updated = html.replace(ALL_LINK_RE, '\n    ');
        if (updated !== html) {
            fs.writeFileSync(file, updated, 'utf8');
            touched++;
        }
    }
}
console.log(`扫描 ${scanned} 个核心页，移除 ${touched} 个页面的重复 all.min.css 引用。`);
