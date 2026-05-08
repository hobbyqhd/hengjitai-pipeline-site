#!/usr/bin/env node

/**
 * 结构化数据增强脚本
 * 为不同页面类型生成适当的 Schema.org 结构化数据
 */

// 基础组织信息
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "alternateName": "沧州恒基泰管道装备有限公司",
    "url": "https://hengjitaipipeline.com",
    "logo": "https://hengjitaipipeline.com/images/logo.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+86 189-3171-0082",
        "contactType": "customer service",
        "availableLanguage": ["zh-CN", "en", "ja", "de", "es", "fr", "pt", "ru", "ar", "hi"]
    },
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
        "addressCountry": "CN",
        "addressRegion": "Hebei",
        "addressLocality": "Cangzhou"
    },
    "sameAs": [
        "https://www.linkedin.com/company/hengjitai-pipeline",
        "https://www.facebook.com/hengyuan.industrial"
    ]
};

// 网站结构化数据
const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "url": "https://hengjitaipipeline.com",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://hengjitaipipeline.com/en/products.html?search={search_term_string}",
        "query-input": "required name=search_term_string"
    },
    "inLanguage": ["zh-CN", "en", "ja", "de", "es", "fr", "pt", "ru", "ar", "hi"]
};

// 产品页面结构化数据模板
function generateProductSchema(productData) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "description": productData.description,
        "brand": {
            "@type": "Brand",
            "name": "Hengjitai"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd."
        },
        "image": productData.image,
        "category": productData.category || "Industrial Pipes",
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "USD",
            "seller": {
                "@type": "Organization",
                "name": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd."
            }
        }
    };
}

// 面包屑导航结构化数据
function generateBreadcrumbSchema(breadcrumbs) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

// FAQ 结构化数据
function generateFAQSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// 新闻文章结构化数据
function generateNewsSchema(newsData) {
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": newsData.title,
        "description": newsData.description,
        "image": newsData.image,
        "author": {
            "@type": "Organization",
            "name": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd."
        },
        "publisher": {
            "@type": "Organization",
            "name": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            "logo": {
                "@type": "ImageObject",
                "url": "https://hengjitaipipeline.com/images/logo.png"
            }
        },
        "datePublished": newsData.publishDate,
        "dateModified": newsData.modifyDate || newsData.publishDate
    };
}

// 输出所有结构化数据模板
function outputSchemas() {
    console.log('=== 基础组织结构化数据 ===');
    console.log(JSON.stringify(organizationSchema, null, 2));
    
    console.log('\n=== 网站结构化数据 ===');
    console.log(JSON.stringify(websiteSchema, null, 2));
    
    console.log('\n=== 产品页面结构化数据示例 ===');
    const sampleProduct = {
        name: "涂塑钢管",
        description: "高质量的涂塑钢管，适用于各种工业应用",
        image: "https://hengjitaipipeline.com/images/products/coated-steel-pipe.jpg",
        category: "Industrial Pipes"
    };
    console.log(JSON.stringify(generateProductSchema(sampleProduct), null, 2));
}

module.exports = {
    organizationSchema,
    websiteSchema,
    generateProductSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateNewsSchema
};

if (require.main === module) {
    outputSchemas();
}
