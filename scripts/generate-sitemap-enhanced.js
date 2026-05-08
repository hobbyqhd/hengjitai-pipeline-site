#!/usr/bin/env node

/**
 * 增强的 Sitemap 生成器
 * 自动扫描所有语言页面，生成完整的 sitemap
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const languages = ['cn', 'en', 'jp', 'de', 'es', 'fr', 'pt', 'ru', 'ar', 'hi'];
const baseUrl = 'https://hengjitaipipeline.com';
const priority = {
    'index.html': '1.0',
    'products.html': '0.9',
    'about.html': '0.8',
    'cases.html': '0.7',
    'quality.html': '0.7',
    'news.html': '0.6',
    'contact.html': '0.5'
};

/**
 * F2：取文件最后一次 git commit 时间作为 lastmod。
 * 如果 git 不可用或文件未跟踪，回退到 fs.statSync(file).mtime。
 * 缓存结果避免 N 次 fork（70+ 文件 × 一次 git 调用会很慢）。
 */
const lastmodCache = new Map();
function getLastModDate(absPath) {
    if (lastmodCache.has(absPath)) return lastmodCache.get(absPath);
    let date;
    try {
        const out = execSync(
            `git log -1 --format=%cI -- "${absPath}"`,
            { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'ignore'] }
        ).toString().trim();
        if (out) date = out.split('T')[0];
    } catch (_) { /* 忽略 */ }
    if (!date) date = fs.statSync(absPath).mtime.toISOString().split('T')[0];
    lastmodCache.set(absPath, date);
    return date;
}

function scanPages(langDir) {
    const pages = [];
    const langPath = path.join(process.cwd(), langDir);

    if (!fs.existsSync(langPath)) {
        return pages;
    }

    // 扫描主要页面
    const mainFiles = fs.readdirSync(langPath).filter(file => file.endsWith('.html'));
    mainFiles.forEach(file => {
        const filePath = path.join(langPath, file);
        // products-old.html 等已 noindex 的页面不进入 sitemap
        if (file === 'products-old.html') return;
        pages.push({
            url: `${baseUrl}/${langDir}/${file}`,
            lastmod: getLastModDate(filePath),
            priority: priority[file] || '0.5',
            changefreq: file === 'index.html' ? 'weekly' : 'monthly'
        });
    });

    // 扫描子目录页面（新闻、产品等），news/published 内递归
    const subDirs = ['news/published', 'hp-products'];
    subDirs.forEach(subDir => {
        const subPath = path.join(langPath, subDir);
        if (!fs.existsSync(subPath)) return;
        // 递归扫描该子目录下所有 .html
        const stack = [subPath];
        while (stack.length) {
            const dir = stack.pop();
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    stack.push(full);
                } else if (entry.isFile() && entry.name.endsWith('.html')) {
                    const rel = path.relative(langPath, full).split(path.sep).join('/');
                    pages.push({
                        url: `${baseUrl}/${langDir}/${rel}`,
                        lastmod: getLastModDate(full),
                        priority: subDir.startsWith('news') ? '0.6' : '0.7',
                        changefreq: subDir.startsWith('news') ? 'weekly' : 'monthly'
                    });
                }
            }
        }
    });

    return pages;
}

function generateLanguageSitemap(lang) {
    const pages = scanPages(lang);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach(page => {
        xml += '  <url>\n';
        xml += `    <loc>${page.url}</loc>\n`;
        xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
}

function generateMainSitemap() {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    languages.forEach(lang => {
        xml += '  <sitemap>\n';
        xml += `    <loc>${baseUrl}/sitemap-${lang}.xml</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';

    return xml;
}

function generateAllSitemaps() {
    console.log('🗺️  正在生成 Sitemap 文件...');

    // 生成各语言的 sitemap
    languages.forEach(lang => {
        const xml = generateLanguageSitemap(lang);
        const filename = `sitemap-${lang}.xml`;
        fs.writeFileSync(filename, xml);
        console.log(`✅ 已生成: ${filename}`);
    });

    // 生成主 sitemap
    const mainXml = generateMainSitemap();
    fs.writeFileSync('sitemap.xml', mainXml);
    console.log('✅ 已生成: sitemap.xml');

    console.log('🎉 Sitemap 生成完成!');
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// 添加图片 sitemap 生成
function generateImageSitemap() {
    console.log('🖼️  正在生成图片 Sitemap...');

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = [];

    function scanImageDir(dir) {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) return;

        const files = fs.readdirSync(fullPath, { withFileTypes: true });
        files.forEach(file => {
            const childPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                scanImageDir(childPath);
            } else if (imageExtensions.includes(path.extname(file.name).toLowerCase())) {
                const relPath = childPath.split(path.sep).join('/');
                images.push({
                    url: `/${relPath}`,
                    title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ')
                });
            }
        });
    }

    scanImageDir('images');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // 图片 sitemap 的 <loc> 必须是真实页面 URL。没有逐图页面归属数据时，
    // 统一挂到首页，避免生成 /images/... 这类不存在的页面 URL。
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/index.html</loc>\n`;
    images.forEach(img => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(`${baseUrl}${encodeURI(img.url)}`)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        xml += '    </image:image>\n';
    });
    xml += '  </url>\n';

    xml += '</urlset>';

    fs.writeFileSync('sitemap-images.xml', xml);
    console.log(`✅ 已生成: sitemap-images.xml (${images.length} images)`);
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--images')) {
        generateImageSitemap();
    } else {
        generateAllSitemaps();
    }
}

module.exports = {
    generateAllSitemaps,
    generateImageSitemap,
    generateLanguageSitemap,
    generateMainSitemap
};
