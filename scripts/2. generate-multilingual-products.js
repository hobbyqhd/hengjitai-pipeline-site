#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const siteConfig = require('./config');

// 简化的产品搜索关键词映射表
// 统一使用简洁的核心关键词，确保多语言版本搜索结果一致
const SIMPLIFIED_PRODUCT_KEYWORDS = {
    'plastic-coating': {
        cn: '涂塑',          // 简化为核心词"涂塑"
        en: 'coating',       // 简化为核心词"coating"
        jp: '被覆',          // 更准确的"被覆"
        ru: 'покрытие',      // 简化为核心词"покрытие"
        ar: 'طلاء',          // 简化为核心词"طلاء"
        es: 'recubrimiento', // 简化为核心词"recubrimiento"
        fr: 'revêtement',    // 简化为核心词"revêtement"
        pt: 'revestimento',  // 简化为核心词"revestimento"
        hi: 'कोटिंग',        // 简化为核心词"कोटिंग"
        de: 'Beschichtung'   // 更准确的技术术语"Beschichtung"
    },
    'anti-corrosion': {
        cn: '防腐',          // 简化为核心词"防腐"
        en: 'corrosion',     // 简化为核心词"corrosion"
        jp: '防食',          // 简化为核心词"防食"
        ru: 'коррозия',      // 简化为核心词"коррозия"
        ar: 'تآكل',          // 简化为核心词"تآكل"
        es: 'corrosión',     // 简化为核心词"corrosión"
        fr: 'corrosion',     // 简化为核心词"corrosion"
        pt: 'corrosão',      // 简化为核心词"corrosão"
        hi: 'जंग',           // 简化为核心词"जंग"
        de: 'Korrosion'      // 简化为核心词"Korrosion"
    },
    'steel-pipes': {
        cn: '钢管',          // 简化为核心词"钢管"
        en: 'steel',         // 简化为核心词"steel"
        jp: '鋼管',          // 简化为核心词"鋼管"
        ru: 'сталь',         // 简化为核心词"сталь"
        ar: 'فولاذ',         // 简化为核心词"فولاذ"
        es: 'acero',         // 简化为核心词"acero"
        fr: 'acier',         // 简化为核心词"acier"
        pt: 'aço',           // 简化为核心词"aço"
        hi: 'इस्पात',       // 简化为核心词"इस्पात"
        de: 'Stahl'          // 简化为核心词"Stahl"
    },
    'pipe-fittings': {
        cn: '管件',          // 简化为核心词"管件"
        en: 'fitting',       // 简化为核心词"fitting"
        jp: '管継手',        // 更准确的"管継手"
        ru: 'арматура',      // 简化为核心词"арматура"
        ar: 'تجهيزات',      // 简化为核心词"تجهيزات"
        es: 'accesorio',     // 简化为核心词"accesorio"
        fr: 'raccord',       // 简化为核心词"raccord"
        pt: 'acessório',     // 简化为核心词"acessório"
        hi: 'फिटिंग',       // 简化为核心词"फिटिंग"
        de: 'Verschraubung'  // 更准确的技术术语"Verschraubung"
    }
};

/**
 * 获取指定语言和类别的简化搜索关键词
 * @param {string} categoryId 类别ID
 * @param {string} lang 语言代码
 * @returns {string} 简化的搜索关键词
 */
function getSimplifiedKeyword(categoryId, lang) {
    const keywords = SIMPLIFIED_PRODUCT_KEYWORDS[categoryId];
    if (!keywords) return categoryId;
    return keywords[lang] || keywords.en || categoryId;
}

// 多语言配置
const languages = {
  cn: {
    folder: 'cn',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  en: {
    folder: 'en',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  jp: {
    folder: 'jp',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  ru: {
    folder: 'ru',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  ar: {
    folder: 'ar',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  es: {
    folder: 'es',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  fr: {
    folder: 'fr',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  pt: {
    folder: 'pt',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  hi: {
    folder: 'hi',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../de/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Deutsch</a>'
    ]
  },
  de: {
    folder: 'de',
    hreflangs: [
      'link rel="alternate" hreflang="zh-CN" href="https://hengjitaipipeline.com/cn/products.html" /',
      'link rel="alternate" hreflang="x-default" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="en" href="https://hengjitaipipeline.com/en/products.html" /',
      'link rel="alternate" hreflang="ja" href="https://hengjitaipipeline.com/jp/products.html" /',
      'link rel="alternate" hreflang="ru" href="https://hengjitaipipeline.com/ru/products.html" /',
      'link rel="alternate" hreflang="ar" href="https://hengjitaipipeline.com/ar/products.html" /',
      'link rel="alternate" hreflang="es" href="https://hengjitaipipeline.com/es/products.html" /',
      'link rel="alternate" hreflang="fr" href="https://hengjitaipipeline.com/fr/products.html" /',
      'link rel="alternate" hreflang="pt" href="https://hengjitaipipeline.com/pt/products.html" /',
      'link rel="alternate" hreflang="hi" href="https://hengjitaipipeline.com/hi/products.html" /',
      'link rel="alternate" hreflang="de" href="https://hengjitaipipeline.com/de/products.html" /'
    ],
    languageMenuItems: [
      'a href="../cn/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">简体中文</a>',
      'a href="../en/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">English</a>',
      'a href="../jp/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">日本語</a>',
      'a href="../ru/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Русский</a>',
      'a href="../ar/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">العربية</a>',
      'a href="../es/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Español</a>',
      'a href="../fr/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Français</a>',
      'a href="../pt/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">Português</a>',
      'a href="../hi/products.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5">हिन्दी</a>'
    ]
  }
};

// 内嵌翻译数据
const translations = {
  cn: {
    "LANG_CODE": "zh-CN",
    "COMPANY_NAME": "沧州恒基泰管道装备有限公司",
    "COMPANY_NAME_SHORT": "恒基泰管道装备",
    "PAGE_TITLE": "产品中心",
    "META_DESCRIPTION": "沧州恒基泰管道装备有限公司专业生产涂塑钢管、防腐钢管及管件系列产品，品质优良，规格齐全。",
    "META_KEYWORDS": "涂塑钢管,防腐钢管,钢管产品,管件配件",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/cn/products.html",
    "CURRENT_LANGUAGE": "简体中文",
    "NAV_HOME": "首页",
    "NAV_ABOUT": "关于我们",
    "NAV_ABOUT_COMPANY": "公司简介",
    "NAV_ABOUT_CULTURE": "企业文化",
    "NAV_ABOUT_CERTIFICATES": "资质认证",
    "NAV_ABOUT_FACTORY": "工厂实验室",
    "NAV_PRODUCTS": "产品中心",
    "NAV_PRODUCTS_PLASTIC_COATING": "涂塑钢管",
    "NAV_PRODUCTS_ANTI_CORROSION": "防腐钢管",
    "NAV_PRODUCTS_STEEL_PIPES": "钢管产品",
    "NAV_PRODUCTS_PIPE_FITTINGS": "管件配件",
    "NAV_QUALITY": "质量控制",
    "NAV_CASES": "工程案例",
    "NAV_NEWS": "新闻动态",
    "NAV_CONTACT": "联系我们",
    "VIEW_CATEGORIES": "分类视图",
    "VIEW_PRODUCTS": "产品列表",
    "FILTER_ALL_CATEGORIES": "所有分类",
    "SEARCH_PLACEHOLDER": "搜索产品...",
    "PRODUCTS_COUNT_SUFFIX": "个产品",
    "FILTER_CATEGORY_LABEL": "分类",
    "FILTER_SEARCH_LABEL": "搜索",
    "FILTER_FOUND_LABEL": "找到",
    "FILTER_PRODUCTS_LABEL": "个产品",
    "FILTER_CLEAR_LABEL": "清除筛选",
    "BUTTON_VIEW_DETAILS": "查看详情",
    "PAGINATION_PREV": "上一页",
    "PAGINATION_NEXT": "下一页",
    "MODAL_CLOSE_TITLE": "关闭详情",
    "MODAL_SPECIFICATION_TITLE": "产品规格",
    "MODAL_APPLICATIONS_TITLE": "应用领域",
    "MODAL_FEATURES_TITLE": "产品特性",
    "MODAL_CONNECTION_TITLE": "连接类型",
    "MODAL_DESCRIPTION_TITLE": "产品描述",
    "IMAGE_VIEWER_HINT": "点击任意位置或按ESC关闭",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "点击关闭",
    "IMAGE_VIEWER_CLOSE_TITLE": "关闭图片查看器 (ESC)",
    "FOOTER_ABOUT_TITLE": "关于我们",
    "FOOTER_ABOUT_TEXT": "沧州恒基泰管道装备有限公司成立于2026年，是一家专注于管道装备、钢制管件、管托支吊架和防腐管件配套供应的企业。",
    "FOOTER_QUICK_LINKS": "快速导航",
    "FOOTER_PRODUCTS_TITLE": "产品中心",
    "FOOTER_CONTACT_TITLE": "联系我们",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 沧州恒基泰管道装备有限公司 版权所有"
  },
  en: {
    "LANG_CODE": "en",
    "COMPANY_NAME": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "COMPANY_NAME_SHORT": "Hengjitai Pipeline Equipment",
    "PAGE_TITLE": "Products",
    "META_DESCRIPTION": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd. specializes in producing plastic-coated steel pipes, anti-corrosion steel pipes and pipe fittings with excellent quality and complete specifications.",
    "META_KEYWORDS": "plastic coated steel pipes,anti-corrosion steel pipes,steel pipe products,pipe fittings",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/en/products.html",
    "CURRENT_LANGUAGE": "English",
    "NAV_HOME": "Home",
    "NAV_ABOUT": "About Us",
    "NAV_ABOUT_COMPANY": "Company Profile",
    "NAV_ABOUT_CULTURE": "Corporate Culture",
    "NAV_ABOUT_CERTIFICATES": "Certifications",
    "NAV_ABOUT_FACTORY": "Factory & Lab",
    "NAV_PRODUCTS": "Products",
    "NAV_PRODUCTS_PLASTIC_COATING": "Plastic Coated Pipes",
    "NAV_PRODUCTS_ANTI_CORROSION": "Anti-Corrosion Pipes",
    "NAV_PRODUCTS_STEEL_PIPES": "Steel Pipes",
    "NAV_PRODUCTS_PIPE_FITTINGS": "Pipe Fittings",
    "NAV_QUALITY": "Quality Control",
    "NAV_CASES": "Case Studies",
    "NAV_NEWS": "News",
    "NAV_CONTACT": "Contact Us",
    "VIEW_CATEGORIES": "Category View",
    "VIEW_PRODUCTS": "Product List",
    "FILTER_ALL_CATEGORIES": "All Categories",
    "SEARCH_PLACEHOLDER": "Search products...",
    "PRODUCTS_COUNT_SUFFIX": " products",
    "FILTER_CATEGORY_LABEL": "Category",
    "FILTER_SEARCH_LABEL": "Search",
    "FILTER_FOUND_LABEL": "Found",
    "FILTER_PRODUCTS_LABEL": " products",
    "FILTER_CLEAR_LABEL": "Clear Filters",
    "BUTTON_VIEW_DETAILS": "View Details",
    "PAGINATION_PREV": "Previous",
    "PAGINATION_NEXT": "Next",
    "MODAL_CLOSE_TITLE": "Close Details",
    "MODAL_SPECIFICATION_TITLE": "Specifications",
    "MODAL_APPLICATIONS_TITLE": "Applications",
    "MODAL_FEATURES_TITLE": "Features",
    "MODAL_CONNECTION_TITLE": "Connection Type",
    "MODAL_DESCRIPTION_TITLE": "Description",
    "IMAGE_VIEWER_HINT": "Click anywhere or press ESC to close",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "Click to close",
    "IMAGE_VIEWER_CLOSE_TITLE": "Close image viewer (ESC)",
    "FOOTER_ABOUT_TITLE": "About Us",
    "FOOTER_ABOUT_TEXT": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd. was established in 2026. It focuses on supplying pipeline equipment, steel pipe fittings, pipe supports and hangers, and anti-corrosion fittings for engineering projects.",
    "FOOTER_QUICK_LINKS": "Quick Links",
    "FOOTER_PRODUCTS_TITLE": "Products",
    "FOOTER_CONTACT_TITLE": "Contact Us",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. All Rights Reserved"
  },
  jp: {
    "LANG_CODE": "ja",
    "COMPANY_NAME": "恒基泰管道設備有限公司",
    "COMPANY_NAME_SHORT": "恒基泰管道設備",
    "PAGE_TITLE": "製品情報",
    "META_DESCRIPTION": "恒基泰管道設備有限公司は、プラスチック被覆鋼管、防食鋼管、および配管継手の専門メーカーです。優れた品質と豊富な仕様で、お客様のニーズにお応えします。",
    "META_KEYWORDS": "プラスチック被覆鋼管,防食鋼管,鋼管製品,配管継手",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/jp/products.html",
    "CURRENT_LANGUAGE": "日本語",
    "NAV_HOME": "ホーム",
    "NAV_ABOUT": "会社案内",
    "NAV_ABOUT_COMPANY": "会社概要",
    "NAV_ABOUT_CULTURE": "企業理念",
    "NAV_ABOUT_CERTIFICATES": "認証・資格",
    "NAV_ABOUT_FACTORY": "工場・研究所",
    "NAV_PRODUCTS": "製品情報",
    "NAV_PRODUCTS_PLASTIC_COATING": "プラスチック被覆鋼管",
    "NAV_PRODUCTS_ANTI_CORROSION": "防食鋼管",
    "NAV_PRODUCTS_STEEL_PIPES": "鋼管製品",
    "NAV_PRODUCTS_PIPE_FITTINGS": "配管継手",
    "NAV_QUALITY": "品質保証",
    "NAV_CASES": "導入事例",
    "NAV_NEWS": "お知らせ",
    "NAV_CONTACT": "お問い合わせ",
    "VIEW_CATEGORIES": "カテゴリー表示",
    "VIEW_PRODUCTS": "製品一覧",
    "FILTER_ALL_CATEGORIES": "全カテゴリー",
    "SEARCH_PLACEHOLDER": "製品を検索...",
    "PRODUCTS_COUNT_SUFFIX": "件の製品",
    "FILTER_CATEGORY_LABEL": "カテゴリー",
    "FILTER_SEARCH_LABEL": "検索",
    "FILTER_FOUND_LABEL": "検索結果",
    "FILTER_PRODUCTS_LABEL": "件の製品",
    "FILTER_CLEAR_LABEL": "条件をクリア",
    "BUTTON_VIEW_DETAILS": "詳細を見る",
    "PAGINATION_PREV": "前へ",
    "PAGINATION_NEXT": "次へ",
    "MODAL_CLOSE_TITLE": "詳細を閉じる",
    "MODAL_SPECIFICATION_TITLE": "製品仕様",
    "MODAL_APPLICATIONS_TITLE": "適用分野",
    "MODAL_FEATURES_TITLE": "製品特長",
    "MODAL_CONNECTION_TITLE": "接続方式",
    "MODAL_DESCRIPTION_TITLE": "製品説明",
    "IMAGE_VIEWER_HINT": "画面をクリックまたはESCキーで閉じる",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "クリックで閉じる",
    "IMAGE_VIEWER_CLOSE_TITLE": "画像ビューアを閉じる (ESC)",
    "FOOTER_ABOUT_TITLE": "会社案内",
    "FOOTER_ABOUT_TEXT": "恒基泰管道設備有限公司は2026年に設立され、配管設備・鋼製継手・管托・支吊架および防食継手などの工程配套製品の供給を専門とする企業です。",
    "FOOTER_QUICK_LINKS": "クイックリンク",
    "FOOTER_PRODUCTS_TITLE": "製品情報",
    "FOOTER_CONTACT_TITLE": "お問い合わせ",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 恒基泰管道設備有限公司 無断転載禁止"
  },
  ru: {
    "LANG_CODE": "ru",
    "COMPANY_NAME": "Цанчжоу Хэнцзитай Трубопроводное Оборудование",
    "COMPANY_NAME_SHORT": "Хэнцзитай Промышленная",
    "PAGE_TITLE": "Продукция",
    "META_DESCRIPTION": "Цанчжоу Хэнцзитай Трубопроводное Оборудование специализируется на производстве стальных труб с полимерным покрытием, антикоррозионных стальных труб и трубной арматуры высокого качества.",
    "META_KEYWORDS": "стальные трубы с полимерным покрытием,антикоррозионные стальные трубы,трубная арматура,промышленные трубы",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/ru/products.html",
    "CURRENT_LANGUAGE": "Русский",
    "NAV_HOME": "Главная",
    "NAV_ABOUT": "О компании",
    "NAV_ABOUT_COMPANY": "О компании",
    "NAV_ABOUT_CULTURE": "Корпоративная культура",
    "NAV_ABOUT_CERTIFICATES": "Сертификаты и награды",
    "NAV_ABOUT_FACTORY": "Производство и лаборатория",
    "NAV_PRODUCTS": "Продукция",
    "NAV_PRODUCTS_PLASTIC_COATING": "Трубы с полимерным покрытием",
    "NAV_PRODUCTS_ANTI_CORROSION": "Антикоррозионные трубы",
    "NAV_PRODUCTS_STEEL_PIPES": "Стальные трубы",
    "NAV_PRODUCTS_PIPE_FITTINGS": "Трубная арматура",
    "NAV_QUALITY": "Контроль качества",
    "NAV_CASES": "Наши проекты",
    "NAV_NEWS": "Новости",
    "NAV_CONTACT": "Контакты",
    "VIEW_CATEGORIES": "Просмотр по категориям",
    "VIEW_PRODUCTS": "Список продукции",
    "FILTER_ALL_CATEGORIES": "Все категории",
    "SEARCH_PLACEHOLDER": "Поиск продукции...",
    "PRODUCTS_COUNT_SUFFIX": " позиций",
    "FILTER_CATEGORY_LABEL": "Категория",
    "FILTER_SEARCH_LABEL": "Поиск",
    "FILTER_FOUND_LABEL": "Найдено",
    "FILTER_PRODUCTS_LABEL": " позиций",
    "FILTER_CLEAR_LABEL": "Сбросить фильтры",
    "BUTTON_VIEW_DETAILS": "Подробнее",
    "PAGINATION_PREV": "Предыдущая",
    "PAGINATION_NEXT": "Следующая",
    "MODAL_CLOSE_TITLE": "Закрыть",
    "MODAL_SPECIFICATION_TITLE": "Технические характеристики",
    "MODAL_APPLICATIONS_TITLE": "Области применения",
    "MODAL_FEATURES_TITLE": "Особенности продукции",
    "MODAL_CONNECTION_TITLE": "Тип соединения",
    "MODAL_DESCRIPTION_TITLE": "Описание продукции",
    "IMAGE_VIEWER_HINT": "Нажмите в любом месте или нажмите ESC для закрытия",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "Нажмите, чтобы закрыть",
    "IMAGE_VIEWER_CLOSE_TITLE": "Закрыть просмотрщик изображений (ESC)",
    "FOOTER_ABOUT_TITLE": "О компании",
    "FOOTER_ABOUT_TEXT": "Компания основана в 2026 году и специализируется на поставках трубопроводного оборудования, стальных фитингов, опор и подвесок для труб, а также антикоррозионной арматуры для инженерных объектов.",
    "FOOTER_QUICK_LINKS": "Быстрая навигация",
    "FOOTER_PRODUCTS_TITLE": "Продукция",
    "FOOTER_CONTACT_TITLE": "Контакты",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 Цанчжоу Хэнцзитай Трубопроводное Оборудование. Все права защищены"
  },
  ar: {
    "LANG_CODE": "ar",
    "COMPANY_NAME": "شركة هيبي هينغجيتاي لمعدات خطوط الأنابيب المحدودة",
    "COMPANY_NAME_SHORT": "هينغجيتاي لمعدات خطوط الأنابيب",
    "PAGE_TITLE": "المنتجات",
    "META_DESCRIPTION": "تتخصص شركة هيبي هينغجيتاي لمعدات خطوط الأنابيب المحدودة في تصنيع أنابيب فولاذية عالية الجودة مغلفة بالبوليمر وأنابيب فولاذية مقاومة للتآكل وتجهيزات الأنابيب.",
    "META_KEYWORDS": "أنابيب فولاذية مغلفة بالبوليمر،أنابيب فولاذية مقاومة للتآكل،تجهيزات الأنابيب،خطوط الأنابيب الصناعية",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/ar/products.html",
    "CURRENT_LANGUAGE": "العربية",
    "NAV_HOME": "الرئيسية",
    "NAV_ABOUT": "عن الشركة",
    "NAV_ABOUT_COMPANY": "نبذة عن الشركة",
    "NAV_ABOUT_CULTURE": "ثقافة الشركة",
    "NAV_ABOUT_CERTIFICATES": "الشهادات والتراخيص",
    "NAV_ABOUT_FACTORY": "المصنع والمختبر",
    "NAV_PRODUCTS": "المنتجات",
    "NAV_PRODUCTS_PLASTIC_COATING": "أنابيب مغلفة بالبوليمر",
    "NAV_PRODUCTS_ANTI_CORROSION": "أنابيب مقاومة للتآكل",
    "NAV_PRODUCTS_STEEL_PIPES": "أنابيب فولاذية",
    "NAV_PRODUCTS_PIPE_FITTINGS": "تجهيزات الأنابيب",
    "NAV_QUALITY": "ضمان الجودة",
    "NAV_CASES": "المشاريع المنجزة",
    "NAV_NEWS": "الأخبار",
    "NAV_CONTACT": "تواصل معنا",
    "VIEW_CATEGORIES": "عرض الفئات",
    "VIEW_PRODUCTS": "قائمة المنتجات",
    "FILTER_ALL_CATEGORIES": "جميع الفئات",
    "SEARCH_PLACEHOLDER": "البحث في المنتجات...",
    "PRODUCTS_COUNT_SUFFIX": " منتجات",
    "FILTER_CATEGORY_LABEL": "الفئة",
    "FILTER_SEARCH_LABEL": "البحث",
    "FILTER_FOUND_LABEL": "تم العثور على",
    "FILTER_PRODUCTS_LABEL": " منتجات",
    "FILTER_CLEAR_LABEL": "إزالة التصفية",
    "BUTTON_VIEW_DETAILS": "عرض التفاصيل",
    "PAGINATION_PREV": "السابق",
    "PAGINATION_NEXT": "التالي",
    "MODAL_CLOSE_TITLE": "إغلاق",
    "MODAL_SPECIFICATION_TITLE": "المواصفات الفنية",
    "MODAL_APPLICATIONS_TITLE": "مجالات التطبيق",
    "MODAL_FEATURES_TITLE": "مميزات المنتج",
    "MODAL_CONNECTION_TITLE": "نوع التوصيل",
    "MODAL_DESCRIPTION_TITLE": "وصف المنتج",
    "IMAGE_VIEWER_HINT": "انقر في أي مكان أو اضغط ESC للإغلاق",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "انقر للإغلاق",
    "IMAGE_VIEWER_CLOSE_TITLE": "إغلاق عارض الصور (ESC)",
    "FOOTER_ABOUT_TITLE": "عن الشركة",
    "FOOTER_ABOUT_TEXT": "تأسست شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة عام 2026، وهي متخصصة في توريد معدات خطوط الأنابيب وتجهيزات الفولاذ ودعامات ومعلِّقات الأنابيب وتجهيزات مكافحة التآكل لمشاريع الهندسة.",
    "FOOTER_QUICK_LINKS": "روابط سريعة",
    "FOOTER_PRODUCTS_TITLE": "المنتجات",
    "FOOTER_CONTACT_TITLE": "تواصل معنا",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 شركة هيبي هينغجيتاي لمعدات خطوط الأنابيب المحدودة. جميع الحقوق محفوظة"
  },
  es: {
    "LANG_CODE": "es",
    "COMPANY_NAME": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "COMPANY_NAME_SHORT": "Hengjitai Pipeline Equipment",
    "PAGE_TITLE": "Productos",
    "META_DESCRIPTION": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd. se especializa en la producción de tubos de acero recubiertos de polímero, tubos de acero anticorrosivos y accesorios de tuberías con excelente calidad y especificaciones completas.",
    "META_KEYWORDS": "tubos de acero recubiertos de polímero,tubos de acero anticorrosivos,productos de tubos de acero,accesorios de tuberías",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/es/products.html",
    "CURRENT_LANGUAGE": "Español",
    "NAV_HOME": "Inicio",
    "NAV_ABOUT": "Acerca de nosotros",
    "NAV_ABOUT_COMPANY": "Perfil de la empresa",
    "NAV_ABOUT_CULTURE": "Cultura corporativa",
    "NAV_ABOUT_CERTIFICATES": "Certificaciones",
    "NAV_ABOUT_FACTORY": "Fábrica y laboratorio",
    "NAV_PRODUCTS": "Productos",
    "NAV_PRODUCTS_PLASTIC_COATING": "Tubos recubiertos de polímero",
    "NAV_PRODUCTS_ANTI_CORROSION": "Tubos anticorrosivos",
    "NAV_PRODUCTS_STEEL_PIPES": "Tubos de acero",
    "NAV_PRODUCTS_PIPE_FITTINGS": "Accesorios de tuberías",
    "NAV_QUALITY": "Control de calidad",
    "NAV_CASES": "Casos de estudio",
    "NAV_NEWS": "Noticias",
    "NAV_CONTACT": "Contactar",
    "VIEW_CATEGORIES": "Vista de categorías",
    "VIEW_PRODUCTS": "Lista de productos",
    "FILTER_ALL_CATEGORIES": "Todas las categorías",
    "SEARCH_PLACEHOLDER": "Buscar productos...",
    "PRODUCTS_COUNT_SUFFIX": " productos",
    "FILTER_CATEGORY_LABEL": "Categoría",
    "FILTER_SEARCH_LABEL": "Buscar",
    "FILTER_FOUND_LABEL": "Encontrado",
    "FILTER_PRODUCTS_LABEL": " productos",
    "FILTER_CLEAR_LABEL": "Limpiar filtros",
    "BUTTON_VIEW_DETAILS": "Ver detalles",
    "PAGINATION_PREV": "Anterior",
    "PAGINATION_NEXT": "Siguiente",
    "MODAL_CLOSE_TITLE": "Cerrar detalles",
    "MODAL_SPECIFICATION_TITLE": "Especificaciones técnicas",
    "MODAL_APPLICATIONS_TITLE": "Áreas de aplicación",
    "MODAL_FEATURES_TITLE": "Características del producto",
    "MODAL_CONNECTION_TITLE": "Tipo de conexión",
    "MODAL_DESCRIPTION_TITLE": "Descripción del producto",
    "IMAGE_VIEWER_HINT": "Haga clic en cualquier lugar o presione ESC para cerrar",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "Haga clic para cerrar",
    "IMAGE_VIEWER_CLOSE_TITLE": "Cerrar visor de imágenes (ESC)",
    "FOOTER_ABOUT_TITLE": "Acerca de nosotros",
    "FOOTER_ABOUT_TEXT": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd. se fundó en 2026 y se centra en el suministro de equipos de tuberías, accesorios de acero, soportes y colgadores para tuberías, y accesorios anticorrosión para proyectos de ingeniería.",
    "FOOTER_QUICK_LINKS": "Enlaces rápidos",
    "FOOTER_PRODUCTS_TITLE": "Productos",
    "FOOTER_CONTACT_TITLE": "Contactar",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Todos los derechos reservados"
  },
  fr: {
    "LANG_CODE": "fr",
    "COMPANY_NAME": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "COMPANY_NAME_SHORT": "Hengjitai Pipeline Equipment",
    "PAGE_TITLE": "Produits",
    "META_DESCRIPTION": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd. se spécialise dans la production de tubes en acier revêtus de polymère, tubes en acier anticorrosion et raccords de canalisations avec une excellente qualité et des spécifications complètes.",
    "META_KEYWORDS": "tubes en acier revêtus de polymère,tubes en acier anticorrosion,produits de tubes en acier,raccords de canalisations",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/fr/products.html",
    "CURRENT_LANGUAGE": "Français",
    "NAV_HOME": "Accueil",
    "NAV_ABOUT": "À propos de nous",
    "NAV_ABOUT_COMPANY": "Profil de l'entreprise",
    "NAV_ABOUT_CULTURE": "Culture d'entreprise",
    "NAV_ABOUT_CERTIFICATES": "Certifications",
    "NAV_ABOUT_FACTORY": "Usine et laboratoire",
    "NAV_PRODUCTS": "Produits",
    "NAV_PRODUCTS_PLASTIC_COATING": "Tubes revêtus de polymère",
    "NAV_PRODUCTS_ANTI_CORROSION": "Tubes anticorrosion",
    "NAV_PRODUCTS_STEEL_PIPES": "Tubes en acier",
    "NAV_PRODUCTS_PIPE_FITTINGS": "Raccords de canalisations",
    "NAV_QUALITY": "Contrôle qualité",
    "NAV_CASES": "Études de cas",
    "NAV_NEWS": "Actualités",
    "NAV_CONTACT": "Nous contacter",
    "VIEW_CATEGORIES": "Vue par catégories",
    "VIEW_PRODUCTS": "Liste des produits",
    "FILTER_ALL_CATEGORIES": "Toutes les catégories",
    "SEARCH_PLACEHOLDER": "Rechercher des produits...",
    "PRODUCTS_COUNT_SUFFIX": " produits",
    "FILTER_CATEGORY_LABEL": "Catégorie",
    "FILTER_SEARCH_LABEL": "Rechercher",
    "FILTER_FOUND_LABEL": "Trouvé",
    "FILTER_PRODUCTS_LABEL": " produits",
    "FILTER_CLEAR_LABEL": "Effacer les filtres",
    "BUTTON_VIEW_DETAILS": "Voir les détails",
    "PAGINATION_PREV": "Précédent",
    "PAGINATION_NEXT": "Suivant",
    "MODAL_CLOSE_TITLE": "Fermer les détails",
    "MODAL_SPECIFICATION_TITLE": "Spécifications techniques",
    "MODAL_APPLICATIONS_TITLE": "Domaines d'application",
    "MODAL_FEATURES_TITLE": "Caractéristiques du produit",
    "MODAL_CONNECTION_TITLE": "Type de raccordement",
    "MODAL_DESCRIPTION_TITLE": "Description du produit",
    "IMAGE_VIEWER_HINT": "Cliquez n'importe où ou appuyez sur ESC pour fermer",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "Cliquez pour fermer",
    "IMAGE_VIEWER_CLOSE_TITLE": "Fermer la visionneuse d'images (ESC)",
    "FOOTER_ABOUT_TITLE": "À propos de nous",
    "FOOTER_ABOUT_TEXT": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd. a été créée en 2026. Elle se spécialise dans l'approvisionnement en équipements de tuyauterie, raccords en acier, supports et suspentes pour tuyauteries, et raccords anticorrosion pour projets d'ingénierie.",
    "FOOTER_QUICK_LINKS": "Liens rapides",
    "FOOTER_PRODUCTS_TITLE": "Produits",
    "FOOTER_CONTACT_TITLE": "Nous contacter",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Tous droits réservés"
  },
  pt: {
    "LANG_CODE": "pt",
    "COMPANY_NAME": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "COMPANY_NAME_SHORT": "Hengjitai Pipeline Equipment",
    "PAGE_TITLE": "Produtos",
    "META_DESCRIPTION": "A Cangzhou Hengjitai Pipeline Equipment Co., Ltd. é especializada na produção de tubos de aço revestidos com polímero, tubos de aço anticorrosão e acessórios de tubulação com excelente qualidade e especificações completas.",
    "META_KEYWORDS": "tubos de aço revestidos com polímero,tubos de aço anticorrosão,produtos de tubos de aço,acessórios de tubulação",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/pt/products.html",
    "CURRENT_LANGUAGE": "Português",
    "NAV_HOME": "Início",
    "NAV_ABOUT": "Sobre nós",
    "NAV_ABOUT_COMPANY": "Perfil da empresa",
    "NAV_ABOUT_CULTURE": "Cultura corporativa",
    "NAV_ABOUT_CERTIFICATES": "Certificações",
    "NAV_ABOUT_FACTORY": "Fábrica e laboratório",
    "NAV_PRODUCTS": "Produtos",
    "NAV_PRODUCTS_PLASTIC_COATING": "Tubos revestidos com polímero",
    "NAV_PRODUCTS_ANTI_CORROSION": "Tubos anticorrosão",
    "NAV_PRODUCTS_STEEL_PIPES": "Tubos de aço",
    "NAV_PRODUCTS_PIPE_FITTINGS": "Acessórios de tubulação",
    "NAV_QUALITY": "Controle de qualidade",
    "NAV_CASES": "Estudos de caso",
    "NAV_NEWS": "Notícias",
    "NAV_CONTACT": "Entre em contato",
    "VIEW_CATEGORIES": "Visualização por categorias",
    "VIEW_PRODUCTS": "Lista de produtos",
    "FILTER_ALL_CATEGORIES": "Todas as categorias",
    "SEARCH_PLACEHOLDER": "Pesquisar produtos...",
    "PRODUCTS_COUNT_SUFFIX": " produtos",
    "FILTER_CATEGORY_LABEL": "Categoria",
    "FILTER_SEARCH_LABEL": "Pesquisar",
    "FILTER_FOUND_LABEL": "Encontrado",
    "FILTER_PRODUCTS_LABEL": " produtos",
    "FILTER_CLEAR_LABEL": "Limpar filtros",
    "BUTTON_VIEW_DETAILS": "Ver detalhes",
    "PAGINATION_PREV": "Anterior",
    "PAGINATION_NEXT": "Próximo",
    "MODAL_CLOSE_TITLE": "Fechar detalhes",
    "MODAL_SPECIFICATION_TITLE": "Especificações técnicas",
    "MODAL_APPLICATIONS_TITLE": "Áreas de aplicação",
    "MODAL_FEATURES_TITLE": "Características do produto",
    "MODAL_CONNECTION_TITLE": "Tipo de conexão",
    "MODAL_DESCRIPTION_TITLE": "Descrição do produto",
    "IMAGE_VIEWER_HINT": "Clique em qualquer lugar ou pressione ESC para fechar",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "Clique para fechar",
    "IMAGE_VIEWER_CLOSE_TITLE": "Fechar visualizador de imagens (ESC)",
    "FOOTER_ABOUT_TITLE": "Sobre nós",
    "FOOTER_ABOUT_TEXT": "A Cangzhou Hengjitai Pipeline Equipment Co., Ltd. foi fundada em 2026 e foca no fornecimento de equipamentos de tubulação, conexões de aço, suportes e suspensões para tubulações, e conexões anticorrosão para projetos de engenharia.",
    "FOOTER_QUICK_LINKS": "Links rápidos",
    "FOOTER_PRODUCTS_TITLE": "Produtos",
    "FOOTER_CONTACT_TITLE": "Entre em contato",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Todos os direitos reservados"
  },
  hi: {
    "LANG_CODE": "hi",
    "COMPANY_NAME": "हेबई कांगझोउ हेंगजिताई कंपनी लिमिटेड",
    "COMPANY_NAME_SHORT": "कांगझोउ हेंगजिताई",
    "PAGE_TITLE": "उत्पाद",
    "META_DESCRIPTION": "हेबई कांगझोउ हेंगजिताई कंपनी लिमिटेड पॉलिमर कोटेड स्टील पाइप, संक्षारण प्रतिरोधी स्टील पाइप और पाइप फिटिंग के उत्पादन में विशेषज्ञता रखती है, उत्कृष्ट गुणवत्ता और पूर्ण विशिष्टताओं के साथ।",
    "META_KEYWORDS": "पॉलिमर कोटेड स्टील पाइप,संक्षारण प्रतिरोधी स्टील पाइप,स्टील पाइप उत्पाद,पाइप फिटिंग",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/hi/products.html",
    "CURRENT_LANGUAGE": "हिन्दी",
    "NAV_HOME": "मुख्य पृष्ठ",
    "NAV_ABOUT": "हमारे बारे में",
    "NAV_ABOUT_COMPANY": "कंपनी प्रोफाइल",
    "NAV_ABOUT_CULTURE": "कॉर्पोरेट संस्कृति",
    "NAV_ABOUT_CERTIFICATES": "प्रमाणपत्र",
    "NAV_ABOUT_FACTORY": "कारखाना और प्रयोगशाला",
    "NAV_PRODUCTS": "उत्पाद",
    "NAV_PRODUCTS_PLASTIC_COATING": "पॉलिमर कोटेड पाइप",
    "NAV_PRODUCTS_ANTI_CORROSION": "संक्षारण प्रतिरोधी पाइप",
    "NAV_PRODUCTS_STEEL_PIPES": "स्टील पाइप",
    "NAV_PRODUCTS_PIPE_FITTINGS": "पाइप फिटिंग",
    "NAV_QUALITY": "गुणवत्ता नियंत्रण",
    "NAV_CASES": "परियोजना अध्ययन",
    "NAV_NEWS": "समाचार",
    "NAV_CONTACT": "संपर्क करें",
    "VIEW_CATEGORIES": "श्रेणी दृश्य",
    "VIEW_PRODUCTS": "उत्पाद सूची",
    "FILTER_ALL_CATEGORIES": "सभी श्रेणियां",
    "SEARCH_PLACEHOLDER": "उत्पाद खोजें...",
    "PRODUCTS_COUNT_SUFFIX": " उत्पाद",
    "FILTER_CATEGORY_LABEL": "श्रेणी",
    "FILTER_SEARCH_LABEL": "खोजें",
    "FILTER_FOUND_LABEL": "मिला",
    "FILTER_PRODUCTS_LABEL": " उत्पाद",
    "FILTER_CLEAR_LABEL": "फिल्टर हटाएं",
    "BUTTON_VIEW_DETAILS": "विवरण देखें",
    "PAGINATION_PREV": "पिछला",
    "PAGINATION_NEXT": "अगला",
    "MODAL_CLOSE_TITLE": "विवरण बंद करें",
    "MODAL_SPECIFICATION_TITLE": "तकनीकी विशिष्टताएं",
    "MODAL_APPLICATIONS_TITLE": "अनुप्रयोग क्षेत्र",
    "MODAL_FEATURES_TITLE": "उत्पाद विशेषताएं",
    "MODAL_CONNECTION_TITLE": "कनेक्शन प्रकार",
    "MODAL_DESCRIPTION_TITLE": "उत्पाद विवरण",
    "IMAGE_VIEWER_HINT": "बंद करने के लिए कहीं भी क्लिक करें या ESC दबाएं",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "बंद करने के लिए क्लिक करें",
    "IMAGE_VIEWER_CLOSE_TITLE": "छवि दर्शक बंद करें (ESC)",
    "FOOTER_ABOUT_TITLE": "हमारे बारे में",
    "FOOTER_ABOUT_TEXT": "कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड की स्थापना 2026 में हुई; यह पाइपलाइन उपकरण, स्टील पाइप फिटिंग्स, पाइप सपोर्ट व हैंगर, और इंजीनियरिंग परियोजनाओं के लिए एंटी-कोरोज़न फिटिंग्स की आपूर्ति पर केंद्रित है।",
    "FOOTER_QUICK_LINKS": "त्वरित लिंक",
    "FOOTER_PRODUCTS_TITLE": "उत्पाद",
    "FOOTER_CONTACT_TITLE": "संपर्क करें",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 हेबई कांगझोउ हेंगजिताई कंपनी लिमिटेड। सभी अधिकार सुरक्षित"
  },
  de: {
    "LANG_CODE": "de",
    "COMPANY_NAME": "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
    "COMPANY_NAME_SHORT": "Hengjitai Pipeline Equipment",
    "PAGE_TITLE": "Produkte",
    "META_DESCRIPTION": "Die Cangzhou Hengjitai Pipeline Equipment Co., Ltd. ist spezialisiert auf die Herstellung hochwertiger kunststoffbeschichteter Stahlrohre, korrosionsbeständiger Stahlrohre und Rohrverschraubungen mit hervorragender Qualität und vollständigen Spezifikationen.",
    "META_KEYWORDS": "kunststoffbeschichtete Stahlrohre,korrosionsbeständige Stahlrohre,Stahlrohrprodukte,Rohrverschraubungen",
    "CANONICAL_URL": "https://www.hengjitaipipeline.com/de/products.html",
    "CURRENT_LANGUAGE": "Deutsch",
    "NAV_HOME": "Startseite",
    "NAV_ABOUT": "Über uns",
    "NAV_ABOUT_COMPANY": "Unternehmensprofil",
    "NAV_ABOUT_CULTURE": "Unternehmenskultur",
    "NAV_ABOUT_CERTIFICATES": "Zertifikate und Auszeichnungen",
    "NAV_ABOUT_FACTORY": "Werk und Labor",
    "NAV_PRODUCTS": "Produkte",
    "NAV_PRODUCTS_PLASTIC_COATING": "Kunststoffbeschichtete Rohre",
    "NAV_PRODUCTS_ANTI_CORROSION": "Korrosionsbeständige Rohre",
    "NAV_PRODUCTS_STEEL_PIPES": "Stahlrohre",
    "NAV_PRODUCTS_PIPE_FITTINGS": "Rohrverschraubungen",
    "NAV_QUALITY": "Qualitätskontrolle",
    "NAV_CASES": "Referenzen",
    "NAV_NEWS": "Aktuelles",
    "NAV_CONTACT": "Kontakt",
    "VIEW_CATEGORIES": "Kategorieansicht",
    "VIEW_PRODUCTS": "Produktübersicht",
    "FILTER_ALL_CATEGORIES": "Alle Kategorien",
    "SEARCH_PLACEHOLDER": "Produkte suchen...",
    "PRODUCTS_COUNT_SUFFIX": " Produkte",
    "FILTER_CATEGORY_LABEL": "Kategorie",
    "FILTER_SEARCH_LABEL": "Suchen",
    "FILTER_FOUND_LABEL": "Gefunden",
    "FILTER_PRODUCTS_LABEL": " Produkte",
    "FILTER_CLEAR_LABEL": "Filter zurücksetzen",
    "BUTTON_VIEW_DETAILS": "Details anzeigen",
    "PAGINATION_PREV": "Vorherige",
    "PAGINATION_NEXT": "Nächste",
    "MODAL_CLOSE_TITLE": "Schließen",
    "MODAL_SPECIFICATION_TITLE": "Technische Daten",
    "MODAL_APPLICATIONS_TITLE": "Anwendungsbereiche",
    "MODAL_FEATURES_TITLE": "Produkteigenschaften",
    "MODAL_CONNECTION_TITLE": "Verbindungsart",
    "MODAL_DESCRIPTION_TITLE": "Produktbeschreibung",
    "IMAGE_VIEWER_HINT": "Klicken Sie irgendwo oder drücken Sie ESC zum Schließen",
    "IMAGE_VIEWER_CLICK_TO_CLOSE": "Zum Schließen klicken",
    "IMAGE_VIEWER_CLOSE_TITLE": "Bildbetrachter schließen (ESC)",
    "FOOTER_ABOUT_TITLE": "Über uns",
    "FOOTER_ABOUT_TEXT": "Die Cangzhou Hengjitai Pipeline Equipment Co., Ltd. wurde 2026 gegründet und liefert Rohrleitungsausrüstung, Stahlfittings, Rohrlager und -aufhängungen sowie korrosionsbeständige Armaturen für Ingenieurprojekte.",
    "FOOTER_QUICK_LINKS": "Schnellnavigation",
    "FOOTER_PRODUCTS_TITLE": "Produkte",
    "FOOTER_CONTACT_TITLE": "Kontakt",
    "FOOTER_ADDRESS": "中国河北省沧州市盐山县边务镇李郭庄村口南100米",
    "FOOTER_COPYRIGHT": "© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Alle Rechte vorbehalten"
  }
};

// 读取模板文件
function readTemplate() {
  const templatePath = path.join(__dirname, '..', 'templates', 'products-vue-template.html');
  return fs.readFileSync(templatePath, 'utf8');
}

// 获取翻译数据（现在从内嵌数据中获取）
function loadTranslations() {
  return translations;
}

// 替换模板中的占位符
function replaceTemplateVars(template, translations, language) {
  let result = template;
  const langConfig = languages[language];
  
  // 处理RTL语言（阿拉伯语）
  const isRTL = language === 'ar';
  const rtlDir = isRTL ? 'dir="rtl"' : '';
  
  // 设置RTL CSS链接标签
  const rtlCssLinkTag = isRTL 
      ? '<link rel="stylesheet" href="../css/rtl.min.css">'
      : '<!-- 非RTL语言不需要加载RTL样式 -->';
  
  // 替换RTL CSS标签
  result = result.replace('<!-- RTL_CSS_LINK_TAG -->', rtlCssLinkTag);
  
  // 替换基本翻译
  Object.keys(translations).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, translations[key]);
  });
  
  // 替换搜索关键词占位符
  result = result.replace(/\{\{SEARCH_PLASTIC_COATING\}\}/g, encodeURIComponent(getSimplifiedKeyword('plastic-coating', language)));
  result = result.replace(/\{\{SEARCH_ANTI_CORROSION\}\}/g, encodeURIComponent(getSimplifiedKeyword('anti-corrosion', language)));
  result = result.replace(/\{\{SEARCH_STEEL_PIPES\}\}/g, encodeURIComponent(getSimplifiedKeyword('steel-pipes', language)));
  result = result.replace(/\{\{SEARCH_PIPE_FITTINGS\}\}/g, encodeURIComponent(getSimplifiedKeyword('pipe-fittings', language)));
  
  // 替换hreflang链接
  const hreflangLinks = langConfig.hreflangs.map(link => `    <${link}>`).join('\n');
  result = result.replace('{{HREFLANG_LINKS}}', hreflangLinks);
  
  // 替换语言菜单项
  const languageMenuItems = langConfig.languageMenuItems.map(item => `                        <${item}`).join('\n');
  result = result.replace('{{LANGUAGE_MENU_ITEMS}}', languageMenuItems);
  
  // 添加RTL dir属性到html和body标签
  if (isRTL) {
    result = result
      .replace('<html lang="ar">', '<html lang="ar" dir="rtl">')
      .replace('<body class="bg-white">', '<body class="bg-white" dir="rtl">');
  }
  
  return result;
}

function applyProductsSeoFromConfig(translations, language) {
  const pages = siteConfig.seo.pages[language] || siteConfig.seo.pages.en;
  const p = pages && pages.products;
  if (!p) return;
  translations.SEO_TITLE = p.title;
  translations.META_DESCRIPTION = p.description;
  translations.META_KEYWORDS = p.keywords;
}

// 生成特定语言的页面
function generateLanguagePage(language) {
  const template = readTemplate();
  const allTranslations = loadTranslations();
  const base = allTranslations[language];
  
  if (!base) {
    console.error(`No translations found for language: ${language}`);
    return;
  }

  const translations = { ...base };
  applyProductsSeoFromConfig(translations, language);
  
  const result = replaceTemplateVars(template, translations, language);
  
  // 写入文件
  const outputPath = path.join(__dirname, '..', languages[language].folder, 'products.html');
  fs.writeFileSync(outputPath, result, 'utf8');
  
  console.log(`Generated ${language} page: ${outputPath}`);
}

// 生成所有语言页面
function generateAllPages() {
  console.log('Generating multilingual product pages...');
  
  Object.keys(languages).forEach(language => {
    generateLanguagePage(language);
  });
  
  console.log('All pages generated successfully!');
}

// 如果直接运行此脚本
if (require.main === module) {
  generateAllPages();
}

module.exports = {
  generateLanguagePage,
  generateAllPages
};
