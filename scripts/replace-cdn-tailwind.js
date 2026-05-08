#!/usr/bin/env node
/**
 * 批量替换新闻详情页里的 cdn.tailwindcss.com 为本地预编译 CSS。
 * 同时为 Google Fonts <link> 加 display=swap（若缺失），缓解 LCP。
 *
 * 替换前：
 *   <script src="https://cdn.tailwindcss.com"></script>
 * 替换后：
 *   <link rel="stylesheet" href="<相对路径>/css/tailwind.min.css">
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const CDN_PATTERN = /<script\s+src=["']https:\/\/cdn\.tailwindcss\.com["']\s*><\/script>/g;

function relativeCssPath(htmlAbsPath) {
    // 计算 html 相对于 ROOT/css/tailwind.min.css 的相对路径
    const htmlDir = path.dirname(htmlAbsPath);
    const cssAbs = path.join(ROOT, 'css', 'tailwind.min.css');
    return path.relative(htmlDir, cssAbs).split(path.sep).join('/');
}

function walk(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, results);
        else if (entry.isFile() && entry.name.endsWith('.html')) results.push(full);
    }
    return results;
}

let touched = 0;
let scanned = 0;

for (const lang of LANGS) {
    const newsDir = path.join(ROOT, lang, 'news', 'published');
    const files = walk(newsDir);
    for (const file of files) {
        scanned++;
        const original = fs.readFileSync(file, 'utf8');
        if (!CDN_PATTERN.test(original)) continue;
        // 重置 lastIndex（带 g 标志的 RegExp.test 会推进 lastIndex）
        CDN_PATTERN.lastIndex = 0;

        const cssRel = relativeCssPath(file);
        let updated = original.replace(
            CDN_PATTERN,
            `<link rel="stylesheet" href="${cssRel}">`
        );

        // 为 Google Fonts 链接补 display=swap（若缺失），减少 FOIT
        updated = updated.replace(
            /<link\s+href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]*?)"\s+rel="stylesheet"\s*>/g,
            (match, href) => {
                if (/display=swap/.test(href)) return match;
                const sep = href.includes('?') ? '&' : '?';
                return `<link href="${href}${sep}display=swap" rel="stylesheet">`;
            }
        );

        fs.writeFileSync(file, updated, 'utf8');
        touched++;
    }
}

console.log(`已扫描 ${scanned} 个新闻 HTML，替换 ${touched} 个文件中的 CDN Tailwind 引用。`);
console.log('提醒：随后运行 `npm run build:tailwind` 让本地 tailwind.min.css 包含新闻页用到的所有工具类。');
