#!/usr/bin/env node
/**
 * 把 scripts/config.js 中升级后的 title/description/keywords
 * 同步到已生成的 70 个核心 HTML 页面（B1+B2）。
 *
 * 同步以下字段：
 *   - <title>
 *   - <meta name="description">
 *   - <meta name="keywords">
 *   - <meta property="og:title">
 *   - <meta property="og:description">
 *   - <meta name="twitter:title">
 *   - <meta name="twitter:description">
 *
 * 幂等：直接覆盖。重复运行结果一致。
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const PAGES = ['index', 'about', 'cases', 'contact', 'products', 'quality', 'news'];

function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function setMeta(html, attrSelector, attrValue, contentField, value) {
    const safe = escapeAttr(value);
    const re = new RegExp(
        `<meta\\s+${attrSelector}=["']${attrValue}["']\\s+${contentField}=["'][^"']*["']\\s*/?\\s*>`,
        'i'
    );
    const replacement = `<meta ${attrSelector}="${attrValue}" ${contentField}="${safe}">`;
    if (re.test(html)) return html.replace(re, () => replacement);
    // 兜底：在 </head> 前插入
    return html.replace('</head>', () => `    ${replacement}\n</head>`);
}

function setMetaContentFirst(html, attrSelector, attrValue, value) {
    const safe = escapeAttr(value);
    const re = new RegExp(
        `<meta\\s+${attrSelector}=["']${attrValue}["']\\s+content=["'][^"']*["']\\s*/?\\s*>`,
        'i'
    );
    const replacement = `<meta ${attrSelector}="${attrValue}" content="${safe}">`;
    if (re.test(html)) return html.replace(re, () => replacement);
    // content-first form，其他写法兼容
    const reAlt = new RegExp(
        `<meta\\s+content=["'][^"']*["']\\s+${attrSelector}=["']${attrValue}["']\\s*/?\\s*>`,
        'i'
    );
    if (reAlt.test(html)) return html.replace(reAlt, () => replacement);
    return html.replace('</head>', () => `    ${replacement}\n</head>`);
}

function setTitle(html, value) {
    const safe = String(value);
    if (/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) {
        return html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, () => `<title>${safe}</title>`);
    }
    return html.replace('</head>', () => `    <title>${safe}</title>\n</head>`);
}

function applyOne(file, lang, pageType) {
    const seo = config.seo?.pages?.[lang]?.[pageType];
    if (!seo) return false;
    let html = fs.readFileSync(file, 'utf8');
    const original = html;

    html = setTitle(html, seo.title);
    html = setMetaContentFirst(html, 'name', 'description', seo.description);
    html = setMetaContentFirst(html, 'name', 'keywords', seo.keywords);
    html = setMetaContentFirst(html, 'property', 'og:title', seo.title);
    html = setMetaContentFirst(html, 'property', 'og:description', seo.description);
    html = setMetaContentFirst(html, 'name', 'twitter:title', seo.title);
    html = setMetaContentFirst(html, 'name', 'twitter:description', seo.description);

    if (html !== original) {
        fs.writeFileSync(file, html, 'utf8');
        return true;
    }
    return false;
}

let touched = 0;
let total = 0;
for (const lang of LANGS) {
    for (const page of PAGES) {
        const file = path.join(ROOT, lang, `${page}.html`);
        if (!fs.existsSync(file)) continue;
        total++;
        if (applyOne(file, lang, page)) touched++;
    }
}

console.log(`已扫描 ${total} 个核心页面，更新 ${touched} 个的 SEO 文案。`);
