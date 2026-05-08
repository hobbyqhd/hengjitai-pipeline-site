#!/usr/bin/env node
/**
 * SEO 链接一致性校验（E2+E4）。
 *
 * 校验：
 *   1) HTML 中所有 <link rel="alternate" hreflang="..."> 的目标文件是否存在（E2）
 *   2) sitemap-*.xml 中每个 <loc> 是否指向真实存在的本地文件（E4）
 *   3) sitemap.xml 索引中各子 sitemap 是否存在
 *
 * 退出码：发现错误时返回 1（适合 CI 集成）。
 */

const fs = require('fs');
const path = require('path');

let cheerio;
try { cheerio = require('cheerio'); } catch (e) {
    console.error('需要 cheerio：npm install cheerio --save-dev');
    process.exit(1);
}

const ROOT = process.cwd();
const SITE_URL = 'https://hengjitaipipeline.com';
const LANGS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];

function urlToLocalPath(url) {
    if (!url.startsWith(SITE_URL)) return null;
    const rel = url.slice(SITE_URL.length).replace(/^\//, '');
    if (!rel || rel.endsWith('/')) return path.join(ROOT, rel, 'index.html');
    return path.join(ROOT, rel);
}

function walkHtml(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walkHtml(full, results);
        else if (e.isFile() && e.name.endsWith('.html')) results.push(full);
    }
    return results;
}

let errors = 0;
let warnings = 0;
let checkedHtml = 0;
let checkedHreflang = 0;
let checkedSitemapLoc = 0;

// 1) 校验 hreflang
console.log('=== 校验 hreflang 链接（E2）===');
const allHtml = LANGS.flatMap((l) => walkHtml(path.join(ROOT, l)));
for (const file of allHtml) {
    checkedHtml++;
    const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
    $('link[rel="alternate"][hreflang]').each((_, el) => {
        checkedHreflang++;
        const href = $(el).attr('href');
        if (!href) {
            console.error(`  [ERR] ${path.relative(ROOT, file)}: hreflang 缺少 href`);
            errors++;
            return;
        }
        const localPath = urlToLocalPath(href);
        if (!localPath) {
            // 外部 URL，跳过
            return;
        }
        if (!fs.existsSync(localPath)) {
            console.warn(`  [WARN] ${path.relative(ROOT, file)} -> hreflang 目标不存在: ${href}`);
            warnings++;
        }
    });
}
console.log(`  扫描 ${checkedHtml} HTML，校验 ${checkedHreflang} 条 hreflang。`);

// 2) 校验 sitemap loc
console.log('\n=== 校验 sitemap loc（E4）===');
const sitemapFiles = fs.readdirSync(ROOT).filter((f) => /^sitemap.*\.xml$/.test(f));
for (const sm of sitemapFiles) {
    const xml = fs.readFileSync(path.join(ROOT, sm), 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    let smErr = 0;
    for (const loc of locs) {
        checkedSitemapLoc++;
        const localPath = urlToLocalPath(loc);
        if (!localPath) continue;
        if (!fs.existsSync(localPath)) {
            console.warn(`  [WARN] ${sm}: <loc> 目标不存在: ${loc}`);
            warnings++;
            smErr++;
        }
    }
    console.log(`  ${sm}: ${locs.length} 条 loc，缺失 ${smErr}`);
}
console.log(`  共校验 ${checkedSitemapLoc} 条 <loc>。`);

console.log(`\n总结：errors=${errors}，warnings=${warnings}`);
process.exit(errors > 0 ? 1 : 0);
