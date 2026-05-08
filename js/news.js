/**
 * 新闻页面多语言支持脚本
 * 提供不同语言的界面翻译和按钮标签
 */

// 获取当前页面的语言
function getCurrentLanguage() {
    const pathParts = window.location.pathname.split('/');
    for (let i = 0; i < pathParts.length; i++) {
        if (['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'].includes(pathParts[i])) {
            return pathParts[i];
        }
    }
    // 默认返回英文
    return 'en';
}

// 多语言翻译资源
const newsTranslations = {
    // 中文翻译
    cn: {
        allNews: "全部新闻",
        noSearchResults: "没有找到与 \"{keyword}\" 相关的新闻。",
        noCategoryNews: "该分类下暂无新闻。",
        readMore: "阅读更多",
        search: "搜索",
        newsCategories: "新闻分类",
        hotNews: "热门新闻",
        hotTags: "热门标签",
        buttonLabels: {
            allNews: "查看所有新闻",
            viewCategory: "查看{category}",
            readMore: "查看 {title}",
            prevPage: "上一页",
            nextPage: "下一页",
            pageNumber: "第{number}页",
            search: "搜索",
            searchPlaceholder: "输入关键词...",
            viewAllCategory: "查看所有{category}",
            viewTaggedNews: "查看{category}相关新闻"
        }
    },
    
    // 英文翻译
    en: {
        allNews: "All News",
        noSearchResults: "No results found for \"{keyword}\".",
        noCategoryNews: "No news in this category.",
        readMore: "Read More",
        search: "Search",
        newsCategories: "News Categories",
        hotNews: "Popular News",
        hotTags: "Popular Tags",
        buttonLabels: {
            allNews: "View all news",
            viewCategory: "View {category}",
            readMore: "Read more about {title}",
            prevPage: "Previous page",
            nextPage: "Next page",
            pageNumber: "Page {number}",
            search: "Search",
            searchPlaceholder: "Enter keywords...",
            viewAllCategory: "View all {category}",
            viewTaggedNews: "View news about {category}"
        }
    },
    
    // 日文翻译
    jp: {
        allNews: "すべてのニュース",
        noSearchResults: "\"{keyword}\" に関する結果が見つかりませんでした。",
        noCategoryNews: "このカテゴリにはニュースがありません。",
        readMore: "続きを読む",
        search: "検索",
        newsCategories: "ニュースカテゴリ",
        hotNews: "人気ニュース",
        hotTags: "人気タグ",
        buttonLabels: {
            allNews: "すべてのニュースを表示",
            viewCategory: "{category}を表示",
            readMore: "{title}の詳細を読む",
            prevPage: "前のページ",
            nextPage: "次のページ",
            pageNumber: "ページ{number}",
            search: "検索",
            searchPlaceholder: "キーワードを入力...",
            viewAllCategory: "すべての{category}を表示",
            viewTaggedNews: "{category}に関するニュースを表示"
        }
    },
    
    // 俄文翻译
    ru: {
        allNews: "Все новости",
        noSearchResults: "Результаты для \"{keyword}\" не найдены.",
        noCategoryNews: "В этой категории нет новостей.",
        readMore: "Подробнее",
        search: "Поиск",
        newsCategories: "Категории новостей",
        hotNews: "Популярные новости",
        hotTags: "Популярные теги",
        buttonLabels: {
            allNews: "Просмотреть все новости",
            viewCategory: "Просмотреть {category}",
            readMore: "Подробнее о {title}",
            prevPage: "Предыдущая страница",
            nextPage: "Следующая страница",
            pageNumber: "Страница {number}",
            search: "Поиск",
            searchPlaceholder: "Введите ключевые слова...",
            viewAllCategory: "Просмотреть все {category}",
            viewTaggedNews: "Просмотреть новости о {category}"
        }
    },
    
    // 阿拉伯文翻译
    ar: {
        allNews: "كل الأخبار",
        noSearchResults: "لم يتم العثور على نتائج لـ \"{keyword}\".",
        noCategoryNews: "لا توجد أخبار في هذه الفئة.",
        readMore: "قراءة المزيد",
        search: "بحث",
        newsCategories: "فئات الأخبار",
        hotNews: "الأخبار الشائعة",
        hotTags: "الوسوم الشائعة",
        buttonLabels: {
            allNews: "عرض جميع الأخبار",
            viewCategory: "عرض {category}",
            readMore: "قراءة المزيد عن {title}",
            prevPage: "الصفحة السابقة",
            nextPage: "الصفحة التالية",
            pageNumber: "صفحة {number}",
            search: "بحث",
            searchPlaceholder: "أدخل الكلمات المفتاحية...",
            viewAllCategory: "عرض كل {category}",
            viewTaggedNews: "عرض الأخبار عن {category}"
        }
    },
    
    // 西班牙文翻译
    es: {
        allNews: "Todas las Noticias",
        noSearchResults: "No se encontraron resultados para \"{keyword}\".",
        noCategoryNews: "No hay noticias en esta categoría.",
        readMore: "Leer Más",
        search: "Buscar",
        newsCategories: "Categorías de Noticias",
        hotNews: "Noticias Populares",
        hotTags: "Etiquetas Populares",
        buttonLabels: {
            allNews: "Ver todas las noticias",
            viewCategory: "Ver {category}",
            readMore: "Leer más sobre {title}",
            prevPage: "Página anterior",
            nextPage: "Página siguiente",
            pageNumber: "Página {number}",
            search: "Buscar",
            searchPlaceholder: "Introducir palabras clave...",
            viewAllCategory: "Ver todas las {category}",
            viewTaggedNews: "Ver noticias sobre {category}"
        }
    },
    
    // 法文翻译
    fr: {
        allNews: "Toutes les Actualités",
        noSearchResults: "Aucun résultat trouvé pour \"{keyword}\".",
        noCategoryNews: "Pas d'actualités dans cette catégorie.",
        readMore: "Lire Plus",
        search: "Rechercher",
        newsCategories: "Catégories d'Actualités",
        hotNews: "Actualités Populaires",
        hotTags: "Étiquettes Populaires",
        buttonLabels: {
            allNews: "Voir toutes les actualités",
            viewCategory: "Voir {category}",
            readMore: "En savoir plus sur {title}",
            prevPage: "Page précédente",
            nextPage: "Page suivante",
            pageNumber: "Page {number}",
            search: "Rechercher",
            searchPlaceholder: "Saisir des mots-clés...",
            viewAllCategory: "Voir toutes les {category}",
            viewTaggedNews: "Voir les actualités sur {category}"
        }
    },
    
    // 葡萄牙文翻译
    pt: {
        allNews: "Todas as Notícias",
        noSearchResults: "Nenhum resultado encontrado para \"{keyword}\".",
        noCategoryNews: "Não há notícias nesta categoria.",
        readMore: "Leia Mais",
        search: "Buscar",
        newsCategories: "Categorias de Notícias",
        hotNews: "Notícias Populares",
        hotTags: "Tags Populares",
        buttonLabels: {
            allNews: "Ver todas as notícias",
            viewCategory: "Ver {category}",
            readMore: "Leia mais sobre {title}",
            prevPage: "Página anterior",
            nextPage: "Próxima página",
            pageNumber: "Página {number}",
            search: "Buscar",
            searchPlaceholder: "Digite palavras-chave...",
            viewAllCategory: "Ver todas as {category}",
            viewTaggedNews: "Ver notícias sobre {category}"
        }
    },
    
    // 印地文翻译
    hi: {
        allNews: "सभी समाचार",
        noSearchResults: "\"{keyword}\" के लिए कोई परिणाम नहीं मिला।",
        noCategoryNews: "इस श्रेणी में कोई समाचार नहीं है।",
        readMore: "और पढ़ें",
        search: "खोज",
        newsCategories: "समाचार श्रेणियाँ",
        hotNews: "लोकप्रिय समाचार",
        hotTags: "लोकप्रिय टैग",
        buttonLabels: {
            allNews: "सभी समाचार देखें",
            viewCategory: "{category} देखें",
            readMore: "{title} के बारे में अधिक पढ़ें",
            prevPage: "पिछला पृष्ठ",
            nextPage: "अगला पृष्ठ",
            pageNumber: "पृष्ठ {number}",
            search: "खोज",
            searchPlaceholder: "कीवर्ड दर्ज करें...",
            viewAllCategory: "सभी {category} देखें",
            viewTaggedNews: "{category} के बारे में समाचार देखें"
        }
    },
    
    // 德文翻译
    de: {
        allNews: "Alle Nachrichten",
        noSearchResults: "Keine Ergebnisse für \"{keyword}\" gefunden.",
        noCategoryNews: "Keine Nachrichten in dieser Kategorie.",
        readMore: "Mehr Lesen",
        search: "Suchen",
        newsCategories: "Nachrichtenkategorien",
        hotNews: "Beliebte Nachrichten",
        hotTags: "Beliebte Tags",
        buttonLabels: {
            allNews: "Alle Nachrichten anzeigen",
            viewCategory: "{category} anzeigen",
            readMore: "Mehr über {title} lesen",
            prevPage: "Vorherige Seite",
            nextPage: "Nächste Seite",
            pageNumber: "Seite {number}",
            search: "Suchen",
            searchPlaceholder: "Schlüsselwörter eingeben...",
            viewAllCategory: "Alle {category} anzeigen",
            viewTaggedNews: "Nachrichten über {category} anzeigen"
        }
    }
};

// 获取当前语言的翻译
const currentLang = getCurrentLanguage();
const newsTranslation = newsTranslations[currentLang] || newsTranslations.en; // 默认使用英文

// 全局导出
window.newsTranslation = newsTranslation;
