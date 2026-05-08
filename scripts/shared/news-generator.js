/**
 * 新闻页面生成模块
 * 用于在1. generate-page.js脚本中生成多语言版本的news.html页面
 * 通过将模板中的占位符替换为语言特定的文本来生成页面
 */

const fs = require('fs');
const path = require('path');

const newsTranslations = {
    // 中文翻译
    cn: {
        NEWS_TITLE: "新闻动态",
        NEWS_DESCRIPTION: "沧州恒基泰管道装备有限公司最新动态、行业资讯、展会信息等。",
        NEWS_KEYWORDS: "企业新闻,行业资讯,展会信息",
        ALL_NEWS: "全部新闻",
        NO_SEARCH_RESULTS: "没有找到与 {{ activeSearchKeyword }} 相关的新闻。",
        NO_CATEGORY_NEWS: "该分类下暂无新闻。",
        READ_MORE: "阅读更多",
        SEARCH: "搜索",
        NEWS_CATEGORIES: "新闻分类",
        HOT_NEWS: "热门新闻",
        HOT_TAGS: "热门标签",
        BACK_TO_HOME: "返回首页",
        BUTTON_ALL_NEWS: "查看所有新闻",
        BUTTON_VIEW_CATEGORY: "查看{category}",
        BUTTON_READ_MORE: "查看 {title}",
        BUTTON_PREV_PAGE: "上一页",
        BUTTON_NEXT_PAGE: "下一页",
        BUTTON_PAGE_NUMBER: "第{number}页",
        BUTTON_SEARCH: "搜索",
        SEARCH_PLACEHOLDER: "输入关键词...",
        BUTTON_VIEW_ALL_CATEGORY: "查看所有{category}",
        BUTTON_VIEW_TAGGED_NEWS: "查看{category}相关新闻"
    },
    
    // 英文翻译
    en: {
        NEWS_TITLE: "News",
        NEWS_DESCRIPTION: "Latest news, industry updates, and exhibition information from Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
        NEWS_KEYWORDS: "company news, industry news, exhibition information",
        ALL_NEWS: "All News",
        NO_SEARCH_RESULTS: "No results found for {{ activeSearchKeyword }}.",
        NO_CATEGORY_NEWS: "No news in this category.",
        READ_MORE: "Read More",
        SEARCH: "Search",
        NEWS_CATEGORIES: "News Categories",
        HOT_NEWS: "Popular News",
        HOT_TAGS: "Popular Tags",
        BACK_TO_HOME: "Back to Home",
        BUTTON_ALL_NEWS: "View all news",
        BUTTON_VIEW_CATEGORY: "View {category}",
        BUTTON_READ_MORE: "Read more about {title}",
        BUTTON_PREV_PAGE: "Previous page",
        BUTTON_NEXT_PAGE: "Next page",
        BUTTON_PAGE_NUMBER: "Page {number}",
        BUTTON_SEARCH: "Search",
        SEARCH_PLACEHOLDER: "Enter keywords...",
        BUTTON_VIEW_ALL_CATEGORY: "View all {category}",
        BUTTON_VIEW_TAGGED_NEWS: "View news about {category}"
    },
    
    // 日文翻译
    jp: {
        NEWS_TITLE: "ニュース",
        NEWS_DESCRIPTION: "恒基泰管道設備有限公司からの最新ニュース、業界の最新情報、展示会情報など。",
        NEWS_KEYWORDS: "会社ニュース,業界ニュース,展示会情報",
        ALL_NEWS: "すべてのニュース",
        NO_SEARCH_RESULTS: "{{ activeSearchKeyword }} に関する結果が見つかりませんでした。",
        NO_CATEGORY_NEWS: "このカテゴリにはニュースがありません。",
        READ_MORE: "続きを読む",
        SEARCH: "検索",
        NEWS_CATEGORIES: "ニュースカテゴリ",
        HOT_NEWS: "人気ニュース",
        HOT_TAGS: "人気タグ",
        BACK_TO_HOME: "ホームに戻る",
        BUTTON_ALL_NEWS: "すべてのニュースを表示",
        BUTTON_VIEW_CATEGORY: "{category}を表示",
        BUTTON_READ_MORE: "{title}の詳細を読む",
        BUTTON_PREV_PAGE: "前のページ",
        BUTTON_NEXT_PAGE: "次のページ",
        BUTTON_PAGE_NUMBER: "ページ{number}",
        BUTTON_SEARCH: "検索",
        SEARCH_PLACEHOLDER: "キーワードを入力...",
        BUTTON_VIEW_ALL_CATEGORY: "すべての{category}を表示",
        BUTTON_VIEW_TAGGED_NEWS: "{category}に関するニュースを表示"
    },
    
    // 俄文翻译
    ru: {
        NEWS_TITLE: "Новости",
        NEWS_DESCRIPTION: "Последние новости, отраслевые обновления и информация о выставках от Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
        NEWS_KEYWORDS: "новости компании, отраслевые новости, выставочная информация",
        ALL_NEWS: "Все новости",
        NO_SEARCH_RESULTS: "Результаты для {{ activeSearchKeyword }} не найдены.",
        NO_CATEGORY_NEWS: "В этой категории нет новостей.",
        READ_MORE: "Подробнее",
        SEARCH: "Поиск",
        NEWS_CATEGORIES: "Категории новостей",
        HOT_NEWS: "Популярные новости",
        HOT_TAGS: "Популярные теги",
        BUTTON_ALL_NEWS: "Просмотреть все новости",
        BUTTON_VIEW_CATEGORY: "Просмотреть {category}",
        BUTTON_READ_MORE: "Подробнее о {title}",
        BUTTON_PREV_PAGE: "Предыдущая страница",
        BUTTON_NEXT_PAGE: "Следующая страница",
        BUTTON_PAGE_NUMBER: "Страница {number}",
        BUTTON_SEARCH: "Поиск",
        SEARCH_PLACEHOLDER: "Введите ключевые слова...",
        BUTTON_VIEW_ALL_CATEGORY: "Просмотреть все {category}",
        BUTTON_VIEW_TAGGED_NEWS: "Просмотреть новости о {category}",
        BACK_TO_HOME: "Вернуться на главную"
    },
    
    // 阿拉伯文翻译
    ar: {
        NEWS_TITLE: "الأخبار",
        NEWS_DESCRIPTION: "آخر الأخبار وتحديثات الصناعة ومعلومات المعارض من شركة خبي هينغيوان الصناعية المحدودة.",
        NEWS_KEYWORDS: "أخبار الشركة، أخبار الصناعة، معلومات المعرض",
        ALL_NEWS: "كل الأخبار",
        NO_SEARCH_RESULTS: "لم يتم العثور على نتائج لـ {{ activeSearchKeyword }}.",
        NO_CATEGORY_NEWS: "لا توجد أخبار في هذه الفئة.",
        READ_MORE: "قراءة المزيد",
        SEARCH: "بحث",
        NEWS_CATEGORIES: "فئات الأخبار",
        HOT_NEWS: "الأخبار الشائعة",
        HOT_TAGS: "الوسوم الشائعة",
        BACK_TO_HOME: "العودة إلى الصفحة الرئيسية",
        BUTTON_ALL_NEWS: "عرض جميع الأخبار",
        BUTTON_VIEW_CATEGORY: "عرض {category}",
        BUTTON_READ_MORE: "قراءة المزيد عن {title}",
        BUTTON_PREV_PAGE: "الصفحة السابقة",
        BUTTON_NEXT_PAGE: "الصفحة التالية",
        BUTTON_PAGE_NUMBER: "صفحة {number}",
        BUTTON_SEARCH: "بحث",
        SEARCH_PLACEHOLDER: "أدخل الكلمات المفتاحية...",
        BUTTON_VIEW_ALL_CATEGORY: "عرض كل {category}",
        BUTTON_VIEW_TAGGED_NEWS: "عرض الأخبار عن {category}"
    },
    
    // 西班牙文翻译
    es: {
        NEWS_TITLE: "Noticias",
        NEWS_DESCRIPTION: "Últimas noticias, actualizaciones de la industria e información de exposiciones de Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
        NEWS_KEYWORDS: "noticias de la empresa, noticias de la industria, información de exposiciones",
        ALL_NEWS: "Todas las Noticias",
        NO_SEARCH_RESULTS: "No se encontraron resultados para {{ activeSearchKeyword }}.",
        NO_CATEGORY_NEWS: "No hay noticias en esta categoría.",
        READ_MORE: "Leer Más",
        SEARCH: "Buscar",
        NEWS_CATEGORIES: "Categorías de Noticias",
        HOT_NEWS: "Noticias Populares",
        HOT_TAGS: "Etiquetas Populares",
        BACK_TO_HOME: "Volver al Inicio",
        BUTTON_ALL_NEWS: "Ver todas las noticias",
        BUTTON_VIEW_CATEGORY: "Ver {category}",
        BUTTON_READ_MORE: "Leer más sobre {title}",
        BUTTON_PREV_PAGE: "Página anterior",
        BUTTON_NEXT_PAGE: "Página siguiente",
        BUTTON_PAGE_NUMBER: "Página {number}",
        BUTTON_SEARCH: "Buscar",
        SEARCH_PLACEHOLDER: "Introducir palabras clave...",
        BUTTON_VIEW_ALL_CATEGORY: "Ver todas las {category}",
        BUTTON_VIEW_TAGGED_NEWS: "Ver noticias sobre {category}"
    },
    
    // 法文翻译
    fr: {
        NEWS_TITLE: "Actualités",
        NEWS_DESCRIPTION: "Dernières actualités, mises à jour de l'industrie et informations sur les expositions de Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
        NEWS_KEYWORDS: "actualités de l'entreprise, actualités de l'industrie, informations sur les expositions",
        ALL_NEWS: "Toutes les Actualités",
        NO_SEARCH_RESULTS: "Aucun résultat trouvé pour {{ activeSearchKeyword }}.",
        NO_CATEGORY_NEWS: "Pas d'actualités dans cette catégorie.",
        READ_MORE: "Lire Plus",
        SEARCH: "Rechercher",
        NEWS_CATEGORIES: "Catégories d'Actualités",
        HOT_NEWS: "Actualités Populaires",
        HOT_TAGS: "Étiquettes Populaires",
        BACK_TO_HOME: "Retour à l'Accueil",
        BUTTON_ALL_NEWS: "Voir toutes les actualités",
        BUTTON_VIEW_CATEGORY: "Voir {category}",
        BUTTON_READ_MORE: "En savoir plus sur {title}",
        BUTTON_PREV_PAGE: "Page précédente",
        BUTTON_NEXT_PAGE: "Page suivante",
        BUTTON_PAGE_NUMBER: "Page {number}",
        BUTTON_SEARCH: "Rechercher",
        SEARCH_PLACEHOLDER: "Saisir des mots-clés...",
        BUTTON_VIEW_ALL_CATEGORY: "Voir toutes les {category}",
        BUTTON_VIEW_TAGGED_NEWS: "Voir les actualités sur {category}"
    },
    
    // 葡萄牙文翻译
    pt: {
        NEWS_TITLE: "Notícias",
        NEWS_DESCRIPTION: "Últimas notícias, atualizações da indústria e informações sobre exposições da Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
        NEWS_KEYWORDS: "notícias da empresa, notícias da indústria, informações sobre exposições",
        ALL_NEWS: "Todas as Notícias",
        NO_SEARCH_RESULTS: "Nenhum resultado encontrado para {{ activeSearchKeyword }}.",
        NO_CATEGORY_NEWS: "Não há notícias nesta categoria.",
        READ_MORE: "Leia Mais",
        SEARCH: "Buscar",
        NEWS_CATEGORIES: "Categorias de Notícias",
        HOT_NEWS: "Notícias Populares",
        HOT_TAGS: "Tags Populares",
        BACK_TO_HOME: "Voltar para o Início",
        BUTTON_ALL_NEWS: "Ver todas as notícias",
        BUTTON_VIEW_CATEGORY: "Ver {category}",
        BUTTON_READ_MORE: "Leia mais sobre {title}",
        BUTTON_PREV_PAGE: "Página anterior",
        BUTTON_NEXT_PAGE: "Próxima página",
        BUTTON_PAGE_NUMBER: "Página {number}",
        BUTTON_SEARCH: "Buscar",
        SEARCH_PLACEHOLDER: "Digite palavras-chave...",
        BUTTON_VIEW_ALL_CATEGORY: "Ver todas as {category}",
        BUTTON_VIEW_TAGGED_NEWS: "Ver notícias sobre {category}"
    },
    
    // 印地文翻译
    hi: {
        NEWS_TITLE: "समाचार",
        NEWS_DESCRIPTION: "हेबेई कांगझोउ हेंगजिताई कं., लिमिटेड से नवीनतम समाचार, उद्योग अपडेट और प्रदर्शनी जानकारी।",
        NEWS_KEYWORDS: "कंपनी समाचार, उद्योग समाचार, प्रदर्शनी जानकारी",
        ALL_NEWS: "सभी समाचार",
        NO_SEARCH_RESULTS: "{{ activeSearchKeyword }} के लिए कोई परिणाम नहीं मिला।",
        NO_CATEGORY_NEWS: "इस श्रेणी में कोई समाचार नहीं है।",
        READ_MORE: "और पढ़ें",
        SEARCH: "खोज",
        NEWS_CATEGORIES: "समाचार श्रेणियाँ",
        HOT_NEWS: "लोकप्रिय समाचार",
        HOT_TAGS: "लोकप्रिय टैग",
        BACK_TO_HOME: "होम पर वापस जाएं",
        BUTTON_ALL_NEWS: "सभी समाचार देखें",
        BUTTON_VIEW_CATEGORY: "{category} देखें",
        BUTTON_READ_MORE: "{title} के बारे में अधिक पढ़ें",
        BUTTON_PREV_PAGE: "पिछला पृष्ठ",
        BUTTON_NEXT_PAGE: "अगला पृष्ठ",
        BUTTON_PAGE_NUMBER: "पृष्ठ {number}",
        BUTTON_SEARCH: "खोज",
        SEARCH_PLACEHOLDER: "कीवर्ड दर्ज करें...",
        BUTTON_VIEW_ALL_CATEGORY: "सभी {category} देखें",
        BUTTON_VIEW_TAGGED_NEWS: "{category} के बारे में समाचार देखें"
    },
    
    // 德文翻译
    de: {
        NEWS_TITLE: "Nachrichten",
        NEWS_DESCRIPTION: "Aktuelle Nachrichten, Branchenaktualisierungen und Ausstellungsinformationen von Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
        NEWS_KEYWORDS: "Unternehmensnachrichten, Branchennachrichten, Ausstellungsinformationen",
        ALL_NEWS: "Alle Nachrichten",
        NO_SEARCH_RESULTS: "Keine Ergebnisse für {{ activeSearchKeyword }} gefunden.",
        NO_CATEGORY_NEWS: "Keine Nachrichten in dieser Kategorie.",
        READ_MORE: "Mehr Lesen",
        SEARCH: "Suchen",
        NEWS_CATEGORIES: "Nachrichtenkategorien",
        HOT_NEWS: "Beliebte Nachrichten",
        HOT_TAGS: "Beliebte Tags",
        BACK_TO_HOME: "Zurück zur Startseite",
        BUTTON_ALL_NEWS: "Alle Nachrichten anzeigen",
        BUTTON_VIEW_CATEGORY: "{category} anzeigen",
        BUTTON_READ_MORE: "Mehr über {title} lesen",
        BUTTON_PREV_PAGE: "Vorherige Seite",
        BUTTON_NEXT_PAGE: "Nächste Seite",
        BUTTON_PAGE_NUMBER: "Seite {number}",
        BUTTON_SEARCH: "Suchen",
        BUTTON_VIEW_ALL_CATEGORY: "Alle {category} anzeigen",
        SEARCH_PLACEHOLDER: "Schlüsselwörter eingeben...",
        BUTTON_VIEW_TAGGED_NEWS: "Nachrichten über {category} anzeigen"
    }
};

// ISO语言代码映射
const langCodeMap = {
    cn: 'zh-CN',
    en: 'en',
    jp: 'ja',
    ru: 'ru',
    ar: 'ar',
    es: 'es',
    fr: 'fr',
    pt: 'pt',
    hi: 'hi',
    de: 'de'
};

// 生成不同语言之间的备用链接HTML
function generateAlternateLinks() {
    // 定义所有支持的语言
    const languages = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
    let links = '';
    
    // 为每种语言生成一个备用链接
    languages.forEach(lang => {
        const hreflang = lang === 'en' ? 'x-default' : langCodeMap[lang];
        links += `<link rel="alternate" hreflang="${hreflang}" href="https://hengjitaipipeline.com/${lang}/news.html" />\n`;
    });
    
    return links;
}

/**
 * 生成特定语言的新闻页面
 * @param {string} lang - 语言代码，如'cn', 'en'等
 * @returns {string} - 生成的HTML内容
 */
function generateNewsPage(lang) {
    // 读取模板文件
    const templatePath = path.join(process.cwd(), 'templates', 'news-template.html');
    let templateContent;
    
    try {
        templateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        console.error('读取模板文件失败:', error);
        return null;
    }
    
    // 获取语言特定的翻译
    const translation = newsTranslations[lang] || newsTranslations.en; // 默认使用英文
    const langCode = langCodeMap[lang] || 'en';
    const rtlDir = lang === 'ar' ? 'dir="rtl"' : '';
    
    // 设置RTL CSS链接标签
    const rtlCss = lang === 'ar' 
        ? '<link rel="stylesheet" href="../css/rtl.min.css">'
        : '<!-- 非RTL语言不需要加载RTL样式 -->';
    
    // 替换所有占位符
    let pageContent = templateContent;
    
    // 替换基础语言信息
    pageContent = pageContent
        .replace(/{{LANG_CODE}}/g, langCode)
        .replace(/{{LANG}}/g, lang)
        .replace(/{{RTL_DIR}}/g, rtlDir)
        .replace(/{{RTL_CSS}}/g, rtlCss);
        
    // 替换公司信息
    const companyInfo = {
        cn: {
            companyName: "沧州恒基泰管道装备有限公司",
            companyFullName: "沧州恒基泰管道装备有限公司",
            companyShortName: "恒基泰管道装备",
            homeText: "首页"
        },
        en: {
            companyName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyFullName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyShortName: "Hengjitai",
            homeText: "Home"
        },
        jp: {
            companyName: "恒基泰管道設備有限公司",
            companyFullName: "恒基泰管道設備有限公司",
            companyShortName: "恒基泰管道設備",
            homeText: "ホーム"
        },
        ru: {
            companyName: "Хэбэй Хэнъюань Индастриал Ко., Лтд.",
            companyFullName: "Хэбэй Хэнъюань Индастриал Ко., Лтд.",
            companyShortName: "Хэнъюань",
            homeText: "Главная"
        },
        ar: {
            companyName: "شركة خبي هينغيوان الصناعية المحدودة",
            companyFullName: "شركة خبي هينغيوان الصناعية المحدودة",
            companyShortName: "هينغيوان",
            homeText: "الرئيسية"
        },
        es: {
            companyName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyFullName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyShortName: "Hengjitai",
            homeText: "Inicio"
        },
        fr: {
            companyName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyFullName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyShortName: "Hengjitai",
            homeText: "Accueil"
        },
        pt: {
            companyName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyFullName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyShortName: "Hengjitai",
            homeText: "Início"
        },
        hi: {
            companyName: "हेबेई कांगझोउ हेंगजिताई कं., लिमिटेड",
            companyFullName: "हेबेई कांगझोउ हेंगजिताई कं., लिमिटेड",
            companyShortName: "हेंगजिताई",
            homeText: "होम"
        },
        de: {
            companyName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyFullName: "Cangzhou Hengjitai Pipeline Equipment Co., Ltd.",
            companyShortName: "Hengjitai",
            homeText: "Startseite"
        }
    };
    
    // 获取当前语言的公司信息，默认使用英语
    const info = companyInfo[lang] || companyInfo.en;
    
    // 替换公司信息
    pageContent = pageContent
        .replace(/{{COMPANY_NAME}}/g, info.companyName)
        .replace(/{{COMPANY_FULL_NAME}}/g, info.companyFullName)
        .replace(/{{COMPANY_SHORT_NAME}}/g, info.companyShortName)
        .replace(/{{HOME_TEXT}}/g, info.homeText);
    
    // 替换所有翻译占位符
    Object.keys(translation).forEach(key => {
        const pattern = new RegExp(`{{${key}}}`, 'g');
        pageContent = pageContent.replace(pattern, translation[key]);
    });
    
    console.log(`✓ 已成功为 ${lang} 语言生成新闻页面`);
    return pageContent;
}

module.exports = { generateNewsPage };
