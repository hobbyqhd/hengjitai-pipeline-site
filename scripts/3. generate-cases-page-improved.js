/**
 * 案例页面生成脚本（改进版）
 * 此脚本使用模板和占位符系统生成多语言案例页面
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const utils = require('./shared/utils');
const pageComponents = require('./shared/page-components');
const metadata = require('./shared/metadata');

// 站点URL配置
const siteUrl = 'https://hengjitaipipeline.com';

// 导入语言列表和配置
const LANGUAGES = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];

/**
 * 读取案例模板文件
 * @returns {string} 模板内容
 */
function readCasesTemplate() {
    try {
        return fs.readFileSync(path.join(__dirname, '../templates/cases-template.html'), 'utf8');
    } catch (error) {
        console.error('读取案例模板文件失败', error);
        process.exit(1);
    }
}

/**
 * 读取案例翻译JSON文件
 * @returns {object} 翻译对象
 */
function readCasesTranslations() {
    try {
        const translationsPath = path.join(__dirname, '../templates/translations/cases.json');
        if (fs.existsSync(translationsPath)) {
            return JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
        } else {
            console.error('未找到案例翻译文件');
            process.exit(1);
        }
    } catch (error) {
        console.error('读取案例翻译文件失败', error);
        process.exit(1);
    }
}

/**
 * 生成案例页面
 * @param {string} lang 语言代码
 * @param {object} menuOptions 菜单选项
 * @returns {void}
 */
function generateCasesPage(lang, menuOptions = {}) {
    // 读取模板和翻译
    const template = readCasesTemplate();
    const translations = readCasesTranslations();
    
    // 获取该语言的翻译
    const langTranslations = translations.page[lang] || translations.page.en;
    
    // 获取该语言的元数据和配置
    const meta = metadata.getPageMetadata(lang, 'cases');
    const langConfig = pageComponents.getLanguageConfig(lang);
    
    // 生成导航菜单
    const pageDepth = 0;
    const navigationMenu = pageComponents.getNavigationMenuHTML(lang, pageDepth, menuOptions);
    
    // 生成语言选择器
    const languageSelector = pageComponents.getLanguageSelectorHTML(lang, 'cases.html', '../');
    
    // 生成页脚
    const footerHTML = pageComponents.getFooterHTML(lang, pageDepth);
    
    // 生成回到顶部按钮
    const backToTopHTML = pageComponents.getBackToTopHTML(lang);
    
    // RTL处理
    const isRTL = lang === 'ar';
    const langAttr = lang === 'cn' ? 'zh-CN' : lang === 'jp' ? 'ja' : lang;
    const rtlCssTag = isRTL ? '<link rel="stylesheet" href="../css/rtl.min.css">' : '';
    const dirAttribute = isRTL ? 'dir="rtl"' : '';
    
    // 生成 alternate hreflang 标签
    const alternateLinks = generateAlternateLinks(lang);
    
    // 替换模板中的占位符
    let pageContent = template;
    
    // 替换语言特定的占位符
    pageContent = pageContent.replace(/{{LANG_CODE}}/g, langAttr);
    pageContent = pageContent.replace(/{{LANG}}/g, lang);
    pageContent = pageContent.replace(/{{DIR_ATTRIBUTE}}/g, dirAttribute);
    pageContent = pageContent.replace(/{{PAGE_TITLE}}/g, langTranslations.title);
    pageContent = pageContent.replace(/{{META_DESCRIPTION}}/g, langTranslations.description);
    pageContent = pageContent.replace(/{{META_KEYWORDS}}/g, langTranslations.keywords);
    pageContent = pageContent.replace(/{{META_VIEWPORT}}/g, meta.viewport || 'width=device-width, initial-scale=1.0');
    pageContent = pageContent.replace(/{{META_THEME_COLOR}}/g, meta.themeColor || '#FFFFFF');
    pageContent = pageContent.replace(/{{COMPANY_FULL_NAME}}/g, langConfig.companyFullName);
    pageContent = pageContent.replace(/{{COMPANY_NAME}}/g, langConfig.companyName);
    pageContent = pageContent.replace(/{{HOME_TEXT}}/g, langConfig.homeText);
    pageContent = pageContent.replace(/{{RTL_CSS}}/g, rtlCssTag);
    pageContent = pageContent.replace(/{{NAVIGATION_MENU}}/g, navigationMenu);
    pageContent = pageContent.replace(/{{LANGUAGE_SELECTOR}}/g, languageSelector);
    pageContent = pageContent.replace(/{{FOOTER_HTML}}/g, footerHTML);
    pageContent = pageContent.replace(/{{BACK_TO_TOP_HTML}}/g, backToTopHTML);
    pageContent = pageContent.replace(/{{ALTERNATE_LINKS}}/g, alternateLinks);
    
    // 替换页面特有的文本
    pageContent = pageContent.replace(/{{PROJECT_OVERVIEW}}/g, langTranslations.project_overview);
    pageContent = pageContent.replace(/{{SOLUTION}}/g, langTranslations.solution);
    pageContent = pageContent.replace(/{{RESULTS}}/g, langTranslations.results);
    pageContent = pageContent.replace(/{{VIEW_DETAILS}}/g, langTranslations.view_details);
    pageContent = pageContent.replace(/{{CLOSE_DETAILS}}/g, langTranslations.close_details);
    pageContent = pageContent.replace(/{{PREVIOUS_PAGE}}/g, langTranslations.previous_page);
    pageContent = pageContent.replace(/{{NEXT_PAGE}}/g, langTranslations.next_page);
    pageContent = pageContent.replace(/{{ALL_CASES}}/g, langTranslations.all_cases);
    pageContent = pageContent.replace(/{{CLIENTS_TITLE}}/g, langTranslations.clients_title);
    pageContent = pageContent.replace(/{{CLIENTS_DESCRIPTION}}/g, langTranslations.clients_description);
    pageContent = pageContent.replace(/{{FILTER_PROMPT}}/g, langTranslations.filter_prompt);
    pageContent = pageContent.replace(/{{FILTER_ALL}}/g, langTranslations.filter_all);
    pageContent = pageContent.replace(/{{CLOSE_IMAGE_VIEWER}}/g, langTranslations.close_image_viewer || 'Close Image Viewer');
    pageContent = pageContent.replace(/{{VIEW_CASE_DETAILS_TEMPLATE}}/g, langTranslations.view_case_details || 'View {0} Details');
    pageContent = pageContent.replace(/{{FILTER_MUNICIPAL}}/g, langTranslations.filter_municipal);
    pageContent = pageContent.replace(/{{FILTER_INDUSTRIAL}}/g, langTranslations.filter_industrial);
    pageContent = pageContent.replace(/{{FILTER_WATER}}/g, langTranslations.filter_water);
    pageContent = pageContent.replace(/{{FILTER_GAS}}/g, langTranslations.filter_gas);
    pageContent = pageContent.replace(/{{FILTER_OTHER}}/g, langTranslations.filter_other);
    
    // 保存生成的页面
    const outputPath = path.join(__dirname, `../${lang}/cases.html`);
    fs.writeFileSync(outputPath, pageContent, 'utf8');
    console.log(`✓ 成功生成 ${lang}/cases.html`);
}

/**
 * 生成 alternate hreflang 标签
 * @param {string} currentLang 当前语言代码
 * @returns {string} 生成的alternate链接HTML
 */
function generateAlternateLinks(currentLang) {
    let links = '';
    
    // 为每种语言添加alternate链接
    LANGUAGES.forEach(lang => {
        // 设置正确的语言代码格式
        let hreflang = lang;
        if (lang === 'cn') hreflang = 'zh-CN';
        if (lang === 'jp') hreflang = 'ja';
        
        // 如果是英文，也添加x-default
        if (lang === 'en' && currentLang !== 'en') {
            links += `<link rel="alternate" hreflang="x-default" href="${siteUrl}/en/cases.html" />\n`;
        }
        
        // 添加对应语言的链接
        links += `<link rel="alternate" hreflang="${hreflang}" href="${siteUrl}/${lang}/cases.html" />\n`;
    });
    
    return links.trim();
}

/**
 * 主函数
 */
function main() {
    const args = process.argv.slice(2);
    let targetLanguages = [...LANGUAGES]; // 默认所有语言
    let showCases = true;  // 默认显示工程案例
    let showNews = true;   // 默认显示新闻动态
    
    // 显示帮助信息
    if (args.includes('--help') || args.includes('-h')) {
        console.log('使用方法: node generate-cases-page-improved.js [语言代码...] [--no-cases] [--no-news]');
        console.log('');
        console.log('选项:');
        console.log('  不带参数         生成所有语言的页面，包含所有菜单项');
        console.log('  [语言代码...]    只生成指定语言的页面');
        console.log('  --no-cases      隐藏"工程案例"菜单项');
        console.log('  --no-news       隐藏"新闻动态"菜单项');
        console.log('  --help, -h      显示帮助信息');
        console.log('');
        console.log(`可用的语言代码: ${LANGUAGES.join(', ')}`);
        process.exit(0);
    }
    
    // 检查菜单控制参数
    if (args.includes('--no-cases')) {
        showCases = false;
        console.log('将隐藏"工程案例"菜单项');
    }
    
    if (args.includes('--no-news')) {
        showNews = false;
        console.log('将隐藏"新闻动态"菜单项');
    }
    
    // 过滤出语言参数（排除带--前缀的选项）
    const langArgs = args.filter(arg => !arg.startsWith('--'));
    
    // 如果提供了语言参数，只生成指定语言的页面
    if (langArgs.length > 0) {
        const requestedLangs = langArgs.filter(arg => LANGUAGES.includes(arg));
        if (requestedLangs.length > 0) {
            targetLanguages = requestedLangs;
            console.log(`将只生成以下语言的页面: ${targetLanguages.join(', ')}`);
        } else {
            console.log('警告：未找到有效的语言参数，将生成所有语言的页面。');
            console.log(`有效的语言参数: ${LANGUAGES.join(', ')}`);
        }
    }
    
    // 确保语言目录存在
    targetLanguages.forEach(lang => {
        const langDir = path.join(__dirname, `../${lang}`);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir);
        }
    });

    // 创建菜单选项对象
    const menuOptions = {
        showCases,
        showNews
    };
    
    // 更新浮动导航配置文件
    const floatingNavConfig = `
/**
 * 浮动导航菜单配置文件
 * 用于控制导航菜单项的显示与隐藏
 */

// 全局配置对象
window.floatingNavConfig = {
    // 是否显示"工程案例"菜单项
    showCases: ${showCases},
    
    // 是否显示"新闻动态"菜单项
    showNews: ${showNews}
};`;

    const floatingNavConfigPath = path.join(__dirname, '../js/floating-nav-config.js');
    fs.writeFileSync(floatingNavConfigPath, floatingNavConfig, 'utf8');
    console.log('已更新浮动导航配置文件');
    
    // 为每种语言生成案例页面
    targetLanguages.forEach(lang => {
        try {
            generateCasesPage(lang, menuOptions);
        } catch (error) {
            console.error(`✗ 生成 ${lang}/cases.html 时出错:`, error);
        }
    });
    
    console.log('\n所有案例页面已成功生成！');
}

main();
