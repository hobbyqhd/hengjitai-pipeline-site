#!/usr/bin/env node

/**
 * SEO 健康检查脚本（cheerio DOM 解析版，B4）
 *
 * 改进点 vs. 旧 regex 版：
 *   - 不再受属性顺序、单双引号、换行影响。
 *   - 按语言适配 title/description 长度阈值（CJK 字符宽度更高）。
 *   - 校验 hreflang 链接、canonical、OG/Twitter、JSON-LD 结构化数据有效性。
 *   - 校验 image alt 文本是否为空。
 *   - 输出结构与旧版兼容（seo-audit-report.json），并新增 audit-history/ 归档（G4）。
 */

const fs = require('fs');
const path = require('path');

let cheerio;
try {
    cheerio = require('cheerio');
} catch (e) {
    console.error('未找到 cheerio，请运行：npm install cheerio --save-dev');
    process.exit(1);
}

const ROOT = process.cwd();
const LANGS = ['cn', 'en', 'jp', 'de', 'es', 'fr', 'pt', 'ru', 'ar', 'hi'];
const PAGES = ['index.html', 'products.html', 'about.html', 'cases.html', 'quality.html', 'news.html', 'contact.html'];

// CJK / RTL 字符在 SERP 中显示宽度大致 1.5-2x 拉丁字符
const LANG_LIMITS = {
    cjk:    { titleMin: 12, titleMax: 35, descMin: 60,  descMax: 110 }, // cn/jp
    rtl:    { titleMin: 25, titleMax: 65, descMin: 100, descMax: 180 }, // ar
    devnag: { titleMin: 25, titleMax: 65, descMin: 100, descMax: 200 }, // hi
    cyril:  { titleMin: 30, titleMax: 75, descMin: 110, descMax: 200 }, // ru
    latin:  { titleMin: 30, titleMax: 70, descMin: 100, descMax: 180 }  // en/de/es/fr/pt
};

function langClass(lang) {
    if (lang === 'cn' || lang === 'jp') return LANG_LIMITS.cjk;
    if (lang === 'ar') return LANG_LIMITS.rtl;
    if (lang === 'hi') return LANG_LIMITS.devnag;
    if (lang === 'ru') return LANG_LIMITS.cyril;
    return LANG_LIMITS.latin;
}

function checkPage(filePath, lang) {
    if (!fs.existsSync(filePath)) return { exists: false };

    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    const limits = langClass(lang);

    const issues = [];
    const warnings = [];

    // 标题
    const title = $('title').first().text().trim();
    if (!title) issues.push('缺少 <title>');
    else {
        if (title.length > limits.titleMax) warnings.push(`标题过长 (${title.length} 字符，建议 ≤${limits.titleMax})`);
        else if (title.length < limits.titleMin) warnings.push(`标题过短 (${title.length} 字符，建议 ≥${limits.titleMin})`);
    }

    // description
    const desc = $('meta[name="description"]').attr('content')?.trim() || '';
    if (!desc) issues.push('缺少 <meta name="description">');
    else {
        if (desc.length > limits.descMax) warnings.push(`描述过长 (${desc.length} 字符，建议 ≤${limits.descMax})`);
        else if (desc.length < limits.descMin) warnings.push(`描述过短 (${desc.length} 字符，建议 ≥${limits.descMin})`);
    }

    // keywords
    if (!$('meta[name="keywords"]').attr('content')) warnings.push('缺少 keywords');

    // canonical
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) issues.push('缺少 canonical');

    // OpenGraph + Twitter
    if (!$('meta[property="og:title"]').attr('content')) issues.push('缺少 og:title');
    if (!$('meta[property="og:description"]').attr('content')) issues.push('缺少 og:description');
    if (!$('meta[property="og:image"]').attr('content')) warnings.push('缺少 og:image');
    if (!$('meta[name="twitter:title"]').attr('content')) warnings.push('缺少 twitter:title');

    // og:locale
    if (!$('meta[property="og:locale"]').attr('content')) warnings.push('缺少 og:locale');

    // hreflang（应至少包含 x-default 和当前语言）
    const hreflangs = $('link[rel="alternate"][hreflang]');
    if (hreflangs.length < 2) warnings.push(`hreflang 数量过少 (${hreflangs.length} 个)`);
    if (!$('link[rel="alternate"][hreflang="x-default"]').length) warnings.push('hreflang 缺少 x-default');

    // H1
    const h1Count = $('h1').length;
    if (h1Count === 0) issues.push('缺少 H1');
    else if (h1Count > 1) warnings.push(`多个 H1 (${h1Count} 个)`);

    // 图片 alt
    const imgs = $('img');
    let withoutAlt = 0;
    let emptyAlt = 0;
    imgs.each((_, el) => {
        const alt = $(el).attr('alt');
        if (alt === undefined) withoutAlt++;
        else if (!alt.trim()) emptyAlt++;
    });
    if (withoutAlt > 0) warnings.push(`${withoutAlt} 个 <img> 缺少 alt`);
    if (emptyAlt > 0) warnings.push(`${emptyAlt} 个 <img> alt 为空`);

    // 内部链接
    const internalLinks = $('a[href$=".html"], a[href*="/"]').filter((_, el) => {
        const href = $(el).attr('href') || '';
        return !href.startsWith('http') || href.includes('hengjitaipipeline.com');
    }).length;
    if (internalLinks < 3) warnings.push('内部链接较少');

    // JSON-LD
    const ldNodes = $('script[type="application/ld+json"]');
    if (ldNodes.length === 0) issues.push('缺少 JSON-LD 结构化数据');
    else {
        let validJsonLd = false;
        ldNodes.each((_, el) => {
            try {
                JSON.parse($(el).html());
                validJsonLd = true;
            } catch (_) {/* 单个无效继续 */}
        });
        if (!validJsonLd) issues.push('JSON-LD 全部无效（无法 JSON.parse）');
    }

    return {
        exists: true,
        issues,
        warnings,
        stats: {
            title,
            titleLength: title.length,
            description: desc,
            descriptionLength: desc.length,
            h1Count,
            imageCount: imgs.length,
            imagesWithoutAlt: withoutAlt,
            imagesEmptyAlt: emptyAlt,
            internalLinks,
            hreflangCount: hreflangs.length,
            jsonLdBlocks: ldNodes.length
        }
    };
}

function runAudit() {
    console.log('开始 SEO 健康检查（cheerio）...\n');

    const report = {
        generatedAt: new Date().toISOString(),
        totalPages: 0,
        pagesWithIssues: 0,
        pagesWithWarnings: 0,
        details: {}
    };

    for (const lang of LANGS) {
        console.log(`[${lang.toUpperCase()}]`);
        const langDir = path.join(ROOT, lang);
        if (!fs.existsSync(langDir)) {
            console.log(`  目录不存在: ${langDir}`);
            continue;
        }
        for (const page of PAGES) {
            const filePath = path.join(langDir, page);
            const r = checkPage(filePath, lang);
            if (!r.exists) { console.log(`  -- ${page}: 文件不存在`); continue; }
            report.totalPages++;
            if (r.issues.length) report.pagesWithIssues++;
            if (r.warnings.length) report.pagesWithWarnings++;
            const sym = r.issues.length ? 'X' : (r.warnings.length ? '!' : 'OK');
            console.log(`  [${sym}] ${page}`);
            r.issues.forEach((i) => console.log(`     issue: ${i}`));
            r.warnings.forEach((w) => console.log(`     warn:  ${w}`));
            report.details[`${lang}/${page}`] = r;
        }
        console.log('');
    }

    console.log('总结:');
    console.log(`  总页面数:     ${report.totalPages}`);
    console.log(`  有问题页面:   ${report.pagesWithIssues}`);
    console.log(`  有警告页面:   ${report.pagesWithWarnings}`);
    console.log(`  完全健康:     ${report.totalPages - report.pagesWithIssues - report.pagesWithWarnings}`);

    const reportPath = path.join(ROOT, 'seo-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n报告: ${reportPath}`);

    // G4：归档历史
    const histDir = path.join(ROOT, 'doc', 'audit-history');
    if (!fs.existsSync(histDir)) fs.mkdirSync(histDir, { recursive: true });
    const stamp = report.generatedAt.replace(/[:T]/g, '-').slice(0, 16);
    const histFile = path.join(histDir, `seo-audit-${stamp}.json`);
    fs.writeFileSync(histFile, JSON.stringify({
        generatedAt: report.generatedAt,
        totalPages: report.totalPages,
        pagesWithIssues: report.pagesWithIssues,
        pagesWithWarnings: report.pagesWithWarnings,
        // 仅保留聚合统计避免历史文件膨胀
        summaryByLang: Object.fromEntries(LANGS.map((l) => {
            const ks = Object.keys(report.details).filter((k) => k.startsWith(`${l}/`));
            return [l, {
                pages: ks.length,
                issues: ks.reduce((acc, k) => acc + (report.details[k].issues?.length || 0), 0),
                warnings: ks.reduce((acc, k) => acc + (report.details[k].warnings?.length || 0), 0)
            }];
        }))
    }, null, 2));
    console.log(`历史归档: ${histFile}`);

    return report;
}

function checkPerformance() {
    console.log('\n性能检查...');
    const checks = [];
    const cssDir = path.join(ROOT, 'css');
    if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));
        cssFiles.forEach((file) => {
            const sizeKB = Math.round(fs.statSync(path.join(cssDir, file)).size / 1024);
            checks.push(`${sizeKB > 100 ? '!' : 'OK'} CSS ${file} (${sizeKB}KB)`);
        });
    }
    try {
        const { scanImages } = require('./image-seo-check.js');
        const r = scanImages();
        if (r.largeFiles.length) checks.push(`! ${r.largeFiles.length} 张大图 (>500KB) 可优化`);
        else checks.push(`OK 图片体积合规`);
    } catch (_) {/* 无 image-seo-check 也不阻塞 */}
    checks.forEach((c) => console.log(`  ${c}`));
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--performance')) checkPerformance();
    else { runAudit(); if (args.includes('--all')) checkPerformance(); }
}

module.exports = { runAudit, checkPage, checkPerformance };
