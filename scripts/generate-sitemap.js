const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.hengjitaipipeline.com';
const LANGUAGES = ['cn', 'en', 'jp', 'fr', 'de', 'es', 'pt', 'ru', 'ar', 'hi'];

// 基本页面配置
const STATIC_PAGES = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: 'about.html', priority: '0.9', changefreq: 'monthly' },
    { url: 'products.html', priority: '0.9', changefreq: 'weekly' },
    { url: 'cases.html', priority: '0.8', changefreq: 'weekly' },
    { url: 'quality.html', priority: '0.8', changefreq: 'monthly' },
    { url: 'news.html', priority: '0.8', changefreq: 'daily' },
    { url: 'contact.html', priority: '0.7', changefreq: 'monthly' }
];

function generateUrlEntry(loc, lastmod, changefreq, priority) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function getNewsUrls(lang) {
    const newsPath = path.join(__dirname, '..', lang, 'news', 'file-list.json');
    try {
        const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
        const urls = [];
        if (newsData.files) {
            newsData.files.forEach(category => {
                if (category.results) {
                    category.results.forEach(news => {
                        urls.push({
                            loc: `${BASE_URL}/${lang}/news/published/${category.category}/${news.slug}`,
                            lastmod: news.publishDate || news.date,
                            changefreq: 'monthly',
                            priority: '0.6'
                        });
                    });
                }
            });
        }
        return urls;
    } catch (error) {
        console.warn(`Warning: Could not read news data for ${lang}: ${error.message}`);
        return [];
    }
}

function generateSitemap(lang) {
    console.log(`Generating sitemap for ${lang}...`);
    
    const today = new Date().toISOString().split('T')[0];
    const urls = [];

    // 添加静态页面
    STATIC_PAGES.forEach(page => {
        urls.push({
            loc: `${BASE_URL}/${lang}/${page.url}`,
            lastmod: today,
            changefreq: page.changefreq,
            priority: page.priority
        });
    });

    // 添加新闻页面
    urls.push(...getNewsUrls(lang));

    // 生成 XML
    const xmlContent = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        urls.map(url => generateUrlEntry(url.loc, url.lastmod, url.changefreq, url.priority)).join('\n'),
        '</urlset>'
    ].join('\n');

    // 写入文件
    const outputPath = path.join(__dirname, '..', `sitemap-${lang}.xml`);
    fs.writeFileSync(outputPath, xmlContent);
    console.log(`Generated sitemap for ${lang}: ${outputPath}`);
    return `sitemap-${lang}.xml`;
}

function generateSitemapIndex(sitemapFiles) {
    console.log('Generating sitemap index...');
    const today = new Date().toISOString().split('T')[0];
    
    const xmlContent = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        sitemapFiles.map(file => 
            `  <sitemap>
    <loc>${BASE_URL}/${file}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
        ).join('\n'),
        '</sitemapindex>'
    ].join('\n');

    const outputPath = path.join(__dirname, '..', 'sitemap.xml');
    fs.writeFileSync(outputPath, xmlContent);
    console.log(`Generated sitemap index: ${outputPath}`);
}

// 生成所有语言的站点地图
console.log('Starting sitemap generation...');
const generatedSitemaps = LANGUAGES.map(lang => generateSitemap(lang));
generateSitemapIndex(generatedSitemaps);
console.log('Sitemap generation completed!');
