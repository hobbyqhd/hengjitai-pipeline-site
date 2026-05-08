#!/usr/bin/env node
/**
 * 一次性 SEO 增强注入脚本（覆盖 A3+D1+D2+D4+E1+E3）：
 *
 * 1) 核心页（index/about/cases/contact/products/quality/news.html）：
 *    - 把现有简易 Organization JSON-LD 升级为 LocalBusiness/Manufacturer + BreadcrumbList。
 *    - 注入 og:locale + og:locale:alternate（10 语言）。
 *
 * 2) 新闻详情页（[lang]/news/published/category*​/*.html）：
 *    - 注入 canonical + hreflang + OpenGraph + Twitter + NewsArticle JSON-LD。
 *    - 注入 og:locale。
 *
 * 重复运行幂等：
 *    使用 <!-- seo:enhanced --> 锚点判断，已注入的页面跳过 og:locale；
 *    JSON-LD 升级以"是否已含 LocalBusiness"判断。
 */

const fs = require('fs');
const path = require('path');
const {
    siteConfig,
    generateLocalBusinessSchema,
    generateBreadcrumbSchema,
    generateNewsArticleSchema,
    getOgLocale,
    getOgLocaleAlternates
} = require('./shared/metadata');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const CORE_PAGES = ['index', 'about', 'cases', 'contact', 'products', 'quality', 'news'];

const ENHANCED_MARKER = '<!-- seo:enhanced -->';

const langCodeMap = {
    cn: 'zh-CN', en: 'en', jp: 'ja', ru: 'ru', ar: 'ar',
    es: 'es', fr: 'fr', pt: 'pt', hi: 'hi', de: 'de'
};

const pageNames = {
    cn: { index: '首页', about: '关于我们', cases: '应用案例', contact: '联系我们', products: '产品中心', quality: '质量控制', news: '新闻动态' },
    en: { index: 'Home', about: 'About Us', cases: 'Case Studies', contact: 'Contact', products: 'Products', quality: 'Quality', news: 'News' },
    jp: { index: 'ホーム', about: '会社概要', cases: '導入事例', contact: 'お問い合わせ', products: '製品', quality: '品質管理', news: 'ニュース' },
    ru: { index: 'Главная', about: 'О компании', cases: 'Проекты', contact: 'Контакты', products: 'Продукция', quality: 'Качество', news: 'Новости' },
    ar: { index: 'الرئيسية', about: 'من نحن', cases: 'مشاريع', contact: 'اتصل بنا', products: 'المنتجات', quality: 'الجودة', news: 'الأخبار' },
    es: { index: 'Inicio', about: 'Sobre Nosotros', cases: 'Casos', contact: 'Contacto', products: 'Productos', quality: 'Calidad', news: 'Noticias' },
    fr: { index: 'Accueil', about: 'À propos', cases: 'Cas', contact: 'Contact', products: 'Produits', quality: 'Qualité', news: 'Actualités' },
    pt: { index: 'Início', about: 'Sobre', cases: 'Casos', contact: 'Contato', products: 'Produtos', quality: 'Qualidade', news: 'Notícias' },
    hi: { index: 'होम', about: 'हमारे बारे में', cases: 'परियोजनाएं', contact: 'संपर्क', products: 'उत्पाद', quality: 'गुणवत्ता', news: 'समाचार' },
    de: { index: 'Startseite', about: 'Über uns', cases: 'Referenzen', contact: 'Kontakt', products: 'Produkte', quality: 'Qualität', news: 'Nachrichten' }
};

// =============================================================================
// 工具
// =============================================================================

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { fs.writeFileSync(file, content, 'utf8'); }

function buildOgLocaleHtml(lang) {
    const main = `<meta property="og:locale" content="${getOgLocale(lang)}">`;
    const alts = getOgLocaleAlternates(lang)
        .map((alt) => `<meta property="og:locale:alternate" content="${alt}">`)
        .join('\n    ');
    return `${ENHANCED_MARKER}\n    ${main}\n    ${alts}`;
}

function injectOgLocale(html, lang) {
    if (html.includes(ENHANCED_MARKER)) return html;
    // 在 OpenGraph 块结尾后追加（找 og:type 这一行的下一个 og:site_name 或紧跟 Twitter Card 注释）
    const block = buildOgLocaleHtml(lang);
    // 用回调避免 $$ 在替换字符串里被当作转义
    if (/<meta\s+property="og:site_name"[^>]*>/i.test(html)) {
        return html.replace(
            /<meta\s+property="og:site_name"[^>]*>/i,
            (m) => `${m}\n    ${block}`
        );
    }
    if (/<meta\s+property="og:type"[^>]*>/i.test(html)) {
        return html.replace(
            /<meta\s+property="og:type"[^>]*>/i,
            (m) => `${m}\n    ${block}`
        );
    }
    return html.replace('</head>', () => `    ${block}\n</head>`);
}

// =============================================================================
// Part 1：核心页面增强（A3+D1+D2+E1+E3）
// =============================================================================

function buildCorePageJsonLd(lang, pageType) {
    const business = generateLocalBusinessSchema(lang);
    const baseUrl = `${siteConfig.siteUrl}/${lang}`;
    const breadcrumbs = [{ name: pageNames[lang]?.index || 'Home', url: `${baseUrl}/index.html` }];
    if (pageType !== 'index') {
        breadcrumbs.push({ name: pageNames[lang]?.[pageType] || pageType, url: `${baseUrl}/${pageType}.html` });
    }
    const breadcrumb = generateBreadcrumbSchema(breadcrumbs);
    return [business, breadcrumb];
}

function upgradeCorePage(file, lang, pageType) {
    let html = read(file);
    let changed = false;

    // 1. 升级结构化数据：用 @graph 同时挂 LocalBusiness + BreadcrumbList
    const newJsonLd = `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": buildCorePageJsonLd(lang, pageType)
    })}</script>`;

    const ldRegex = /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/;
    const FORCE = process.env.SEO_FORCE === '1';
    if (ldRegex.test(html)) {
        const existing = html.match(ldRegex)[0];
        if (FORCE || !existing.includes('LocalBusiness')) {
            // 用回调避免 $$ 等被当作 replace 转义
            html = html.replace(ldRegex, () => newJsonLd);
            changed = true;
        }
    } else {
        html = html.replace('</head>', () => `    ${newJsonLd}\n</head>`);
        changed = true;
    }

    // 2. 注入 og:locale
    const next = injectOgLocale(html, lang);
    if (next !== html) {
        html = next;
        changed = true;
    }

    if (changed) write(file, html);
    return changed;
}

// =============================================================================
// Part 2：新闻详情页增强（A3+B3+E1+E3）
// =============================================================================

function extractTitle(html) {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? m[1].trim() : '';
}

function extractMetaContent(html, attrName, attrValue) {
    const re = new RegExp(`<meta\\s+${attrName}=["']${attrValue}["']\\s+content=["']([^"']*)["']\\s*/?\\s*>`, 'i');
    const m = html.match(re);
    return m ? m[1].trim() : '';
}

function deriveSlugFromPath(file) {
    // [lang]/news/published/categoryX/<slug>.html
    return path.basename(file, '.html');
}

function deriveCategoryFromPath(file) {
    const parent = path.basename(path.dirname(file));
    return parent || 'news';
}

function findCorrespondingFiles(currentFile) {
    // 推断各语言对应文件路径（按相同 category + slug）
    const slug = deriveSlugFromPath(currentFile);
    const category = deriveCategoryFromPath(currentFile);
    const out = {};
    for (const lang of LANGS) {
        const candidate = path.join(ROOT, lang, 'news', 'published', category, `${slug}.html`);
        if (fs.existsSync(candidate)) out[lang] = candidate;
    }
    return out;
}

function buildNewsHrefHtml(currentLang, slug, category) {
    const peers = LANGS.filter((l) => fs.existsSync(
        path.join(ROOT, l, 'news', 'published', category, `${slug}.html`)
    ));
    return peers.map((l) => {
        const hreflang = l === 'en' ? 'x-default' : (langCodeMap[l] || l);
        const url = `${siteConfig.siteUrl}/${l}/news/published/${category}/${slug}.html`;
        return `<link rel="alternate" hreflang="${hreflang}" href="${url}" />`;
    }).join('\n    ');
}

function newsAlreadyEnhanced(html) {
    return /<link\s+rel="canonical"/i.test(html) && /"@type":\s*"NewsArticle"/.test(html);
}

function getFileGitDateOrMtime(file) {
    try {
        const { execSync } = require('child_process');
        const out = execSync(`git log -1 --format=%cI -- "${file}"`, { cwd: ROOT })
            .toString().trim();
        if (out) return out;
    } catch (_) { /* 忽略 */ }
    return fs.statSync(file).mtime.toISOString();
}

function upgradeNewsPage(file) {
    let html = read(file);
    if (newsAlreadyEnhanced(html)) return false;

    // 推断元数据
    const lang = file.split(path.sep).find((seg) => LANGS.includes(seg));
    if (!lang) return false;
    const slug = deriveSlugFromPath(file);
    const category = deriveCategoryFromPath(file);
    const title = extractTitle(html) || slug;
    const description = extractMetaContent(html, 'name', 'description')
        || `${title} - ${siteConfig.siteName[lang] || siteConfig.siteName.en}`;
    const url = `${siteConfig.siteUrl}/${lang}/news/published/${category}/${slug}.html`;
    const datePublished = getFileGitDateOrMtime(file);
    const image = `${siteConfig.siteUrl}${siteConfig.logoUrl}`;
    const contentLanguage = langCodeMap[lang] || 'en';

    // 构建注入块
    const canonical = `<link rel="canonical" href="${url}">`;
    const robots = `<meta name="robots" content="index, follow">`;
    const author = `<meta name="author" content="${siteConfig.siteName[lang] || siteConfig.siteName.en}">`;
    const langMeta = `<meta http-equiv="content-language" content="${contentLanguage}">`;
    const articlePublished = `<meta property="article:published_time" content="${datePublished}">`;

    const ogBlock = [
        `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}">`,
        `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}">`,
        `<meta property="og:image" content="${image}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta property="og:type" content="article">`,
        `<meta property="og:site_name" content="${siteConfig.siteName[lang] || siteConfig.siteName.en}">`,
        `<meta property="og:locale" content="${getOgLocale(lang)}">`,
        ...getOgLocaleAlternates(lang).map((a) => `<meta property="og:locale:alternate" content="${a}">`)
    ].join('\n    ');

    const twBlock = [
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">`,
        `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}">`,
        `<meta name="twitter:image" content="${image}">`,
        `<meta name="twitter:site" content="${siteConfig.socialMedia.twitter}">`
    ].join('\n    ');

    const hreflang = buildNewsHrefHtml(lang, slug, category);

    const breadcrumb = generateBreadcrumbSchema([
        { name: pageNames[lang]?.index || 'Home', url: `${siteConfig.siteUrl}/${lang}/index.html` },
        { name: pageNames[lang]?.news || 'News', url: `${siteConfig.siteUrl}/${lang}/news.html` },
        { name: title, url }
    ]);

    const newsArticle = generateNewsArticleSchema({
        title,
        description,
        image,
        url,
        contentLanguage,
        datePublished
    });

    const jsonLd = `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [newsArticle, breadcrumb]
    })}</script>`;

    const injectionBlock = [
        ENHANCED_MARKER,
        canonical,
        robots,
        author,
        langMeta,
        articlePublished,
        ogBlock,
        twBlock,
        hreflang,
        jsonLd
    ].join('\n    ');

    // 在 description meta 之后插入（兜底用 </head> 前）；用回调避免 $$ 转义陷阱
    if (/<meta\s+name="description"[^>]*>/i.test(html)) {
        html = html.replace(
            /<meta\s+name="description"[^>]*>/i,
            (m) => `${m}\n    ${injectionBlock}`
        );
    } else {
        html = html.replace('</head>', () => `    ${injectionBlock}\n</head>`);
    }
    write(file, html);
    return true;
}

// =============================================================================
// Walk
// =============================================================================

function walkHtml(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walkHtml(full, results);
        else if (e.isFile() && e.name.endsWith('.html')) results.push(full);
    }
    return results;
}

function main() {
    let coreUpgraded = 0;
    let coreSkipped = 0;
    for (const lang of LANGS) {
        for (const page of CORE_PAGES) {
            const file = path.join(ROOT, lang, `${page}.html`);
            if (!fs.existsSync(file)) continue;
            if (upgradeCorePage(file, lang, page)) coreUpgraded++;
            else coreSkipped++;
        }
    }

    let newsUpgraded = 0;
    let newsSkipped = 0;
    for (const lang of LANGS) {
        const newsDir = path.join(ROOT, lang, 'news', 'published');
        for (const file of walkHtml(newsDir)) {
            if (upgradeNewsPage(file)) newsUpgraded++;
            else newsSkipped++;
        }
    }

    console.log(`核心页面：升级 ${coreUpgraded}，跳过(已最新) ${coreSkipped}`);
    console.log(`新闻详情：注入 ${newsUpgraded}，跳过(已存在 canonical+NewsArticle) ${newsSkipped}`);
}

if (require.main === module) main();

module.exports = { upgradeCorePage, upgradeNewsPage };
