/**
 * 页面组件共享模块
 * 
 * 此模块包含网站通用的页眉、页脚、导航和语言选择器组件，
 * 供generate-page.js和generate-products-page.js共同使用。
 */

const fs = require('fs');
const path = require('path');

// 语言代码列表
const LANGUAGES = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];

// 简化的产品搜索关键词映射表
// 统一使用简洁的核心关键词，确保多语言版本搜索结果一致
const SIMPLIFIED_PRODUCT_KEYWORDS = {
    'plastic-coating': {
        cn: '涂塑',          // 简化为核心词"涂塑"
        en: 'coating',       // 简化为核心词"coating"
        jp: '被覆',          // 简化为核心词"被覆"
        ru: 'покрытие',      // 简化为核心词"покрытие"
        ar: 'طلاء',          // 简化为核心词"طلاء"
        es: 'revestimiento', // 简化为核心词"revestimiento"
        fr: 'revêtement',    // 简化为核心词"revêtement"
        pt: 'revestimento',  // 简化为核心词"revestimento"
        hi: 'कोटिंग',        // 简化为核心词"कोटिंग"
        de: 'Beschichtung'   // 简化为核心词"Beschichtung"
    },
    'anti-corrosion': {
        cn: '防腐',          // 简化为核心词"防腐"
        en: 'corrosion',     // 简化为核心词"corrosion"（搜索包含此词的所有产品）
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
        jp: '配管継手',      // 简化为核心词"配管継手"
        ru: 'фитинг',        // 简化为核心词"фитинг"
        ar: 'تجهيزات',      // 简化为核心词"تجهيزات"
        es: 'accesorio',     // 简化为核心词"accesorio"
        fr: 'raccord',       // 简化为核心词"raccord"
        pt: 'acessório',     // 简化为核心词"acessório"
        hi: 'फिटिंग',       // 简化为核心词"फिटिंग"
        de: 'Fitting'        // 简化为核心词"Fitting"
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

// 语言配置
const languageConfigs = {
    cn: {
        langCode: 'zh-CN',
        homeText: '首页',
        companyName: '恒基泰管道装备',
        companyFullName: '沧州恒基泰管道装备有限公司',
        languageText: '简体中文',
        nav: {
            about: '关于我们',
            products: '产品中心',
            quality: '质量控制',
            cases: '工程案例',
            news: '新闻动态',
            contact: '联系我们'
        },
        submenu: {
            companyProfile: '公司简介',
            corporateCulture: '企业文化',
            certificates: '资质认证',
            factory: '工厂实验室',
            plasticCoating: '涂塑钢管',
            antiCorrosion: '防腐钢管',
            steelPipes: '钢管产品',
            fittings: '管件配件'
        },
        footer: {
            aboutText: '沧州恒基泰管道装备有限公司成立于2026年，是一家专注于管道装备、钢制管件、管托支吊架和防腐管件配套供应的企业。',
            quickLinks: '快速链接',
            contact: '联系我们',
            followUs: '关注我们',
            wechat: '微信',
            linkedin: '领英',
            facebook: '脸书',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 沧州恒基泰管道装备有限公司 版权所有',
            backToTop: '回到顶部'
        },
        contact: {
            phoneTitle: '电话号码',
            emailTitle: '电子邮箱',
            callNowButton: '立即拨打',
            sendEmailButton: '发送邮件',
            workingHoursTitle: '工作时间',
            workingHoursText: '周一至周五: 8:30 - 17:30\n周六: 9:00 - 12:00',
            addressTitle: '地址'
        }
    },
    // 可以添加其他语言的配置，与generate-page.js保持一致
    en: {
        langCode: 'en',
        homeText: 'Home',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        languageText: 'English',
        nav: {
            about: 'About Us',
            products: 'Products',
            quality: 'Quality Control',
            cases: 'Case Studies',
            news: 'News',
            contact: 'Contact Us'
        },
        submenu: {
            companyProfile: 'Company Profile',
            corporateCulture: 'Corporate Culture',
            certificates: 'Certifications',
            factory: 'Factory & Lab',
            plasticCoating: 'Plastic-Coated Steel Pipes',
            antiCorrosion: 'Anti-Corrosion Steel Pipes',
            steelPipes: 'Steel Pipes',
            fittings: 'Pipe Fittings'
        },
        footer: {
            aboutText: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. was established in 2026. It focuses on supplying pipeline equipment, steel pipe fittings, pipe supports and hangers, and anti-corrosion fittings for engineering projects.',
            quickLinks: 'Quick Links',
            contact: 'Contact',
            followUs: 'Follow Us',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. All Rights Reserved',
            backToTop: 'Back to Top'
        },
        contact: {
            emailTitle: 'Email Address',
            sendEmailButton: 'Send Email',
            workingHoursTitle: 'Working Hours',
            workingHoursText: 'Monday - Friday: 8:30 - 17:30\nSaturday: 9:00 - 12:00',
            addressTitle: 'Address'
        }
    },
    // 日语配置
    jp: {
        langCode: 'ja',
        homeText: 'ホーム',
        companyName: '恒基泰管道設備',
        companyFullName: '恒基泰管道設備有限公司',
        languageText: '日本語',
        nav: {
            about: '会社概要',
            products: '製品情報',
            quality: '品質管理',
            cases: '施工実績',
            news: 'ニュース',
            contact: 'お問い合わせ'
        },
        submenu: {
            companyProfile: '会社概要',
            corporateCulture: '企業理念',
            certificates: '認証取得',
            factory: '工場・研究所',
            plasticCoating: 'プラスチック被覆鋼管',
            antiCorrosion: '防食鋼管',
            steelPipes: '鋼管製品',
            fittings: '管継手'
        },
        footer: {
            aboutText: '恒基泰管道設備有限公司は2026年に設立され、配管設備・鋼製継手・管托・支吊架および防食継手などの工程配套製品の供給を専門とする企業です。',
            quickLinks: 'クイックリンク',
            contact: 'お問い合わせ',
            followUs: 'フォロー',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 恒基泰管道設備有限公司 無断転載禁止',
            backToTop: 'ページトップへ'
        },
        contact: {
            phoneTitle: '電話番号',
            emailTitle: 'メールアドレス',
            callNowButton: '今すぐ電話',
            sendEmailButton: 'メールを送る',
            workingHoursTitle: '営業時間',
            workingHoursText: '月曜日～金曜日: 8:30～17:30\n土曜日: 9:00～12:00',
            addressTitle: '所在地'
        }
    },
    // 俄语配置
    ru: {
        langCode: 'ru',
        homeText: 'Главная',
        companyName: 'Хэнцзитай',
        companyFullName: 'Цанчжоу Хэнцзитай Трубопроводное Оборудование',
        languageText: 'Русский',
        nav: {
            about: 'О нас',
            products: 'Продукция',
            quality: 'Контроль качества',
            cases: 'Примеры проектов',
            news: 'Новости',
            contact: 'Контакты'
        },
        submenu: {
            companyProfile: 'Профиль компании',
            corporateCulture: 'Корпоративная культура',
            certificates: 'Сертификаты',
            factory: 'Завод и лаборатория',
            plasticCoating: 'Стальные трубы с пластиковым покрытием',
            antiCorrosion: 'Антикоррозийные стальные трубы',
            steelPipes: 'Стальные трубы',
            fittings: 'Трубные фитинги'
        },
        footer: {
            aboutText: 'Компания основана в 2026 году и специализируется на поставках трубопроводного оборудования, стальных фитингов, опор и подвесок для труб, а также антикоррозионной арматуры для инженерных объектов.',
            quickLinks: 'Быстрые ссылки',
            contact: 'Контакты',
            followUs: 'Подписывайтесь на нас',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Цанчжоу Хэнцзитай Трубопроводное Оборудование. Все права защищены',
            backToTop: 'Наверх'
        },
        contact: {
            phoneTitle: 'Номер телефона',
            emailTitle: 'Электронная почта',
            callNowButton: 'Позвонить сейчас',
            sendEmailButton: 'Отправить письмо',
            workingHoursTitle: 'Рабочие часы',
            workingHoursText: 'Понедельник - Пятница: 8:30 - 17:30\nСуббота: 9:00 - 12:00',
            addressTitle: 'Адрес'
        }
    },
    // 阿拉伯语配置
    ar: {
        langCode: 'ar',
        homeText: 'الرئيسية',
        companyName: 'هنغيون',
        companyFullName: 'شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة',
        languageText: 'العربية',
        nav: {
            about: 'عن الشركة',
            products: 'المنتجات',
            quality: 'مراقبة الجودة',
            cases: 'دراسات الحالة',
            news: 'الأخبار',
            contact: 'اتصل بنا'
        },
        submenu: {
            companyProfile: 'نبذة عن الشركة',
            corporateCulture: 'الثقافة المؤسسية',
            certificates: 'الشهادات',
            factory: 'المصنع والمختبر',
            plasticCoating: 'أنابيب الصلب المطلية بالبلاستيك',
            antiCorrosion: 'أنابيب الصلب المضادة للتآكل',
            steelPipes: 'أنابيب الصلب',
            fittings: 'تجهيزات الأنابيب'
        },
        footer: {
            aboutText: 'تأسست شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة عام 2026، وهي متخصصة في توريد معدات خطوط الأنابيب وتجهيزات الفولاذ ودعامات ومعلِّقات الأنابيب وتجهيزات مكافحة التآكل لمشاريع الهندسة.',
            quickLinks: 'روابط سريعة',
            contact: 'اتصل بنا',
            followUs: 'تابعنا',
            wechat: 'وي تشات',
            linkedin: 'لينكد إن',
            facebook: 'فيسبوك',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة. جميع الحقوق محفوظة',
            backToTop: 'العودة للأعلى'
        },
        contact: {
            phoneTitle: 'رقم الهاتف',
            emailTitle: 'البريد الإلكتروني',
            callNowButton: 'اتصل الآن',
            sendEmailButton: 'إرسال بريد إلكتروني',
            workingHoursTitle: 'ساعات العمل',
            workingHoursText: 'الاثنين - الجمعة: 8:30 - 17:30\nالسبت: 9:00 - 12:00',
            addressTitle: 'العنوان'
        },
        // 设置RTL方向
        direction: 'rtl'
    },
    // 西班牙语配置
    es: {
        langCode: 'es',
        homeText: 'Inicio',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. (Española)',
        languageText: 'Español',
        nav: {
            about: 'Sobre Nosotros',
            products: 'Productos',
            quality: 'Control de Calidad',
            cases: 'Casos de Estudio',
            news: 'Noticias',
            contact: 'Contacto'
        },
        submenu: {
            companyProfile: 'Perfil de la Empresa',
            corporateCulture: 'Cultura Corporativa',
            certificates: 'Certificaciones',
            factory: 'Fábrica y Laboratorio',
            plasticCoating: 'Tubos de Acero con Recubrimiento Plástico',
            antiCorrosion: 'Tubos de Acero Anticorrosión',
            steelPipes: 'Tubos de Acero',
            fittings: 'Accesorios para Tuberías'
        },
        footer: {
            aboutText: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. se fundó en 2026 y se centra en el suministro de equipos de tuberías, accesorios de acero, soportes y colgadores para tuberías, y accesorios anticorrosión para proyectos de ingeniería.',
            quickLinks: 'Enlaces Rápidos',
            contact: 'Contacto',
            followUs: 'Síguenos',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Todos los derechos reservados',
            backToTop: 'Volver Arriba'
        },
        contact: {
            phoneTitle: 'Número de Teléfono',
            emailTitle: 'Correo Electrónico',
            callNowButton: 'Llamar Ahora',
            sendEmailButton: 'Enviar Correo',
            workingHoursTitle: 'Horario Laboral',
            workingHoursText: 'Lunes - Viernes: 8:30 - 17:30\nSábado: 9:00 - 12:00',
            addressTitle: 'Dirección'
        }
    },
    // 法语配置
    fr: {
        langCode: 'fr',
        homeText: 'Accueil',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Industriel Co., Ltd.',
        languageText: 'Français',
        nav: {
            about: 'À Propos',
            products: 'Produits',
            quality: 'Contrôle Qualité',
            cases: 'Études de Cas',
            news: 'Actualités',
            contact: 'Contact'
        },
        submenu: {
            companyProfile: 'Profil de l\'Entreprise',
            corporateCulture: 'Culture d\'Entreprise',
            certificates: 'Certifications',
            factory: 'Usine et Laboratoire',
            plasticCoating: 'Tubes en Acier Revêtus de Plastique',
            antiCorrosion: 'Tubes en Acier Anticorrosion',
            steelPipes: 'Tubes en Acier',
            fittings: 'Raccords de Tuyauterie'
        },
        footer: {
            aboutText: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. a été créée en 2026. Elle se spécialise dans l\'approvisionnement en équipements de tuyauterie, raccords en acier, supports et suspentes pour tuyauteries, et raccords anticorrosion pour projets d\'ingénierie.',
            quickLinks: 'Liens Rapides',
            contact: 'Contact',
            followUs: 'Suivez-nous',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Tous droits réservés',
            backToTop: 'Retour en Haut'
        },
        contact: {
            phoneTitle: 'Numéro de Téléphone',
            emailTitle: 'Adresse Email',
            callNowButton: 'Appeler Maintenant',
            sendEmailButton: 'Envoyer un Email',
            workingHoursTitle: 'Heures de Travail',
            workingHoursText: 'Lundi - Vendredi: 8:30 - 17:30\nSamedi: 9:00 - 12:00',
            addressTitle: 'Adresse'
        }
    },
    // 葡萄牙语配置
    pt: {
        langCode: 'pt',
        homeText: 'Início',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. (Portugal)',
        languageText: 'Português',
        nav: {
            about: 'Sobre Nós',
            products: 'Produtos',
            quality: 'Controle de Qualidade',
            cases: 'Estudos de Caso',
            news: 'Notícias',
            contact: 'Contato'
        },
        submenu: {
            companyProfile: 'Perfil da Empresa',
            corporateCulture: 'Cultura Corporativa',
            certificates: 'Certificações',
            factory: 'Fábrica e Laboratório',
            plasticCoating: 'Tubos de Aço Revestidos com Plástico',
            antiCorrosion: 'Tubos de Aço Anticorrosão',
            steelPipes: 'Tubos de Aço',
            fittings: 'Conexões para Tubulação'
        },
        footer: {
            aboutText: 'A Cangzhou Hengjitai Pipeline Equipment Co., Ltd. foi fundada em 2026 e foca no fornecimento de equipamentos de tubulação, conexões de aço, suportes e suspensões para tubulações, e conexões anticorrosão para projetos de engenharia.',
            quickLinks: 'Links Rápidos',
            contact: 'Contato',
            followUs: 'Siga-nos',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Todos os direitos reservados',
            backToTop: 'Voltar ao Topo'
        },
        contact: {
            phoneTitle: 'Número de Telefone',
            emailTitle: 'Endereço de Email',
            callNowButton: 'Ligar Agora',
            sendEmailButton: 'Enviar Email',
            workingHoursTitle: 'Horário de Trabalho',
            workingHoursText: 'Segunda - Sexta: 8:30 - 17:30\nSábado: 9:00 - 12:00',
            addressTitle: 'Endereço'
        }
    },
    // 印地语配置
    hi: {
        langCode: 'hi',
        homeText: 'होम',
        companyName: 'हेंगजिताई',
        companyFullName: 'कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड',
        languageText: 'हिन्दी',
        nav: {
            about: 'हमारे बारे में',
            products: 'उत्पाद',
            quality: 'गुणवत्ता नियंत्रण',
            cases: 'केस स्टडीज',
            news: 'समाचार',
            contact: 'संपर्क करें'
        },
        submenu: {
            companyProfile: 'कंपनी प्रोफाइल',
            corporateCulture: 'कॉर्पोरेट संस्कृति',
            certificates: 'प्रमाणपत्र',
            factory: 'फैक्ट्री और प्रयोगशाला',
            plasticCoating: 'प्लास्टिक लेपित स्टील पाइप',
            antiCorrosion: 'जंग रोधी स्टील पाइप',
            steelPipes: 'स्टील पाइप',
            fittings: 'पाइप फिटिंग्स'
        },
        footer: {
            aboutText: 'कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड की स्थापना 2026 में हुई; यह पाइपलाइन उपकरण, स्टील पाइप फिटिंग्स, पाइप सपोर्ट व हैंगर, और इंजीनियरिंग परियोजनाओं के लिए एंटी-कोरोज़न फिटिंग्स की आपूर्ति पर केंद्रित है।',
            quickLinks: 'त्वरित लिंक',
            contact: 'संपर्क',
            followUs: 'हमें फॉलो करें',
            wechat: 'वीचैट',
            linkedin: 'लिंक्डइन',
            facebook: 'फेसबुक',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड। सर्वाधिकार सुरक्षित',
            backToTop: 'वापस शीर्ष पर'
        },
        contact: {
            phoneTitle: 'फोन नंबर',
            emailTitle: 'ईमेल पता',
            callNowButton: 'अभी कॉल करें',
            sendEmailButton: 'ईमेल भेजें',
            workingHoursTitle: 'कार्य घंटे',
            workingHoursText: 'सोमवार - शुक्रवार: 8:30 - 17:30\nशनिवार: 9:00 - 12:00',
            addressTitle: 'पता'
        }
    },
    // 德语配置
    de: {
        langCode: 'de',
        homeText: 'Startseite',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        languageText: 'Deutsch',
        nav: {
            about: 'Über uns',
            products: 'Produkte',
            quality: 'Qualitätskontrolle',
            cases: 'Referenzen',
            news: 'Aktuelles',
            contact: 'Kontakt'
        },
        submenu: {
            companyProfile: 'Unternehmensprofil',
            corporateCulture: 'Unternehmenskultur',
            certificates: 'Zertifikate',
            factory: 'Werk & Labor',
            plasticCoating: 'Kunststoffummantelte Stahlrohre',
            antiCorrosion: 'Korrosionsgeschützte Stahlrohre',
            steelPipes: 'Stahlrohre',
            fittings: 'Rohrarmaturen'
        },
        footer: {
            aboutText: 'Die Cangzhou Hengjitai Pipeline Equipment Co., Ltd. wurde 2026 gegründet und liefert Rohrleitungsausrüstung, Stahlfittings, Rohrlager und -aufhängungen sowie korrosionsbeständige Armaturen für Ingenieurprojekte.',
            quickLinks: 'Schnellnavigation',
            contact: 'Kontakt',
            followUs: 'Folgen Sie uns',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Alle Rechte vorbehalten',
            backToTop: 'Nach oben'
        },
        contact: {
            phoneTitle: 'Telefonnummer',
            emailTitle: 'E-Mail-Adresse',
            callNowButton: 'Jetzt anrufen',
            sendEmailButton: 'E-Mail senden',
            workingHoursTitle: 'Arbeitszeiten',
            workingHoursText: 'Montag - Freitag: 8:30 - 17:30\nSamstag: 9:00 - 12:00',
            addressTitle: 'Adresse'
        }
    }
};

// 产品相关翻译，仅在generate-products-page.js中使用
const productTranslations = {
    'company_name': {
        'cn': '沧州恒基泰管道装备有限公司',
        'en': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        'ar': 'شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة',
        'jp': 'ホーベイ・ヘンヨン産業有限公司',
        'ru': 'Хэбэй Хэнъюань Индастриал Ко., Лтд.',
        'es': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        'fr': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        'pt': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        'hi': 'हेबेई हेंगयुआन इंडस्ट्रियल कं, लिमिटेड',
        'de': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.'
    },
    'company_short_name': {
        'cn': '恒基泰管道装备',
        'en': 'Hengjitai',
        'ar': 'هنغيون',
        'jp': 'ヘンヨン',
        'ru': 'Хэнъюань',
        'es': 'Hengjitai',
        'fr': 'Hengjitai',
        'pt': 'Hengjitai',
        'hi': 'हेंगयुआन',
        'de': 'Hengjitai'
    },
    'view_details': {
        'cn': '查看详情',
        'en': 'View Details',
        'ar': 'عرض التفاصيل',
        'jp': '詳細を見る',
        'ru': 'Показать детали',
        'es': 'Ver detalles',
        'fr': 'Voir les détails',
        'pt': 'Ver detalhes',
        'hi': 'विवरण देखें',
        'de': 'Details ansehen'
    },
    'product_description': {
        'cn': '产品描述',
        'en': 'Product Description',
        'ar': 'وصف المنتج',
        'jp': '製品説明',
        'ru': 'Описание продукта',
        'es': 'Descripción del producto',
        'fr': 'Description du produit',
        'pt': 'Descrição do produto',
        'hi': 'उत्पाद विवरण',
        'de': 'Produktbeschreibung'
    },
    'products_page_title': {
        'cn': '产品中心',
        'en': 'Products',
        'ar': 'المنتجات',
        'jp': '製品',
        'ru': 'Продукты',
        'es': 'Productos',
        'fr': 'Produits',
        'pt': 'Produtos',
        'hi': 'उत्पाद',
        'de': 'Produkte'
    },
    'categories_title': {
        'cn': '产品分类',
        'en': 'Product Categories',
        'ar': 'فئات المنتجات',
        'jp': '製品カテゴリ',
        'ru': 'Категории продукции',
        'es': 'Categorías de productos',
        'fr': 'Catégories de produits',
        'pt': 'Categorias de produtos',
        'hi': 'उत्पाद श्रेणियां',
        'de': 'Produktkategorien'
    },
    'home_breadcrumb': {
        'cn': '首页',
        'en': 'Home',
        'ar': 'الرئيسية',
        'jp': 'ホーム',
        'ru': 'Главная',
        'es': 'Inicio',
        'fr': 'Accueil',
        'pt': 'Início',
        'hi': 'होम',
        'de': 'Startseite'
    },
    'page_description_products': {
        'cn': '沧州恒基泰管道装备有限公司提供各种涂塑钢管、防腐钢管和管件配件产品，专业定制各类工业用管道解决方案。',
        'en': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. offers a variety of plastic-coated steel pipes, anti-corrosion steel pipes, and pipe fittings, specializing in customized industrial pipeline solutions.',
        'ar': 'تقدم شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة مجموعة متنوعة من أنابيب الصلب المطلية بالبلاستيك وأنابيب الصلب المضادة للتآكل وتجهيزات الأنابيب، وتتخصص في حلول خطوط الأنابيب الصناعية المخصصة.',
        'jp': 'ホーベイ・ヘンヨン産業有限公司は、さまざまな樹脂コーティング鋼管、防食鋼管、配管部品を提供し、工業用パイプラインソリューションをカスタマイズしております。',
        'ru': 'Хэбэй Хэнъюань Индастриал Ко., Лтд. предлагает различные виды стальных труб с пластиковым покрытием, антикоррозийных стальных труб и фитингов, специализируясь на индивидуальных решениях для промышленных трубопроводов.',
        'es': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. ofrece una variedad de tubos de acero recubiertos de plástico, tubos de acero anticorrosión y accesorios para tuberías, especializándose en soluciones personalizadas para tuberías industriales.',
        'fr': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. offre une variété de tuyaux en acier revêtus de plastique, de tuyaux en acier anticorrosion et de raccords, se spécialisant dans des solutions personnalisées de conduites industrielles.',
        'pt': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. oferece uma variedade de tubos de aço revestidos de plástico, tubos de aço anticorrosão e acessórios para tubulação, especializando-se em soluções personalizadas de tubulação industrial.',
        'hi': 'हेबेई हेंगयुआन इंडस्ट्रियल कं, लिमिटेड प्लास्टिक-लेपित स्टील पाइप, जंग-रोधी स्टील पाइप, और पाइप फिटिंग की विविधता प्रदान करता है, जो अनुकूलित औद्योगिक पाइपलाइन समाधानों में विशेषज्ञता रखता है।',
        'de': 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. bietet eine Vielzahl von kunststoffbeschichteten Stahlrohren, korrosionsbeständigen Stahlrohren und Rohrverbindungsstücken an und spezialisiert sich auf maßgeschneiderte industrielle Rohrleitungslösungen.'
    },
    'page_keywords_products': {
        'cn': '涂塑钢管, 防腐钢管, 钢管, 管件配件, 工业管道, 管道解决方案',
        'en': 'plastic-coated steel pipes, anti-corrosion steel pipes, steel pipes, pipe fittings, industrial pipelines, pipeline solutions',
        'ar': 'أنابيب الصلب المطلية بالبلاستيك، أنابيب الصلب المضادة للتآكل، أنابيب الصلب، تجهيزات الأنابيب، خطوط الأنابيب الصناعية، حلول خطوط الأنابيب',
        'jp': '樹脂コーティング鋼管、防食鋼管、鋼管、配管部品、工業用パイプライン、パイプラインソリューション',
        'ru': 'стальные трубы с пластиковым покрытием, антикоррозийные стальные трубы, стальные трубы, фитинги, промышленные трубопроводы, решения для трубопроводов',
        'es': 'tubos de acero recubiertos de plástico, tubos de acero anticorrosión, tubos de acero, accesorios para tuberías, tuberías industriales, soluciones для tuberías',
        'fr': 'tuyaux en acier revêtus de plastique, tuyaux en acier anticorrosion, tuyaux en acier, raccords de tuyauterie, conduites industrielles, solutions de conduites',
        'pt': 'tubos de aço revestidos de plástico, tubos de aço anticorrosão, tubos de aço, acessórios para tubulação, tubulações industriais, soluções de tubulação',
        'hi': 'प्लास्टिक-लेपित स्टील पाइप, जंग-रोधी स्टील पाइप, स्टील पाइप, पाइप फिटिंग, औद्योगिक पाइपलाइन, पाइपलाइन समाधान',
        'de': 'kunststoffbeschichtete Stahlrohre, korrosionsbeständige Stahlrohre, Stahlrohre, Rohrverbindungsstücke, industrielle Rohrleitungen, Rohrleitungslösungen'
    },
    'all_products': {
        'cn': '所有产品',
        'en': 'All Products',
        'ar': 'جميع المنتجات',
        'jp': '全製品',
        'ru': 'Все продукты',
        'es': 'Todos los productos',
        'fr': 'Tous les produits',
        'pt': 'Todos os produtos',
        'hi': 'सभी उत्पाद',
        'de': 'Alle Produkte'
    },
    'search_products': {
        'cn': '搜索产品...',
        'en': 'Search products...',
        'ar': 'بحث عن منتجات...',
        'jp': '製品を検索...',
        'ru': 'Поиск продуктов...',
        'es': 'Buscar productos...',
        'fr': 'Rechercher des produits...',
        'pt': 'Pesquisar produtos...',
        'hi': 'उत्पादों की खोज करें...',
        'de': 'Produkte suchen...'
    },
    'application': {
        'cn': '应用领域',
        'en': 'Application',
        'ar': 'التطبيق',
        'jp': '応用分野',
        'ru': 'Применение',
        'es': 'Aplicación',
        'fr': 'Application',
        'pt': 'Aplicação',
        'hi': 'अनुप्रयोग',
        'de': 'Anwendung'
    },
    'diameter': {
        'cn': '直径',
        'en': 'Diameter',
        'ar': 'القطر',
        'jp': '直径',
        'ru': 'Диаметр',
        'es': 'Diámetro',
        'fr': 'Diamètre',
        'pt': 'Diâmetro',
        'hi': 'व्यास',
        'de': 'Durchmesser'
    },
    'back_to_top': {
        'cn': '返回顶部',
        'en': 'Back to Top',
        'ar': 'العودة للأعلى',
        'jp': 'トップに戻る',
        'ru': 'Наверх',
        'es': 'Volver arriba',
        'fr': 'Retour en haut',
        'pt': 'Voltar ao topo',
        'hi': 'वापस शीर्ष पर',
        'de': 'Nach oben'
    },
    'products_count_format': {
        'cn': '{0}个产品',
        'en': '{0} products',
        'ar': '{0} منتج',
        'jp': '製品{0}点',
        'ru': '{0} продуктов',
        'es': '{0} productos',
        'fr': '{0} produits',
        'pt': '{0} produtos',
        'hi': '{0} उत्पाद',
        'de': '{0} Produkte'
    }
};

/**
 * 生成导航菜单HTML
 * @param {string} lang 语言代码
 * @param {number} pageDepth 页面深度（0表示语言根目录，1表示子目录）
 * @returns {string} 导航菜单HTML
 */
/**
 * 生成导航菜单HTML
 * @param {string} lang - 语言代码
 * @param {number} pageDepth - 页面深度，用于构建相对链接
 * @param {Object} options - 控制菜单显示的选项
 * @param {boolean} options.showCases - 是否显示"工程案例"菜单项，默认为true
 * @param {boolean} options.showNews - 是否显示"新闻动态"菜单项，默认为true
 * @returns {string} 导航菜单HTML
 */
function getNavigationMenuHTML(lang, pageDepth = 0, options = {}) {
    if (!languageConfigs[lang]) {
        console.warn(`警告: 未找到语言 ${lang} 的配置，使用英文作为后备。`);
        lang = 'en';
    }
    
    // 设置选项默认值
    const { showCases = true, showNews = true } = options;
    
    const config = languageConfigs[lang];
    const basePrefix = pageDepth === 0 ? '' : '../'.repeat(pageDepth);
    
    // 确保导航链接包含语言代码
    // 根据页面深度构建到语言根目录的路径
    const langPath = pageDepth === 0 ? `${lang}/` : `${basePrefix}${lang}/`;
    
    let activeClass = 'text-primary border-b-2 border-primary';
    let normalClass = 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary';
    
    // 根据页面深度构建不同的链接
    // 如果在子目录中，需要处理到语言根目录的路径并加上语言代码
    // 如果在语言根目录中，直接使用相对链接
    const createLink = (fileName) => {
        if (pageDepth >= 1) {
            return `${basePrefix}${lang}/${fileName}`;
        } else {
            return fileName;
        }
    };

    return `
<nav class="hidden lg:flex space-x-8">
    <div class="nav-item">
        <a href="${createLink('index.html')}" class="${normalClass} px-3 py-2" title="${config.homeText}">
            ${config.homeText}
        </a>
    </div>
    <div class="nav-item">
        <a href="${createLink('about.html')}" class="${normalClass} px-3 py-2" title="${config.nav.about}">
            ${config.nav.about}
        </a>
    </div>
    <div class="nav-item dropdown relative group">
        <a href="${createLink('products.html')}" class="${normalClass} px-3 py-2" title="${config.nav.products}">
            ${config.nav.products} <i class="fas fa-chevron-down text-xs ml-1"></i>
        </a>
        <div class="dropdown-menu hidden group-hover:block absolute bg-white min-w-[200px] shadow-lg rounded-lg mt-1 py-2 z-50 left-0">
            <a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('plastic-coating', lang))}" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                ${config.submenu.plasticCoating}
            </a>
            <a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('anti-corrosion', lang))}" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                ${config.submenu.antiCorrosion}
            </a>
            <a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('steel-pipes', lang))}" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                ${config.submenu.steelPipes}
            </a>
            <a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('pipe-fittings', lang))}" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                ${config.submenu.fittings}
            </a>
        </div>
    </div>
    <div class="nav-item">
        <a href="${createLink('quality.html')}" class="${normalClass} px-3 py-2" title="${config.nav.quality}">
            ${config.nav.quality}
        </a>
    </div>
    ${showCases ? `
    <div class="nav-item">
        <a href="${createLink('cases.html')}" class="${normalClass} px-3 py-2" title="${config.nav.cases}">
            ${config.nav.cases}
        </a>
    </div>` : ''}
    ${showNews ? `
    <div class="nav-item">
        <a href="${createLink('news.html')}" class="${normalClass} px-3 py-2" title="${config.nav.news}">
            ${config.nav.news}
        </a>
    </div>` : ''}
    <div class="nav-item">
        <a href="${createLink('contact.html')}" class="${normalClass} px-3 py-2" title="${config.nav.contact}">
            ${config.nav.contact}
        </a>
    </div>
</nav>`;
}

/**
 * 生成语言选择器HTML
 * @param {string} lang 当前语言代码
 * @param {string} pagePathWithinLangRoot 当前页面在语言根目录中的路径（如 'products.html' 或 'hp-products/category-name.html'）
 * @param {string} relativePathToOtherLangRoot 当前页面到其他语言根目录的相对路径（如 '../' 或 '../../'）
 * @returns {string} 语言选择器HTML
 */
function getLanguageSelectorHTML(lang, pagePathWithinLangRoot, relativePathToOtherLangRoot) {
    // 检查是否为RTL语言
    const isRTL = lang === 'ar';
    
    // 获取语言名称显示
    function getLanguageDisplay(code) {
        return languageConfigs[code]?.languageText || new Intl.DisplayNames([code], { type: 'language' }).of(code);
    }

    let options = '';
    LANGUAGES.forEach(l => {
        // 当前语言不生成链接
        if (l === lang) return;
        
        const langDisplay = getLanguageDisplay(l);
        const targetUrl = `${relativePathToOtherLangRoot}${l}/${pagePathWithinLangRoot}`;
        options += `<a href="${targetUrl}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">${langDisplay}</a>`;
    });

    return `
<div id="language-dropdown" class="language-dropdown relative">
    <button id="language-button" type="button" class="flex items-center space-x-2 text-gray-700 hover:text-primary">
        <span>${getLanguageDisplay(lang)}</span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
    </button>
    <div id="language-menu" class="hidden absolute ${isRTL ? 'left-0' : 'right-0'} w-48 mt-2 py-2 bg-white rounded-lg shadow-lg z-50">
        ${options}
    </div>
</div>`;
}

/**
 * 生成页脚HTML
 * @param {string} lang 语言代码
 * @param {number} pageDepth 页面深度（0表示语言根目录，1表示子目录）
 * @returns {string} 页脚HTML
 */
function getFooterHTML(lang, pageDepth = 0) {
    if (!languageConfigs[lang]) {
        console.warn(`警告: 未找到语言 ${lang} 的配置，使用英文作为后备。`);
        lang = 'en';
    }
    
    const config = languageConfigs[lang];
    const currentYear = new Date().getFullYear();
    
    const basePrefix = pageDepth === 0 ? '' : '../'.repeat(pageDepth);
    
    const createLink = (fileName) => {
        if (pageDepth >= 1) {
            return `${basePrefix}${lang}/${fileName}`;
        } else {
            return fileName;
        }
    };
    
    return `
<footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
                <h3 class="text-xl font-semibold mb-4">${config.nav.about}</h3>
                <p class="text-gray-400 mb-4">${config.footer.aboutText}</p>
            </div>
            <div>
                <h3 class="text-xl font-semibold mb-4">${config.footer.quickLinks}</h3>
                <ul class="space-y-2">
                    <li><a href="${createLink('index.html')}" class="text-gray-400 hover:text-primary">${config.homeText}</a></li>
                    <li><a href="${createLink('about.html')}" class="text-gray-400 hover:text-primary">${config.nav.about}</a></li>
                    <li><a href="${createLink('products.html')}" class="text-gray-400 hover:text-primary">${config.nav.products}</a></li>
                    <li><a href="${createLink('quality.html')}" class="text-gray-400 hover:text-primary">${config.nav.quality}</a></li>
                    <li><a href="${createLink('cases.html')}" class="text-gray-400 hover:text-primary">${config.nav.cases}</a></li>
                    <li><a href="${createLink('news.html')}" class="text-gray-400 hover:text-primary">${config.nav.news}</a></li>
                    <li><a href="${createLink('contact.html')}" class="text-gray-400 hover:text-primary">${config.nav.contact}</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-xl font-semibold mb-4">${config.nav.products}</h3>
                <ul class="space-y-2">
                    <li><a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('plastic-coating', lang))}" class="text-gray-400 hover:text-primary">${config.submenu.plasticCoating}</a></li>
                    <li><a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('anti-corrosion', lang))}" class="text-gray-400 hover:text-primary">${config.submenu.antiCorrosion}</a></li>
                    <li><a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('steel-pipes', lang))}" class="text-gray-400 hover:text-primary">${config.submenu.steelPipes}</a></li>
                    <li><a href="${createLink('products.html')}?search=${encodeURIComponent(getSimplifiedKeyword('pipe-fittings', lang))}" class="text-gray-400 hover:text-primary">${config.submenu.fittings}</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-xl font-semibold mb-4">${config.footer.contact}</h3>
                <ul class="space-y-2 text-gray-400">
                    <li class="flex items-start">
                        <i class="fas fa-map-marker-alt mt-1 mr-2"></i>
                        <span>${config.footer.address}</span>
                    </li>
                    <li>
                        <a href="mailto:${config.footer.email}" class="flex items-center hover:text-primary">
                            <i class="fas fa-envelope mr-2"></i>
                            <span>${config.footer.email}</span>
                        </a>
                    </li>
                    <li>
                        <a href="tel:${config.footer.phone}" class="flex items-center hover:text-primary">
                            <i class="fas fa-phone mr-2"></i>
                            <span>${config.footer.phone}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="border-t border-gray-700 pt-4 text-center">
            <p class="text-gray-400">${config.footer.copyright.replace('2025', currentYear)}</p>
        </div>
    </div>
</footer>`;
}

/**
 * 生成返回顶部按钮HTML
 * @param {string} lang 语言代码
 * @returns {string} 返回顶部按钮HTML
 */
function getBackToTopHTML(lang) {
    if (!languageConfigs[lang]) {
        console.warn(`警告: 未找到语言 ${lang} 的配置，使用英文作为后备。`);
        lang = 'en';
    }

    const config = languageConfigs[lang];
    const isRTL = lang === 'ar';
    const position = isRTL ? 'left-8' : 'right-8';

    return `
<div id="back-to-top" class="fixed bottom-8 ${position} hidden z-50">
    <a href="#" class="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark">
        <i class="fas fa-arrow-up"></i>
        <span class="sr-only">${config.footer.backToTop}</span>
    </a>
</div>`;
}

/**
 * 获取指定语言的配置
 * @param {string} lang 语言代码
 * @returns {Object} 语言配置对象
 */
function getLanguageConfig(lang) {
    return languageConfigs[lang] || languageConfigs['en']; // 默认使用英文
}

/**
 * 获取产品相关翻译
 * @param {string} key 翻译键
 * @param {string} lang 语言代码
 * @returns {string} 翻译文本
 */
function getProductTranslation(key, lang) {
    return productTranslations[key]?.[lang] || productTranslations[key]?.['en'] || key;
}

module.exports = {
    LANGUAGES,
    languageConfigs,
    productTranslations,
    getNavigationMenuHTML,
    getLanguageSelectorHTML,
    getFooterHTML,
    getBackToTopHTML,
    getLanguageConfig,
    getProductTranslation,
    getSimplifiedKeyword
};
