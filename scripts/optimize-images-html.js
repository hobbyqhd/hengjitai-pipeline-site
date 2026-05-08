#!/usr/bin/env node
/**
 * 全站 <img> 优化（C5）：
 *   1. 第 1 张 <img>（通常是 logo/hero）→ loading="eager" fetchpriority="high"
 *   2. 其余 <img>                       → loading="lazy" decoding="async"
 *   3. 缺失/空 alt → 用文件名（去后缀，连字符转空格）兜底
 *
 * 用 regex 逐个 img 标签处理，不重新序列化整页 HTML（避免格式漂移）。
 * 已存在的属性不覆盖（幂等）。
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

function getAttr(tag, name) {
    const re = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
    const m = tag.match(re);
    if (!m) return undefined;
    return (m[1] !== undefined ? m[1] : m[2]);
}

function setAttrIfMissing(tag, name, value) {
    if (getAttr(tag, name) !== undefined) return tag;
    // 在 <img 后插入新属性
    return tag.replace(/^<img\b/i, `<img ${name}="${value}"`);
}

function deriveAlt(src) {
    if (!src) return 'image';
    const base = path.basename(src).replace(/\?.*$/, '').replace(/\.[^/.]+$/, '');
    const cleaned = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned || 'image';
}

function setAlt(tag) {
    const existing = getAttr(tag, 'alt');
    if (existing !== undefined && existing.trim()) return { tag, changed: false };
    const src = getAttr(tag, 'src') || '';
    const alt = deriveAlt(src);
    if (existing === undefined) {
        return { tag: tag.replace(/^<img\b/i, `<img alt="${alt}"`), changed: true };
    }
    // alt 存在但为空：替换其值
    const re = /(\salt\s*=\s*)(?:"[^"]*"|'[^']*')/i;
    return { tag: tag.replace(re, `$1"${alt}"`), changed: true };
}

const IMG_TAG_RE = /<img\b[^>]*?\/?>/gi;

let totalImgs = 0;
let touchedImgs = 0;
let touchedFiles = 0;
const files = SCAN_DIRS.flatMap((d) => walkHtml(path.join(ROOT, d)));

for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let imgIndexInFile = 0;
    let fileChanged = false;

    const updated = original.replace(IMG_TAG_RE, (rawTag) => {
        totalImgs++;
        const idx = imgIndexInFile++;
        let tag = rawTag;
        let imgChanged = false;

        const altRes = setAlt(tag);
        if (altRes.changed) { tag = altRes.tag; imgChanged = true; }

        if (idx === 0) {
            const before1 = tag;
            tag = setAttrIfMissing(tag, 'loading', 'eager');
            tag = setAttrIfMissing(tag, 'fetchpriority', 'high');
            if (tag !== before1) imgChanged = true;
        } else {
            const before2 = tag;
            tag = setAttrIfMissing(tag, 'loading', 'lazy');
            tag = setAttrIfMissing(tag, 'decoding', 'async');
            if (tag !== before2) imgChanged = true;
        }

        if (imgChanged) { touchedImgs++; fileChanged = true; }
        return tag;
    });

    if (fileChanged) {
        fs.writeFileSync(file, updated, 'utf8');
        touchedFiles++;
    }
}

console.log(`扫描 ${files.length} 个 HTML，发现 ${totalImgs} 个 <img>，更新 ${touchedImgs} 个，写回 ${touchedFiles} 个文件。`);
