/**
 * 全站页面 SEO 单一数据源：从 config.seo.pages 读取，避免与各脚本内嵌文案重复。
 */
const config = require('../config');

/**
 * @param {string} lang 语言代码 cn|en|jp|...
 * @param {string} pageName index|about|products|quality|cases|news|contact
 * @returns {{ title: string, description: string, keywords: string }}
 */
function getPageSeo(lang, pageName) {
    const pagesRoot = config.seo && config.seo.pages;
    if (!pagesRoot) {
        return { title: '', description: '', keywords: '' };
    }
    const pick = (code) => {
        const block = pagesRoot[code];
        return block && block[pageName] ? block[pageName] : null;
    };
    const resolved =
        pick(lang) ||
        pick('en') ||
        pick('cn') ||
        {};
    return {
        title: resolved.title || '',
        description: resolved.description || '',
        keywords: resolved.keywords || ''
    };
}

module.exports = { getPageSeo };
