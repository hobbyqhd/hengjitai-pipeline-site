/**
 * 元数据处理共享模块
 *
 * 此模块提供统一的SEO和元数据处理功能，供所有生成脚本使用。
 */

// 基础站点配置
const siteConfig = {
    siteName: {
        cn: '沧州恒基泰管道装备有限公司',
        en: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        jp: '恒基泰管道設備有限公司',
        ru: 'Цанчжоу Хэнцзитай Трубопроводное Оборудование',
        ar: 'شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة',
        es: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        fr: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        pt: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        hi: 'कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड',
        de: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.'
    },
    siteUrl: 'https://hengjitaipipeline.com',
    logoUrl: '/images/logo.png',
    socialMedia: {
        twitter: '@hengjitaipipeline',
        facebook: 'hengjitaipipeline'
    },
    // LocalBusiness / Organization 完整资料（D1）
    business: {
        legalName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        alternateName: '沧州恒基泰管道装备有限公司',
        foundingDate: '2026-03-31',
        telephone: '+86 189-3171-0082',
        email: 'sales@hypipelines.com',
        address: {
            streetAddress: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            addressLocality: 'Cangzhou',
            addressRegion: 'Hebei',
            postalCode: '',
            addressCountry: 'CN'
        },
        geo: {
            latitude: 39.4850,
            longitude: 115.9740
        },
        openingHours: 'Mo-Sa 08:30-18:00',
        priceRange: '$$',
        sameAs: [
            'https://www.linkedin.com/company/hengjitai-pipeline',
            'https://www.facebook.com/hengjitaipipeline'
        ]
    },
    defaultDescriptions: {
        cn: '沧州恒基泰管道装备有限公司专业生产塑料包覆钢管、防腐钢管等产品，质量可靠，服务完善。',
        en: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. specializes in producing high-quality plastic-coated steel pipes and anti-corrosion steel pipes.',
        // ... 其他语言的默认描述
    },
    defaultKeywords: {
        cn: '塑料包覆钢管,防腐钢管,钢管,恒基泰',
        en: 'plastic coated steel pipes,anti-corrosion steel pipes,steel pipes,Cangzhou Hengjitai',
        // ... 其他语言的默认关键词
    }
};

// OpenGraph locale 映射（E1/E3）
const ogLocaleMap = {
    cn: 'zh_CN',
    en: 'en_US',
    jp: 'ja_JP',
    ru: 'ru_RU',
    ar: 'ar_AR',
    es: 'es_ES',
    fr: 'fr_FR',
    pt: 'pt_PT',
    hi: 'hi_IN',
    de: 'de_DE'
};

function getOgLocale(lang) {
    return ogLocaleMap[lang] || 'en_US';
}

function getOgLocaleAlternates(currentLang) {
    return Object.entries(ogLocaleMap)
        .filter(([code]) => code !== currentLang)
        .map(([, locale]) => locale);
}

/**
 * 生成基础OpenGraph和Twitter Card元标签
 * @param {Object} metadata 页面元数据
 * @returns {Object} 包含OpenGraph和Twitter Card标签的对象
 */
function generateSocialMetaTags(metadata) {
    const lang = metadata.contentLanguage?.split('-')[0] || 'en';
    const siteName = siteConfig.siteName[lang] || siteConfig.siteName['en'];

    return {
        // OpenGraph标签
        ogTitle: metadata.title,
        ogDescription: metadata.description,
        ogImage: metadata.image || siteConfig.logoUrl,
        ogUrl: metadata.url,
        ogType: metadata.type || 'website',
        ogSiteName: siteName,
        ogLocale: getOgLocale(lang),
        ogLocaleAlternates: getOgLocaleAlternates(lang),
        // Twitter Card标签
        twitterCard: 'summary_large_image',
        twitterTitle: metadata.title,
        twitterDescription: metadata.description,
        twitterImage: metadata.image || siteConfig.logoUrl,
        twitterSite: siteConfig.socialMedia.twitter
    };
}

/**
 * 把 social meta tags 渲染成 HTML 字符串（含 og:locale + alternates，E1+E3）。
 */
function renderSocialMetaTagsHtml(metadata) {
    const social = generateSocialMetaTags(metadata);
    const escape = (s) => String(s ?? '').replace(/"/g, '&quot;');
    const lines = [
        `<meta property="og:title" content="${escape(social.ogTitle)}">`,
        `<meta property="og:description" content="${escape(social.ogDescription)}">`,
        `<meta property="og:image" content="${escape(social.ogImage)}">`,
        `<meta property="og:url" content="${escape(social.ogUrl)}">`,
        `<meta property="og:type" content="${escape(social.ogType)}">`,
        `<meta property="og:site_name" content="${escape(social.ogSiteName)}">`,
        `<meta property="og:locale" content="${escape(social.ogLocale)}">`,
        ...social.ogLocaleAlternates.map(
            (alt) => `<meta property="og:locale:alternate" content="${escape(alt)}">`
        ),
        `<meta name="twitter:card" content="${escape(social.twitterCard)}">`,
        `<meta name="twitter:title" content="${escape(social.twitterTitle)}">`,
        `<meta name="twitter:description" content="${escape(social.twitterDescription)}">`,
        `<meta name="twitter:image" content="${escape(social.twitterImage)}">`,
        `<meta name="twitter:site" content="${escape(social.twitterSite)}">`
    ];
    return lines.join('\n    ');
}

/**
 * 生成 LocalBusiness/Manufacturer 完整 schema（D1）。
 * 用于首页或单独嵌入。
 */
function generateLocalBusinessSchema(lang = 'en') {
    const siteName = siteConfig.siteName[lang] || siteConfig.siteName.en;
    const b = siteConfig.business;
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness", "Manufacturer"],
        "@id": `${siteConfig.siteUrl}/#organization`,
        "name": siteName,
        "alternateName": b.alternateName,
        "legalName": b.legalName,
        "url": siteConfig.siteUrl,
        "logo": `${siteConfig.siteUrl}${siteConfig.logoUrl}`,
        "image": `${siteConfig.siteUrl}${siteConfig.logoUrl}`,
        "foundingDate": b.foundingDate,
        "telephone": b.telephone,
        "email": b.email,
        "priceRange": b.priceRange,
        "openingHours": b.openingHours,
        "address": {
            "@type": "PostalAddress",
            ...b.address
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": b.geo.latitude,
            "longitude": b.geo.longitude
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": b.telephone,
            "contactType": "sales",
            "areaServed": "Worldwide",
            "availableLanguage": ["zh-CN", "en", "ja", "de", "es", "fr", "pt", "ru", "ar", "hi"]
        },
        "sameAs": b.sameAs
    };
}

/**
 * BreadcrumbList schema（D2）。
 * @param {Array<{name:string,url:string}>} items
 */
function generateBreadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

/**
 * NewsArticle schema（A3 / B3）。
 */
function generateNewsArticleSchema(data) {
    const lang = data.contentLanguage?.split('-')[0] || 'en';
    const siteName = siteConfig.siteName[lang] || siteConfig.siteName.en;
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": data.title,
        "description": data.description,
        "image": data.image,
        "inLanguage": data.contentLanguage,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
        },
        "author": {
            "@type": "Organization",
            "name": siteName,
            "url": siteConfig.siteUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
                "@type": "ImageObject",
                "url": `${siteConfig.siteUrl}${siteConfig.logoUrl}`
            }
        },
        "datePublished": data.datePublished,
        "dateModified": data.dateModified || data.datePublished
    };
}

/**
 * FAQ schema（D3）。
 * @param {Array<{question:string,answer:string}>} faqs
 */
function generateFAQSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    };
}

/**
 * 生成 JSON-LD 结构化数据。
 * type: 'product' | 'product-category' | 'news' | 'organization' | 其他
 */
function generateStructuredData(type, data) {
    const lang = data.contentLanguage?.split('-')[0] || 'en';
    const siteName = siteConfig.siteName[lang] || siteConfig.siteName.en;

    if (type === 'news' || type === 'article') {
        return generateNewsArticleSchema(data);
    }

    if (type === 'organization' || type === 'index' || type === 'about' || type === 'contact') {
        return generateLocalBusinessSchema(lang);
    }

    if (type === 'product') {
        // D4：补 offers / brand / manufacturer / aggregateRating（可选）
        const product = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.title || data.name,
            "description": data.description,
            "image": data.image,
            "sku": data.sku || data.id,
            "category": data.category || 'Industrial Pipes',
            "brand": {
                "@type": "Brand",
                "name": "Hengjitai"
            },
            "manufacturer": {
                "@type": "Organization",
                "name": siteName,
                "url": siteConfig.siteUrl
            },
            "offers": {
                "@type": "Offer",
                "url": data.url,
                "priceCurrency": data.priceCurrency || 'USD',
                "price": data.price || '0',
                "priceValidUntil": data.priceValidUntil || `${new Date().getFullYear() + 1}-12-31`,
                "availability": data.availability || 'https://schema.org/InStock',
                "itemCondition": 'https://schema.org/NewCondition',
                "seller": {
                    "@type": "Organization",
                    "name": siteName
                }
            }
        };
        if (data.aggregateRating) {
            product.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": data.aggregateRating.value,
                "reviewCount": data.aggregateRating.count
            };
        }
        return product;
    }

    if (type === 'product-category') {
        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": data.title,
            "description": data.description,
            "publisher": generateLocalBusinessSchema(lang),
            "numberOfItems": data.products?.length || 0,
            "itemListElement": (data.products || []).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": product.image,
                    "url": product.url
                }
            }))
        };
    }

    // 默认 fallback：返回 LocalBusiness
    return generateLocalBusinessSchema(lang);
}

/**
 * 获取页面的SEO元数据信息
 * @param {string} lang 语言代码
 * @param {string} pageType 页面类型（如'about', 'products'等）
 * @param {Object} currentData 当前页面特定的数据（可选）
 * @returns {Object} 包含完整SEO元数据的对象
 */
function getPageMetadata(lang, pageType, currentData = null) {
    const pageComponents = require('../shared/page-components');
    const config = require('../config');

    // 获取语言配置
    const langConfig = pageComponents.getLanguageConfig(lang);
    const companyName = langConfig.companyFullName;

    // 构建页面URL
    let pageUrl;
    if (currentData?.id) {
        pageUrl = `${siteConfig.siteUrl}/${lang}/hp-products/${currentData.id}.html`;
    } else {
        pageUrl = `${siteConfig.siteUrl}/${lang}/${pageType}.html`;
    }

    // 构建基础元数据
    const baseMetadata = {
        title: '',
        description: '',
        keywords: '',
        type: 'website',
        image: siteConfig.logoUrl,
        url: pageUrl,
        robots: 'index, follow',
        author: companyName,
        contentLanguage: langConfig.langCode,
        viewport: 'width=device-width, initial-scale=1.0',
        themeColor: '#FFFFFF',
        applicationName: companyName
    };

    // 获取页面类型特定的元数据
    const pageTypeMetadata = config.seo?.pages?.[lang]?.[pageType] || config.seo?.pages?.['en']?.[pageType] || {};

    // 合并基础元数据和页面类型元数据
    let metadata = {
        ...baseMetadata,
        ...pageTypeMetadata
    };

    // 处理特定页面类型的元数据
    if (pageType === 'product-category' && currentData?.name) {
        // 组织产品分类描述，添加更多产品特性和用途信息
        const defaultDesc = lang === 'cn' ?
            `${currentData.name}产品系列，采用先进工艺制造，具有优异的性能和可靠的质量。作为专业的${currentData.name}制造商，我们提供完整的工业管道解决方案。` :
            `${currentData.name} product series, manufactured with advanced technology, featuring excellent performance and reliable quality. As a professional manufacturer of ${currentData.name}, we provide complete industrial pipeline solutions.`;

        const categoryDesc = currentData.description || defaultDesc;

        // 使用更有针对性的关键词
        const baseKeywords = [
            currentData.name,
            companyName,
            lang === 'cn' ? '制造商' : 'manufacturer',
            lang === 'cn' ? '生产厂家' : 'producer',
            lang === 'cn' ? '工业管道' : 'industrial pipeline',
            lang === 'cn' ? '管道系统' : 'pipeline system'
        ];

        const keywords = new Set([
            ...baseKeywords,
            ...((currentData.keywords || '').split(',').map(k => k.trim()).filter(Boolean))
        ]);

        metadata = {
            ...metadata,
            title: `${currentData.name} - ${companyName}`,
            description: categoryDesc,
            keywords: Array.from(keywords).join(', '),
            type: 'website',
            image: currentData.image || metadata.image,
            url: pageUrl // 使用当前页面的实际URL
        };
    }

    // 生成社交媒体标签和结构化数据
    const socialTags = generateSocialMetaTags(metadata);
    const structuredData = generateStructuredData(pageType, {
        ...metadata,
        currentUrl: pageUrl // 确保结构化数据使用正确的URL
    });

    // 返回完整的元数据对象
    return {
        ...metadata,
        ...socialTags,
        structuredData: JSON.stringify(structuredData, null, 2),
        canonicalUrl: pageUrl // 确保canonical URL指向当前页面
    };
}

/**
 * 生成alternate hreflang标签
 * @param {string} currentLang 当前语言代码
 * @param {string} pagePath 当前页面路径（相对于语言根目录）
 * @returns {string} 生成的alternate hreflang HTML标签
 */
function generateAlternateLinks(currentLang, pagePath) {
    const LANGUAGES = require('../shared/page-components').LANGUAGES;
    const pageComponents = require('../shared/page-components');

    let links = LANGUAGES.map(langCode => {
        const langConfig = pageComponents.getLanguageConfig(langCode);
        // 使用完整的URL路径
        const href = `${siteConfig.siteUrl}/${langCode}/${pagePath}`;
        const hreflang = langCode === 'en' ? 'x-default' : langConfig.langCode;
        return `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`;
    });

    // 添加 x-default 链接（如果英文版本不存在）
    if (!LANGUAGES.includes('en')) {
        const defaultHref = `${siteConfig.siteUrl}/en/${pagePath}`;
        links.push(`<link rel="alternate" hreflang="x-default" href="${defaultHref}" />`);
    }

    return links.join('\n');
}

module.exports = {
    getPageMetadata,
    generateAlternateLinks,
    generateSocialMetaTags,
    renderSocialMetaTagsHtml,
    generateStructuredData,
    generateLocalBusinessSchema,
    generateBreadcrumbSchema,
    generateNewsArticleSchema,
    generateFAQSchema,
    getOgLocale,
    getOgLocaleAlternates,
    siteConfig
};
