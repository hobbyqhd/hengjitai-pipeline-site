const fs = require('fs');
const path = require('path');
const config = require('./config');
const utils = require('./shared/utils');
const pageComponents = require('./shared/page-components');
const metadata = require('./shared/metadata');
const pageSeo = require('./shared/page-seo');

// 导入语言列表和配置
const LANGUAGES = pageComponents.LANGUAGES;

// 案例部分标题的多语言配置
const CASES_TITLE = {
    cn: '工程案例',
    en: 'Case Studies',
    jp: '施工実績',
    ru: 'Наши проекты',
    ar: 'دراسات الحالة',
    es: 'Casos de Estudio',
    fr: 'Études de Cas',
    pt: 'Estudos de Caso',
    hi: 'केस स्टडी',
    de: 'Referenzen'
};

// 案例部分描述的多语言配置
const CASES_DESC = {
    cn: '我们的成功案例，覆盖多个行业领域',
    en: 'Our successful projects across various industry sectors',
    jp: '様々な産業分野にわたる当社の成功事例',
    ru: 'Наши успешные проекты в различных отраслях промышленности',
    ar: 'مشاريعنا الناجحة عبر مختلف قطاعات الصناعة',
    es: 'Nuestros proyectos exitosos en varios sectores industriales',
    fr: 'Nos projets réussis dans divers secteurs industriels',
    pt: 'Nossos projetos bem-sucedidos em vários setores industriais',
    hi: 'विभिन्न उद्योग क्षेत्रों में हमारे सफल परियोजनाएँ',
    de: 'Unsere erfolgreichen Projekte in verschiedenen Industriesektoren'
};

// 详情按钮的多语言配置
const VIEW_DETAILS = {
    cn: '查看详情',
    en: 'View Details',
    jp: '詳細を見る',
    ru: 'Подробнее',
    ar: 'عرض التفاصيل',
    es: 'Ver Detalles',
    fr: 'Voir Détails',
    pt: 'Ver Detalhes',
    hi: 'विवरण देखें',
    de: 'Details anzeigen'
};

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
        de: 'Ummantelung'    // 更改为更准确的技术术语"Ummantelung"
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
        de: 'Armaturen'      // 更改为更准确的技术术语"Armaturen"
    }
};

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
            contact: '联系方式',
            followUs: '关注我们',
            wechat: '微信',
            linkedin: '领英',
            facebook: '脸书',
            address: '中国河北省沧州市盐山县边务镇李郭庄村口南100米',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 沧州恒基泰管道装备有限公司 版权所有 | 冀ICP备xxxxxxxx号',
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
            address:
                '100 m south of the entrance to Liguo Zhuang Village, Bianwu Town, Yanshan County, Cangzhou City, Hebei Province, China',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. All Rights Reserved | ICP No.xxxxxxxx',
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
            address:
                '中国河北省滄州市塩山県辺務鎮李郭荘村・村口から南へ100メートル',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 恒基泰管道設備有限公司 無断転載禁止 | ICP登録番号 xxxxxxxx',
            backToTop: 'ページトップへ'
        },
        contact: {
            emailTitle: 'メールアドレス',
            sendEmailButton: 'メールを送る',
            workingHoursTitle: '営業時間',
            workingHoursText: '月曜日～金曜日: 8:30～17:30\n土曜日: 9:00～12:00',
            addressTitle: '所在地'
        }
    },
    ru: {
        langCode: 'ru',
        homeText: 'Главная',
        companyName: 'Хэнцзитай',
        companyFullName: 'Цанчжоу Хэнцзитай Трубопроводное Оборудование',
        languageText: 'Русский',
        nav: {
            about: 'О компании',
            products: 'Продукция',
            quality: 'Контроль качества',
            cases: 'Наши проекты',
            news: 'Новости',
            contact: 'Контакты'
        },
        submenu: {
            companyProfile: 'О нас',
            corporateCulture: 'Корпоративная культура',
            certificates: 'Сертификаты и награды',
            factory: 'Производство и лаборатория',
            plasticCoating: 'Трубы с полимерным покрытием',
            antiCorrosion: 'Антикоррозионные трубы',
            steelPipes: 'Стальные трубы',
            fittings: 'Трубопроводная арматура'
        },
        footer: {
            aboutText: 'Компания основана в 2026 году и специализируется на поставках трубопроводного оборудования, стальных фитингов, опор и подвесок для труб, а также антикоррозионной арматуры для инженерных объектов.',
            quickLinks: 'Быстрые ссылки',
            contact: 'Контакты',
            followUs: 'Следите за нами',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address:
                '100 м к югу от въезда в деревню Лигочжуан, посёлок Бяньу, уезд Яньшань, город Цанчжоу, провинция Хэбэй, Китай',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Цанчжоу Хэнцзитай Трубопроводное Оборудование. Все права защищены | ICP №xxxxxxxx',
            backToTop: 'Наверх'
        },
        contact: {
            emailTitle: 'Адрес электронной почты',
            sendEmailButton: 'Отправить письмо',
            workingHoursTitle: 'Время работы',
            workingHoursText: 'Понедельник - Пятница: 8:30 - 17:30\nСуббота: 9:00 - 12:00',
            addressTitle: 'Адрес'
        }
    },
    ar: {
        langCode: 'ar',
        homeText: 'الرئيسية',
        companyName: 'هينغجيتاي',
        companyFullName: 'شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة',
        languageText: 'العربية',
        nav: {
            about: 'من نحن',
            products: 'المنتجات',
            quality: 'الجودة',
            cases: 'المشاريع',
            news: 'الأخبار',
            contact: 'اتصل بنا'
        },
        submenu: {
            companyProfile: 'نبذة عن الشركة',
            corporateCulture: 'ثقافة الشركة',
            certificates: 'الشهادات والتراخيص',
            factory: 'المصنع والمختبر',
            plasticCoating: 'أنابيب مغلفة بالبوليمر',
            antiCorrosion: 'أنابيب مقاومة للتآكل',
            steelPipes: 'أنابيب فولاذية',
            fittings: 'تجهيزات الأنابيب'
        },
        footer: {
            aboutText: 'تأسست شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة عام 2026، وهي متخصصة في توريد معدات خطوط الأنابيب وتجهيزات الفولاذ ودعامات ومعلِّقات الأنابيب وتجهيزات مكافحة التآكل لمشاريع الهندسة.',
            quickLinks: 'روابط سريعة',
            contact: 'اتصل بنا',
            followUs: 'تابعنا',
            wechat: 'وي شات',
            linkedin: 'لينكد إن',
            facebook: 'فيسبوك',
            address:
                '100 متر جنوب بوابة قرية ليغوزهوانغ، بلدة بيانوو، مقاطعة يانشان، مدينة كانغتشو، مقاطعة خبي، الصين',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب المحدودة. جميع الحقوق محفوظة | رقم ICP xxxxxxxx',
            backToTop: 'العودة للأعلى'
        },
        contact: {
            emailTitle: 'البريد الإلكتروني',
            sendEmailButton: 'إرسال بريد إلكتروني',
            workingHoursTitle: 'ساعات العمل',
            workingHoursText: 'الاثنين - الجمعة: 8:30 - 17:30\nالسبت: 9:00 - 12:00',
            addressTitle: 'العنوان'
        }
    },
    es: {
        langCode: 'es',
        homeText: 'Inicio',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        languageText: 'Español',
        nav: {
            about: 'Sobre Nosotros',
            products: 'Productos',
            quality: 'Control de Calidad',
            cases: 'Proyectos',
            news: 'Noticias',
            contact: 'Contacto'
        },
        submenu: {
            companyProfile: 'Perfil de la Empresa',
            corporateCulture: 'Cultura Corporativa',
            certificates: 'Certificaciones',
            factory: 'Fábrica y Laboratorio',
            plasticCoating: 'Tubos con Recubrimiento Plástico',
            antiCorrosion: 'Tubos Anticorrosión',
            steelPipes: 'Tubos de Acero',
            fittings: 'Accesorios'
        },
        footer: {
            aboutText: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. se fundó en 2026 y se centra en el suministro de equipos de tuberías, accesorios de acero, soportes y colgadores para tuberías, y accesorios anticorrosión para proyectos de ingeniería.',
            quickLinks: 'Enlaces Rápidos',
            contact: 'Contacto',
            followUs: 'Síguenos',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address:
                'A 100 m al sur de la entrada del pueblo de Liguo Zhuang, municipio de Bianwu, condado de Yanshan, ciudad de Cangzhou, provincia de Hebei, China',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Todos los derechos reservados | ICP No.xxxxxxxx',
            backToTop: 'Volver Arriba'
        },
        contact: {
            emailTitle: 'Correo Electrónico',
            sendEmailButton: 'Enviar Correo',
            workingHoursTitle: 'Horario de Trabajo',
            workingHoursText: 'Lunes - Viernes: 8:30 - 17:30\nSábado: 9:00 - 12:00',
            addressTitle: 'Dirección'
        }
    },
    fr: {
        langCode: 'fr',
        homeText: 'Accueil',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        languageText: 'Français',
        nav: {
            about: 'À Propos',
            products: 'Produits',
            quality: 'Contrôle Qualité',
            cases: 'Projets',
            news: 'Actualités',
            contact: 'Contact'
        },
        submenu: {
            companyProfile: 'Profil de l\'Entreprise',
            corporateCulture: 'Culture d\'Entreprise',
            certificates: 'Certifications',
            factory: 'Usine et Laboratoire',
            plasticCoating: 'Tubes Revêtement Plastique',
            antiCorrosion: 'Tubes Anticorrosion',
            steelPipes: 'Tubes en Acier',
            fittings: 'Raccords'
        },
        footer: {
            aboutText: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. a été créée en 2026. Elle se spécialise dans l\'approvisionnement en équipements de tuyauterie, raccords en acier, supports et suspentes pour tuyauteries, et raccords anticorrosion pour projets d\'ingénierie.',
            quickLinks: 'Liens Rapides',
            contact: 'Contact',
            followUs: 'Suivez-nous',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address:
                "À 100 m au sud de l'entrée du village de Liguo Zhuang, commune de Bianwu, district de Yanshan, ville de Cangzhou, province du Hebei, Chine",
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Tous droits réservés | ICP No.xxxxxxxx',
            backToTop: 'Retour en Haut'
        },
        contact: {
            emailTitle: 'Adresse Email',
            sendEmailButton: 'Envoyer Email',
            workingHoursTitle: 'Heures d\'Ouverture',
            workingHoursText: 'Lundi - Vendredi: 8:30 - 17:30\nSamedi: 9:00 - 12:00',
            addressTitle: 'Adresse'
        }
    },
    pt: {
        langCode: 'pt',
        homeText: 'Início',
        companyName: 'Hengjitai',
        companyFullName: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd.',
        languageText: 'Português',
        nav: {
            about: 'Sobre Nós',
            products: 'Produtos',
            quality: 'Controle de Qualidade',
            cases: 'Projetos',
            news: 'Notícias',
            contact: 'Contato'
        },
        submenu: {
            companyProfile: 'Perfil da Empresa',
            corporateCulture: 'Cultura Corporativa',
            certificates: 'Certificações',
            factory: 'Fábrica e Laboratório',
            plasticCoating: 'Tubos com Revestimento Plástico',
            antiCorrosion: 'Tubos Anticorrosão',
            steelPipes: 'Tubos de Aço',
            fittings: 'Conexões'
        },
        footer: {
            aboutText: 'A Cangzhou Hengjitai Pipeline Equipment Co., Ltd. foi fundada em 2026 e foca no fornecimento de equipamentos de tubulação, conexões de aço, suportes e suspensões para tubulações, e conexões anticorrosão para projetos de engenharia.',
            quickLinks: 'Links Rápidos',
            contact: 'Contato',
            followUs: 'Siga-nos',
            wechat: 'WeChat',
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            address:
                'A 100 m a sul da entrada da aldeia de Liguo Zhuang, município de Bianwu, condado de Yanshan, cidade de Cangzhou, província de Hebei, China',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Todos os direitos reservados | ICP No.xxxxxxxx',
            backToTop: 'Voltar ao Topo'
        },
        contact: {
            emailTitle: 'Endereço de Email',
            sendEmailButton: 'Enviar Email',
            workingHoursTitle: 'Horário de Funcionamento',
            workingHoursText: 'Segunda - Sexta: 8:30 - 17:30\nSábado: 9:00 - 12:00',
            addressTitle: 'Endereço'
        }
    },
    hi: {
        langCode: 'hi',
        homeText: 'होम',
        companyName: 'हेंगजिताई',
        companyFullName: 'कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड',
        languageText: 'हिंदी',
        nav: {
            about: 'हमारे बारे में',
            products: 'उत्पाद',
            quality: 'गुणवत्ता',
            cases: 'केस स्टडी',
            news: 'समाचार',
            contact: 'संपर्क करें'
        },
        submenu: {
            companyProfile: 'कंपनी प्रोफाइल',
            corporateCulture: 'कॉर्पोरेट संस्कृति',
            certificates: 'प्रमाणपत्र',
            factory: 'फैक्टरी और लैब',
            plasticCoating: 'पॉलिमर कोटिंग श्रृंखला',
            antiCorrosion: 'एंटी-कोरोज़न श्रृंखला',
            steelPipes: 'स्टील पाइप श्रृंखला',
            fittings: 'पाइप फिटिंग्स'
        },
        footer: {
            aboutText: 'कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड की स्थापना 2026 में हुई; यह पाइपलाइन उपकरण, स्टील पाइप फिटिंग्स, पाइप सपोर्ट व हैंगर, और इंजीनियरिंग परियोजनाओं के लिए एंटी-कोरोज़न फिटिंग्स की आपूर्ति पर केंद्रित है।',
            quickLinks: 'त्वरित लिंक',
            contact: 'संपर्क करें',
            followUs: 'हमें फॉलो करें',
            wechat: 'वीचैट',
            linkedin: 'लिंक्डइन',
            facebook: 'फेसबुक',
            address:
                'चीन, हेबेई प्रांत, कांग्झोऊ नगर, यानशान ज़िला, बियानवू नगरपालिका, लिगुओ झुआंग गाँव के प्रवेश द्वार से दक्षिण में 100 मीटर',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 कांगझोउ हेंगजिताई पाइपलाइन उपकरण कंपनी लिमिटेड। सर्वाधिकार सुरक्षित | ICP क्रमांक xxxxxxxx',
            backToTop: 'ऊपर जाएं'
        },
        contact: {
            emailTitle: 'ईमेल पता',
            sendEmailButton: 'ईमेल भेजें',
            workingHoursTitle: 'कार्य समय',
            workingHoursText: 'सोमवार - शुक्रवार: 8:30 - 17:30\nशनिवार: 9:00 - 12:00',
            addressTitle: 'पता'
        }
    },
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
            address:
                '100 m südlich des Dorfeingangs Liguo Zhuang, Gemeinde Bianwu, Kreis Yanshan, Stadt Cangzhou, Provinz Hebei, China',
            email: 'sales@hypipelines.com',
            phone: '+86 189-3171-0082',
            copyright: '© 2025 Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Alle Rechte vorbehalten | ICP-Nr. xxxxxxxx',
            backToTop: 'Nach oben'
        },
        contact: {
            emailTitle: 'E-Mail-Adresse',
            sendEmailButton: 'E-Mail senden',
            workingHoursTitle: 'Geschäftszeiten',
            workingHoursText: 'Montag - Freitag: 8:30 - 17:30\nSamstag: 9:00 - 12:00',
            addressTitle: 'Adresse'
        }
    }
};

// 首页横幅主副标题（方案 D）：单一数据源，生成时写入各语言 index 正文
const INDEX_HOME_HERO = {
    cn: {
        titleHtml: '专注石油化工电力矿山等领域<br/>的管道与管件装备专业供应商',
        subtitle: '多年专业生产经验为全球客户提供优质的石化电力及矿山管道与管件成套解决方案'
    },
    en: {
        titleHtml: 'Professional supplier of pipelines and pipe fittings<br/>for petrochemical, power generation and mining',
        subtitle:
            'Years of professional manufacturing experience delivering integrated pipeline and piping solutions for petrochemical, electric power and mining customers worldwide.'
    },
    jp: {
        titleHtml: '石油化学・電力・鉱山などの分野における<br/>配管・管継手機材の専門サプライヤー',
        subtitle:
            '長年の専門製造の実績により、世界中のお客様へ石油化学・電力・鉱山向けの配管・管継手の統合ソリューションをお届けします。'
    },
    ru: {
        titleHtml:
            'Профессиональный поставщик трубопроводной арматуры и оборудования<br/>для нефтехимии, энергетики и горной добычи',
        subtitle:
            'Многолетний опыт производства и комплексные решения в области трубопроводов и фитингов для нефтехимии, электроэнергетики и горной промышленности для заказчиков по всему миру.'
    },
    ar: {
        titleHtml: 'مورد متخصص لتجهيزات الأنابيب والوصلات<br/>في قطاعات البتروكيماويات والطاقة والتعدين',
        subtitle:
            'سنوات من الخبرة التصنيعية المهنية وحلول متكاملة للأنابيب والتجهيزات لقطاعات البتروكيماويات والكهرباء والتعدين لعملاء حول العالم.'
    },
    es: {
        titleHtml:
            'Proveedor especializado de tuberías y accesorios<br/>para petroquímica, generación eléctrica y minería',
        subtitle:
            'Años de experiencia en fabricación profesional y soluciones integrales de tuberías y accesorios para petroquímica, energía eléctrica y minería en todo el mundo.'
    },
    fr: {
        titleHtml:
            'Fournisseur spécialisé de canalisations et raccords<br/>pour la pétrochimie, la production d\'électricité et les mines',
        subtitle:
            'Des années d\'expérience en fabrication professionnelle et des solutions intégrées pour canalisations et raccords au service de la pétrochimie, de l\'énergie électrique et des mines dans le monde entier.'
    },
    pt: {
        titleHtml:
            'Fornecedor especializado em tubulações e conexões<br/>para petroquímica, geração de energia elétrica e mineração',
        subtitle:
            'Anos de experiência em fabricação profissional e soluções integradas em tubulações e conexões para petroquímica, energia elétrica e mineração para clientes em todo o mundo.'
    },
    hi: {
        titleHtml:
            'पेट्रोकेमिकल, विद्युत और खनन क्षेत्रों में<br/>पाइपलाइन व पाइप फिटिंग उपकरण का विशेषज्ञ आपूर्तिकर्ता',
        subtitle:
            'वर्षों का व्यावसायिक उत्पादन अनुभव; विश्व भर के ग्राहकों के लिए पेट्रोकेमिकल, विद्युत और खनन हेतु पाइपलाइन व पाइप फिटिंग की एकीकृत समाधान।'
    },
    de: {
        titleHtml:
            'Spezialist für Rohrleitungen und Rohrformstücke<br/>für Petrochemie, Energieerzeugung und Bergbau',
        subtitle:
            'Langjährige industrielle Fertigungserfahrung und integrierte Lösungen für Rohrleitungen und Armaturen in Petrochemie, Elektroenergie und Bergbau für Kunden weltweit.'
    }
};

function replaceIndexHeroShell(content) {
    return content.replace(
        /<section class="relative h-\[600px\] bg-gradient-to-r from-primary\/90 to-primary\/70 overflow-hidden">\s*(<div class="absolute inset-0">[\s\S]*?<\/div>)\s*(<div class="container mx-auto px-4 h-full">)/,
        `<section class="relative min-h-[440px] h-[min(68vh,640px)] overflow-hidden bg-slate-950 shadow-[inset_0_-8px_24px_-8px_rgba(0,0,0,0.35)]">
            $1
            <div class="absolute inset-0 bg-gradient-to-br from-primary/92 via-slate-900/50 to-slate-950/95 pointer-events-none" aria-hidden="true"></div>
            <div class="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(-18deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_14px)] pointer-events-none" aria-hidden="true"></div>
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-70" aria-hidden="true"></div>
            $2`
    );
}

function replaceIndexHomeHero(content, lang) {
    const hero = INDEX_HOME_HERO[lang] || INDEX_HOME_HERO.en;
    let next = replaceIndexHeroShell(content);
    next = next.replace(
        /<h1 class="text-5xl font-bold mb-6">[\s\S]*?<\/h1>|<h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight drop-shadow-sm">[\s\S]*?<\/h1>/,
        `<h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight drop-shadow-sm">${hero.titleHtml}</h1>`
    );
    next = next.replace(
        /<p class="text-lg mb-8 opacity-90">[\s\S]*?<\/p>|<p class="text-lg md:text-xl mb-8 text-white\/90 max-w-xl leading-relaxed">\s*[\s\S]*?<\/p>/,
        `<p class="text-lg md:text-xl mb-8 text-white/90 max-w-xl leading-relaxed">\n                        ${hero.subtitle}</p>`
    );
    return next;
}

// 读取模板文件
function readTemplate(lang) {
    // 使用 utils 模块中的缓存功能读取模板
    try {
        return utils.getTemplateSync(path.join(__dirname, '../templates/new-layout.html'));
    } catch (error) {
        utils.logError('读取模板文件失败', error);
        // 如果新模板不存在，则使用旧模板作为备选
        return fs.readFileSync(path.join(__dirname, '../templates/layout.html'), 'utf8');
    }
}

// 生成页面
function generatePage(lang, pageName, content, menuOptions = {}) {
    const template = readTemplate(lang);
    // 统一从 config.seo.pages 读取（与 script2/script3 同源）
    const pageConfig = pageSeo.getPageSeo(lang, pageName);
    
    const langConfig = pageComponents.getLanguageConfig(lang);
    
    // 构建完整的元数据对象
    const meta = {
        title: pageConfig.title || 'Quality Control',
        description: pageConfig.description || 'Comprehensive quality management system and advanced testing equipment ensuring product quality.',
        keywords: pageConfig.keywords || 'quality control, quality management, testing equipment, ISO certification',
        author: langConfig.companyFullName,
        contentLanguage: langConfig.langCode,
        canonicalUrl: `https://hengjitaipipeline.com/${lang}/${pageName}.html`,
        viewport: 'width=device-width, initial-scale=1.0',
        themeColor: '#162d52',
        robots: 'index, follow',
        // OpenGraph
        ogTitle: pageConfig.title || 'Quality Control',
        ogDescription: pageConfig.description || 'Comprehensive quality management system and advanced testing equipment ensuring product quality.',
        ogImage: '../images/logo.jpg',
        ogUrl: `https://hengjitaipipeline.com/${lang}/${pageName}.html`,
        ogType: 'website',
        ogSiteName: langConfig.companyFullName,
        // Twitter Card
        twitterCard: 'summary_large_image',
        twitterTitle: pageConfig.title || 'Quality Control',
        twitterDescription: pageConfig.description || 'Comprehensive quality management system and advanced testing equipment ensuring product quality.',
        twitterImage: '../images/logo.jpg',
        twitterSite: '@hengjitaipipeline',
        // 结构化数据
        structuredData: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": langConfig.companyFullName,
            "url": `https://hengjitaipipeline.com/${lang}/`,
            "logo": "https://hengjitaipipeline.com/images/logo.jpg",
            "description": pageConfig.description || 'Comprehensive quality management system and advanced testing equipment ensuring product quality.',
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN",
                "addressRegion": "Hebei",
                "addressLocality": "Yanshan County"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+86 189-3171-0082",
                "contactType": "customer service"
            }
        })
    };

    // 生成 alternate hreflang 标签
    const alternateLinks = generateAlternateLinks(lang, pageName);

    // 计算页面深度
    const pageDepth = 0; // 语言根目录中的页面深度为0
    
    // 替换所有元数据占位符
    let pageContent = template;
    pageContent = pageContent
        .replace('<!-- META_VIEWPORT -->', meta.viewport)
        .replace('<!-- META_THEME_COLOR -->', meta.themeColor)
        .replace('<!-- META_APPLICATION_NAME -->', langConfig.companyFullName) // 使用语言特定的公司名称
        .replace('<!-- PAGE_TITLE -->', meta.title)
        .replace('<!-- PAGE_DESCRIPTION -->', meta.description)
        .replace('<!-- PAGE_KEYWORDS -->', meta.keywords)
        .replace('<!-- META_AUTHOR -->', meta.author)
        .replace('<!-- META_ROBOTS -->', meta.robots)
        .replace('<!-- META_CONTENT_LANGUAGE -->', meta.contentLanguage)
        .replace('<!-- META_CANONICAL_URL -->', meta.canonicalUrl)
        .replace('<!-- OG_TITLE -->', meta.ogTitle)
        .replace('<!-- OG_DESCRIPTION -->', meta.ogDescription)
        .replace('<!-- OG_IMAGE -->', meta.ogImage)
        .replace('<!-- OG_URL -->', meta.ogUrl)
        .replace('<!-- OG_TYPE -->', meta.ogType)
        .replace('<!-- OG_SITE_NAME -->', meta.ogSiteName)
        .replace('<!-- TWITTER_CARD -->', meta.twitterCard)
        .replace('<!-- TWITTER_TITLE -->', meta.twitterTitle)
        .replace('<!-- TWITTER_DESCRIPTION -->', meta.twitterDescription)
        .replace('<!-- TWITTER_IMAGE -->', meta.twitterImage)
        .replace('<!-- TWITTER_SITE -->', meta.twitterSite)
        .replace('<!-- STRUCTURED_DATA -->', meta.structuredData);
    
    // 生成导航菜单、语言选择器和页脚
    const navigationMenu = pageComponents.getNavigationMenuHTML(lang, pageDepth, menuOptions);
    const languageSelector = pageComponents.getLanguageSelectorHTML(lang, pageName + '.html', '../');
    const footerHTML = pageComponents.getFooterHTML(lang, pageDepth);
    const backToTopHTML = pageComponents.getBackToTopHTML(lang);
    
    // 添加浮动导航配置脚本
    const baseFloatingScript = '<script src="../js/floating-nav-config.js"></script>';
    const contactScript = pageName === 'contact' 
        ? '\n    <script src="../js/message-modal.js"></script>' 
        : '';
    const indexScript = pageName === 'index'
        ? '\n    <script src="../js/message-modal.js"></script>'
        : '';
    // 添加浮动消息按钮脚本 - 对所有页面都添加
    const floatingMessageButtonScript = '\n    <script src="../js/floating-message-button.js"></script>';
    const floatingNavScript = baseFloatingScript + contactScript + indexScript + floatingMessageButtonScript;
    
    // 处理首页特殊内容 - 根据showCases和showNews决定是否显示相关部分
    if (pageName === 'index') {
        content = replaceIndexHomeHero(content, lang);
        if (menuOptions.showCases) {
            console.log(`正在处理 ${lang} 语言首页的案例展示部分...`);
            
            try {
                // 读取案例数据
                const casesJsonPath = path.join(__dirname, '..', lang, 'cases.json');
                if (fs.existsSync(casesJsonPath)) {
                    // 读取案例数据
                    const casesData = JSON.parse(fs.readFileSync(casesJsonPath, 'utf8'));
                    
                    // 检查是否已有案例部分
                    const casesTitle = CASES_TITLE[lang] || CASES_TITLE.en;
                    const hasCasesSection = content.includes(`<h2 class="text-3xl font-bold text-gray-900 mb-4">${casesTitle}</h2>`);
                    
                    if (!hasCasesSection) {
                        // 添加案例部分到首页
                        content = addCasesToIndex(content, lang);
                        console.log(`✓ 已为 ${lang} 语言首页添加工程案例部分`);
                    } else {
                        console.log(`${lang} 语言首页已有工程案例部分，跳过添加`);
                    }
                } else {
                    console.log(`${lang}/cases.json 不存在，跳过添加工程案例部分`);
                }
            } catch (error) {
                console.error(`❌ 处理 ${lang} 语言首页案例部分时出错:`, error);
            }
        } else {
            console.log(`正在移除 ${lang} 语言首页的案例展示部分...`);
            
            // 使用语言配置从配置对象获取案例文本
            const casesTitle = languageConfigs[lang]?.nav?.cases || '';
            if (casesTitle) {
                // 使用从配置中获取的案例标题动态构建正则表达式
                const casesTitleRegex = new RegExp(`<section class="py-20 bg-gray-50">\\s*<div class="container mx-auto px-4">\\s*<div class="text-center mb-16">\\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">${casesTitle}<\\/h2>[\\s\\S]*?<\\/section>`, 'm');
                const originalContent = content;
                content = content.replace(casesTitleRegex, '');
                
                // 检查是否成功替换，记录日志
                if (content !== originalContent) {
                    console.log(`✓ 已移除 ${lang} 语言首页中的"${casesTitle}"部分`);
                }
            }
            
            // 各语言的静态处理（作为备用方案）
            // 中文
            if (content.includes('应用案例') || content.includes('工程案例')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">(应用案例|工程案例)<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 英文
            if (content.includes('Case Studies')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">Case Studies<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 日语
            if (content.includes('施工実績')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">施工実績<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 俄语
            if (content.includes('Наши проекты')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">Наши проекты<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 阿拉伯语
            if (content.includes('المشاريع') || content.includes('دراسات الحالة')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">(المشاريع|دراسات الحالة)<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 西班牙语
            if (content.includes('Proyectos') || content.includes('Estudios de Caso')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">(Proyectos|Estudios de Caso)<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 法语
            if (content.includes('Projets') || content.includes('Études de Cas')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">(Projets|Études de Cas)<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 葡萄牙语
            if (content.includes('Projetos') || content.includes('Estudos de Caso')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">(Projetos|Estudos de Caso)<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 印地语
            if (content.includes('केस स्टडी')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">केस स्टडी<\/h2>[\s\S]*?<\/section>/m, '');
            }
            // 德语
            if (content.includes('Referenzen') || content.includes('Fallstudien')) {
                content = content.replace(/<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">(Referenzen|Fallstudien)<\/h2>[\s\S]*?<\/section>/m, '');
            }
            
            // 通用模式匹配（不依赖于标题文本）
            // 如果上述特定语言匹配都失败，尝试使用更通用的模式匹配应用案例部分
            const genericPattern = /<section class="py-20 bg-gray-50">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">[\s\S]*?<\/section>/m;
            const sectionsWithBgGray = content.match(/<section class="py-20 bg-gray-50">[\s\S]*?<\/section>/gm) || [];
            
            // 如果仍然存在灰色背景部分，检查是否包含案例相关图片
            for (let section of sectionsWithBgGray) {
                if (section.includes('cases/') || section.includes('projects/')) {
                    content = content.replace(section, '');
                    console.log(`✓ 通过通用模式移除了案例部分`);
                    break;
                }
            }
        }
        
        // 处理新闻部分（待实现）
        if (!menuOptions.showNews) {
            // 这里可以添加类似的逻辑处理新闻部分
            // 目前首页的新闻部分实现可能不同于案例部分，需要根据实际HTML结构处理
        }
        
        // 更新首页产品卡片链接，统一使用 search 参数
        content = updateIndexProductLinks(content, lang);
    }
    
    // 无论是哪个页面，都需要更新导航菜单和页脚中的产品链接
    // 确保所有页面的产品链接都使用统一的 search 参数
    content = updateIndexProductLinks(content, lang);

    // 统一替换历史遗留联系方式，避免旧页面内容被复用后残留旧值
    const legacyAddressPatterns = [
        '中国河北省盐山经济开发区正港园区',
        // 首页「联系我们」块等仍可能出现的短写法（无「中国」或省略国名）
        '河北省盐山经济开发区正港园区',
        'Zhenggang Park, Yanshan County Economic Development Zone, Hebei Province, China',
        'Zhenggang Park, Yanshan County Economic Development Zone, Hebei Province',
        'Zhenggang Park, Wirtschaftsentwicklungszone Yanshan County, Provinz Hebei',
        'Parc Zhenggang, Zone de Développement Économique de Yanshan County, Province du Hebei',
        '中国河北省塩山経済開発区正港工業園区',
        '河北省燕山経済開発区鄭崗パーク',
        'Промышленный парк Чжэнган, Зона экономического развития Яньшань, провинция Хэбэй, Китай',
        'Промышленный парк Чжэнган, Зона экономического развития Яньшань, провинция Хэбэй',
        'حديقة تشنغانغ، منطقة يانشان للتطوير الاقتصادي، مقاطعة هيبي، الصين',
        'منطقة تشنغانغ، المنطقة الاقتصادية يانشان، مقاطعة خه باي',
        'Parque Zhenggang, Zona de Desarrollo Económico de Yanshan County, Provincia de Hebei, China',
        'Parc Zhenggang, Zone de Développement Économique de Yanshan County, Province du Hebei, Chine',
        'Parque Zhenggang, Zona de Desenvolvimento Econômico de Yanshan County, Província de Hebei, China',
        'झेंगगैंग पार्क, यानशान आर्थिक विकास क्षेत्र, हेबई प्रांत, चीन',
        'झेंगगैंग पार्क, यानशान आर्थिक विकास क्षेत्र, हेबई प्रांत',
        'Zhenggang Industriepark, Wirtschaftszone Yanshan County, Provinz Hebei, China'
    ];
    content = content
        .replace(/sales@hengjitaipipeline\.com/g, langConfig.footer.email)
        .replace(/\+86-317-0000-0000/g, langConfig.footer.phone)
        .replace(/\(\+86\)189-3171-0082/g, langConfig.footer.phone);
    legacyAddressPatterns.forEach((legacyAddress) => {
        content = content.replaceAll(legacyAddress, langConfig.footer.address);
    });
    
    // 替换RTL方向属性
    const isRTL = lang === 'ar';
    const rtlDir = isRTL ? 'dir="rtl"' : '';
    
    // 设置RTL CSS链接标签
    const rtlCssLinkTag = isRTL 
        ? '<link rel="stylesheet" href="../css/rtl.min.css">'
        : '<!-- 非RTL语言不需要加载RTL样式 -->';
    
    // 替换RTL CSS标签
    pageContent = pageContent.replace('<!-- RTL_CSS_LINK_TAG -->', rtlCssLinkTag);

    // 替换基础信息
    pageContent = pageContent
        .replace('lang="zh-CN"', `lang="${langConfig.langCode}" ${rtlDir}`)
        .replace('<body class="bg-white">', `<body class="bg-white"${isRTL ? ' dir="rtl"' : ''}>`)
        .replace('<!-- PAGE_TITLE -->', config.title)
        .replace('<!-- PAGE_DESCRIPTION -->', config.description)
        .replace('<!-- LANG -->', lang)
        .replace(/{{LANG}}/g, lang)
        .replace('<!-- PAGE_KEYWORDS -->', config.keywords)
        .replace('<!-- ALTERNATE_LINKS -->', alternateLinks)
        .replace(/<!-- CURRENT_PAGE -->/g, pageName + '.html')
        .replace(/<!-- COMPANY_NAME -->/g, langConfig.companyName)
        .replace(/<!-- COMPANY_FULL_NAME -->/g, langConfig.companyFullName)
        .replace(/<!-- HOME_TEXT -->/g, langConfig.homeText)
        .replace(/<!-- NAVIGATION_MENU -->/g, navigationMenu)
        .replace('<!-- LANGUAGE_SELECTOR -->', languageSelector)
        .replace(/<!-- FOOTER -->/g, footerHTML)
        .replace(/<!-- BACK_TO_TOP -->/g, backToTopHTML);

    // 添加logo相关的meta替换
    pageContent = pageContent
        .replace('<!-- OG_IMAGE -->', '../images/logo.jpg')
        .replace('<!-- TWITTER_IMAGE -->', '../images/logo.jpg');
        
    // 替换页面内容
    // products.html 由 scripts/2. generate-multilingual-products.js 专门生成，此处不覆盖。

    if (pageName === 'contact') {
        // 如果content为空，则生成新的联系页面内容
        if (!content) {
            content = generateContactPageContent(lang);
        }
    }
    
    // 新闻页面特殊处理
    if (pageName === 'news') {
        console.log(`正在为 ${lang} 语言生成新闻页面...`);
        
        try {
            // 引入新闻页面生成器
            const newsGenerator = require('./shared/news-generator');
            // 使用专门的函数生成新闻页面
            let newsPageContent = newsGenerator.generateNewsPage(lang);
            
            if (newsPageContent) {
                // 生成导航菜单、语言选择器和页脚
                const navigationMenu = pageComponents.getNavigationMenuHTML(lang, pageDepth, menuOptions);
                const languageSelector = pageComponents.getLanguageSelectorHTML(lang, pageName + '.html', '../');
                const footerHTML = pageComponents.getFooterHTML(lang, pageDepth);
                const backToTopHTML = pageComponents.getBackToTopHTML(lang);
                
                // 替换模板中的剩余占位符
                newsPageContent = newsPageContent
                    .replace(/{{NAVIGATION_MENU}}/g, navigationMenu)
                    .replace(/{{LANGUAGE_SELECTOR}}/g, languageSelector)
                    .replace(/{{FOOTER}}/g, footerHTML)
                    .replace(/{{BACK_TO_TOP}}/g, backToTopHTML)
                    .replace(/{{ALTERNATE_LINKS}}/g, alternateLinks);
                
                console.log(`✓ 成功生成 ${lang} 语言的新闻页面(使用专用模板)`);
                return newsPageContent;
            }
        } catch (error) {
            console.error(`生成新闻页面失败: ${error.message}`);
            console.log('将使用标准模板...');
        }
    }
    
    pageContent = pageContent.replace('<!-- PAGE_CONTENT -->', content);

    // 替换当前页面的导航链接样式
    const activeLink = `href="${pageName}.html" class="text-gray-700 hover:text-primary px-3 py-2"`;
    const activeLinkReplacement = `href="${pageName}.html" class="text-primary px-3 py-2"`;
    pageContent = pageContent.replace(activeLink, activeLinkReplacement);
    
    // 添加浮动导航配置脚本和额外所需的脚本
    let extraScripts = floatingNavScript;
    
    // 注意：不需要在此处为首页添加消息模态框脚本，因为已经在 floatingNavScript 中包含了
    // if (pageName === 'index' ) {
    //     extraScripts += '\n    <script src="../js/message-modal.js"></script>';
    // }
    
    pageContent = pageContent.replace('<!-- EXTRA_SCRIPTS -->', extraScripts);

    // 联系页：标准中文门牌行替换为当前语言 footer.address（正文 + meta 描述中含该串时一并本地化）
    if (pageName === 'contact') {
        const canonicalCnPostalLine = '中国河北省沧州市盐山县边务镇李郭庄村口南100米';
        pageContent = pageContent.split(canonicalCnPostalLine).join(langConfig.footer.address);
    }

    return pageContent;
}

// 生成语言菜单项
function generateLanguageMenu(currentLang, pageName) {
    const languages = [
        { code: 'cn', name: '简体中文', dir: 'ltr' },
        { code: 'en', name: 'English', dir: 'ltr' },
        { code: 'jp', name: '日本語', dir: 'ltr' },
        { code: 'ru', name: 'Русский', dir: 'ltr' },
        { code: 'ar', name: 'العربية', dir: 'rtl' },
        { code: 'es', name: 'Español', dir: 'ltr' },
        { code: 'fr', name: 'Français', dir: 'ltr' },
        { code: 'pt', name: 'Português', dir: 'ltr' },
        { code: 'hi', name: 'हिन्दी', dir: 'ltr' },
        { code: 'de', name: 'Deutsch', dir: 'ltr' }
    ];

    return languages.map(lang => {
        const isActive = lang.code === currentLang;
        const className = isActive 
            ? 'block w-full px-4 py-2 text-primary bg-gray-50 text-left' 
            : 'block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-50';
            
        return `<a href="../${lang.code}/${pageName}.html"
           class="${className}"
           title="${lang.name}"
           dir="${lang.dir}"
           ${lang.code === 'ar' ? 'lang="ar"' : ''}>
            ${lang.name}
        </a>`;
    }).join('\n');
}

// 生成工程案例 HTML
function generateCasesHTML(lang, cases) {
    // 检查 RTL 语言
    const isRTL = lang === 'ar';
    const rtlClass = isRTL ? 'rtl' : '';
    const iconMargin = isRTL ? 'ml-2' : 'mr-2';
    
    // 案例部分的标题和描述
    const title = CASES_TITLE[lang] || CASES_TITLE.en;
    const description = CASES_DESC[lang] || CASES_DESC.en;
    const viewDetails = VIEW_DETAILS[lang] || VIEW_DETAILS.en;
    
    // 构建 HTML
    let html = `
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">${title}</h2>
            <p class="text-gray-600">${description}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">`;
    
    // 添加前四个案例卡片
    for (let i = 0; i < Math.min(cases.length, 4); i++) {
        const caseItem = cases[i];
        let imagePath = caseItem.image;
        
        // 修正图片路径，如果路径以 "../" 开头，去掉 "../"
        if (imagePath.startsWith('../')) {
            imagePath = imagePath.substring(3);
        }
        // 如果路径以 "/" 开头，去掉 "/"
        if (imagePath.startsWith('/')) {
            imagePath = imagePath.substring(1);
        }
        
        html += `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="h-64 overflow-hidden">
                    <img src="../${imagePath}" 
                         class="w-full h-full object-cover" alt="${caseItem.title}">
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${caseItem.title}</h3>
                    <p class="text-gray-600 mb-4">${caseItem.description}</p>
                    <a href="cases.html" class="text-primary hover:text-secondary flex items-center ${rtlClass}">
                        ${isRTL ? `<i class="fas fa-arrow-left ${iconMargin}"></i>` : ''}${viewDetails}${!isRTL ? `<i class="fas fa-arrow-right ml-2"></i>` : ''}
                    </a>
                </div>
            </div>`;
    }
    
    html += `
        </div>
    </div>
</section>`;

    return html;
}

// 定义产品搜索关键词映射

// 更新所有产品链接（首页产品卡片、导航菜单、页脚），统一使用简化的 search 参数
function updateIndexProductLinks(content, lang) {
    console.log(`正在更新 ${lang} 语言页面的所有产品链接（首页卡片、导航菜单、页脚）...`);
    
    let updatedContent = content;
    
    // 查找并替换所有产品链接，使用简化的关键词
    Object.keys(SIMPLIFIED_PRODUCT_KEYWORDS).forEach(categoryId => {
        const searchKeyword = SIMPLIFIED_PRODUCT_KEYWORDS[categoryId][lang] || SIMPLIFIED_PRODUCT_KEYWORDS[categoryId].en;
        
        // 匹配 href="products.html?category=categoryId" 格式的链接（包括导航菜单和页脚）
        const categoryLinkPattern = new RegExp(`href="products\\.html\\?category=${categoryId}"`, 'g');
        const searchLink = `href="products.html?search=${encodeURIComponent(searchKeyword)}"`;
        
        // 替换链接
        const beforeCount = (updatedContent.match(categoryLinkPattern) || []).length;
        updatedContent = updatedContent.replace(categoryLinkPattern, searchLink);
        const afterCount = (updatedContent.match(categoryLinkPattern) || []).length;
        
        if (beforeCount > afterCount) {
            console.log(`  ✓ 更新了 ${beforeCount - afterCount} 个 ${categoryId} 链接为 search=${searchKeyword}`);
        }
    });
    
    // 还需要更新已经存在的 search 参数链接，确保使用简化关键词
    updatedContent = updateExistingSearchLinks(updatedContent, lang);
    
    return updatedContent;
}

// 更新已存在的 search 参数链接，使用简化关键词
function updateExistingSearchLinks(content, lang) {
    let updatedContent = content;
    
    // 定义旧关键词到新简化关键词的映射
    const keywordMappings = {
        cn: {
            '涂塑系列': '涂塑',
            '防腐系列': '防腐', 
            '防腐处理': '防腐',
            '钢管系列': '钢管',
            '配套管件': '管件',
            '管件配件': '管件'
        },
        en: {
            'plastic coating': 'coating',
            'plastic-coating': 'coating',
            'anti-corrosion': 'corrosion',
            'steel pipes': 'steel',
            'steel-pipes': 'steel',
            'pipe fittings': 'fitting',
            'pipe-fittings': 'fitting'
        },
        jp: {
            'プラスチックコーティング': '被覆',
            '防食処理': '防食',
            '鋼管': '鋼管',
            '配管継手': '管継手',
            'プラスチック被覆': '被覆'  // 新增：确保一致性
        },
        ru: {
            'пластиковое покрытие': 'покрытие',
            'антикоррозийный': 'коррозия',
            'стальные трубы': 'сталь',
            'фитинги': 'фитинг'
        },
        ar: {
            'طلاء بلاستيكي': 'طلاء',
            'مضاد للتآكل': 'تآكل',
            'أنابيب فولاذية': 'فولاذ',
            'تركيبات الأنابيب': 'تجهيزات'
        },
        es: {
            'revestimiento plástico': 'revestimiento',
            'anticorrosión': 'corrosión',
            'tubos de acero': 'acero',
            'accesorios de tubería': 'accesorio'
        },
        fr: {
            'revêtement plastique': 'revêtement',
            'anticorrosion': 'corrosion',
            'tubes en acier': 'acier',
            'raccords de tuyauterie': 'raccord'
        },
        pt: {
            'revestimento plástico': 'revestimento',
            'anticorrosão': 'corrosão',
            'tubos de aço': 'aço',
            'conexões de tubulação': 'acessório'
        },
        hi: {
            'प्लास्टिक कोटिंग': 'कोटिंग',
            'जंग प्रतिरोधी': 'जंग',
            'स्टील पाइप': 'इस्पात',
            'पाइप फिटिंग': 'फिटिंग'
        },
        de: {
            'Kunststoffbeschichtung': 'Ummantelung',
            'Korrosionsschutz': 'Korrosion',
            'Stahlrohre': 'Stahl',
            'Rohrbeschläge': 'Armaturen',
            'Beschichtung': 'Ummantelung',  // 新增：旧术语到新术语的映射
            'Fitting': 'Armaturen'          // 新增：旧术语到新术语的映射
        }
    };
    
    const langMappings = keywordMappings[lang] || {};
    
    Object.entries(langMappings).forEach(([oldKeyword, newKeyword]) => {
        // 使用URL编码处理特殊字符
        const encodedOldKeyword = encodeURIComponent(oldKeyword);
        const encodedNewKeyword = encodeURIComponent(newKeyword);
        
        // 匹配并替换现有的 search 参数
        const searchPattern = new RegExp(`href="products\\.html\\?search=${encodedOldKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        const newSearchLink = `href="products.html?search=${encodedNewKeyword}"`;
        
        const beforeCount = (updatedContent.match(searchPattern) || []).length;
        updatedContent = updatedContent.replace(searchPattern, newSearchLink);
        const afterCount = (updatedContent.match(searchPattern) || []).length;
        
        if (beforeCount > afterCount) {
            console.log(`  ✓ 简化了 ${beforeCount - afterCount} 个链接：${oldKeyword} → ${newKeyword}`);
        }
    });
    
    return updatedContent;
}

// 在首页内容中添加工程案例部分
function addCasesToIndex(content, lang) {
    try {
        // 读取案例数据
        const casesPath = path.join(__dirname, '..', lang, 'cases.json');
        if (!fs.existsSync(casesPath)) {
            console.log(`${lang}/cases.json 不存在，跳过案例部分生成`);
            return content;
        }
        
        // 读取案例数据
        const casesData = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
        const cases = casesData.cases;
        
        // 生成案例 HTML
        const casesHTML = generateCasesHTML(lang, cases);
        
        // 多语言适配：根据不同语言查找对应部分
        let companyAdvantagePattern;
        let contactUsPattern;
        
        if (lang === 'cn') {
            companyAdvantagePattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">企业优势[\s\S]*?<\/section>/;
            contactUsPattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">联系我们[\s\S]*?<\/section>/;
        } else if (lang === 'en') {
            companyAdvantagePattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">Company Advantages[\s\S]*?<\/section>/;
            contactUsPattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">Contact Us[\s\S]*?<\/section>/;
        } else if (lang === 'jp') {
            companyAdvantagePattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">企業の強み[\s\S]*?<\/section>/;
            contactUsPattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">お問い合わせ[\s\S]*?<\/section>/;
        } else if (lang === 'ru') {
            companyAdvantagePattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">Преимущества компании[\s\S]*?<\/section>/;
            contactUsPattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">Свяжитесь с нами[\s\S]*?<\/section>/;
        } else {
            // 对于其他语言，尝试使用更通用的模式
            companyAdvantagePattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">[\s\S]*?<\/h2>[\s\S]*?<\/section>/;
            contactUsPattern = /<section class="py-20">\s*<div class="container mx-auto px-4">\s*<div class="text-center mb-16">\s*<h2 class="text-3xl font-bold text-gray-900 mb-4">[\s\S]*?<\/h2>[\s\S]*?<\/section>/;
        }
        
        // 找到企业优势部分
        const companyAdvantageSection = content.match(companyAdvantagePattern);
        if (!companyAdvantageSection) {
            console.log(`${lang}/index.html 中未找到企业优势部分，将插入在联系我们前面`);
            // 如果找不到企业优势部分，尝试查找联系我们部分
            const contactUsSection = content.match(contactUsPattern);
            if (!contactUsSection) {
                console.log(`${lang}/index.html 中未找到联系我们部分，无法添加案例部分`);
                return content;
            }
            
            // 在联系我们部分前插入工程案例
            const contactUsStart = content.indexOf(contactUsSection[0]);
            return content.substring(0, contactUsStart) + casesHTML + content.substring(contactUsStart);
        }
        
        // 在企业优势部分后插入案例部分
        const companyAdvantageEnd = content.indexOf(companyAdvantageSection[0]) + companyAdvantageSection[0].length;
        return content.substring(0, companyAdvantageEnd) + casesHTML + content.substring(companyAdvantageEnd);
    } catch (error) {
        console.error(`处理 ${lang} 工程案例时出错:`, error);
        return content;  // 返回原始内容，不做修改
    }
}

// 生成 alternate hreflang 标签
function generateAlternateLinks(currentLang, pageName) {
    // 使用metadata模块中的函数
    return metadata.generateAlternateLinks(currentLang, `${pageName}.html`);
}

// 更新页面中的语言选择器
function updateLanguageMenu(lang, pageName, content) {
    // 使用页面组件中的语言选择器
    const languageSelector = pageComponents.getLanguageSelectorHTML(lang, pageName + '.html', '../');
    
    // 使用特定的标记替换语言选择器
    if (content.includes('<!-- LANGUAGE_SELECTOR -->')) {
        return content.replace('<!-- LANGUAGE_SELECTOR -->', `
            <div class="relative" x-data="{ open: false }">
                ${languageSelector}
            </div>
        `);
    }
    
    // 如果找不到标记，则尝试替换整个语言选择器区域
    return content.replace(
        /<div[^>]*class="[^"]*language-selector[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/m,
        languageSelector
    );
}

// 读取页面内容
function readPageContent(lang, pageName) {
    const filePath = path.join(__dirname, `../${lang}/${pageName}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 先匹配 <main> 标签内的内容,只保留主要内容部分
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (!mainMatch) {
        return '';
    }
    
    let mainContent = mainMatch[1].trim();

    // 如果是联系页面，只保留一个完整的联系页面区块
    if (pageName === 'contact') {
        const bannerPattern = /<section class="page-banner[\s\S]*?<\/section>/gi;
        const contactInfoPattern = /<section class="py-20 bg-white" id="contact-info"[\s\S]*?<\/section>/gi;
        const mapPattern = /<section class="py-16 bg-gray-50" id="map"[\s\S]*?<\/section>/gi;

        // 获取第一个匹配项
        const bannerMatch = bannerPattern.exec(mainContent);
        const contactInfoMatch = contactInfoPattern.exec(mainContent);
        const mapMatch = mapPattern.exec(mainContent);

        if (bannerMatch && contactInfoMatch && mapMatch) {
            return bannerMatch[0] + '\n' + contactInfoMatch[0] + '\n' + mapMatch[0];
        }
    }
    
    // 移除所有导航、页眉、页脚等通用元素
    mainContent = mainContent.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, ''); 
    mainContent = mainContent.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');
    mainContent = mainContent.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');
    mainContent = mainContent.replace(/<div[^>]*class="relative group"[\s\S]*?<\/div>\s*<\/div>/gi, '');
    
    // 只保留有效的主要内容 section
    const sections = [];
    const sectionMatches = mainContent.match(/<section[^>]*>([\s\S]*?)<\/section>/gi) || [];
    
    for (const section of sectionMatches) {
        if (!section.includes('nav-menu') && 
            !section.includes('footer') && 
            !section.includes('language-selector')) {
            sections.push(section);
        }
    }
    
    // 移除多余空行并返回格式化后的内容
    return sections.join('\n').trim();
}

// 保存生成的页面
function savePage(lang, pageName, content) {
    const outputPath = path.join(__dirname, `../${lang}/${pageName}.html`);
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Generated ${lang}/${pageName}.html`);
}

// 生成联系信息内容
function generateContactInfo(lang) {
    // 所有语言版本都显示邮箱
    let content = `
        <div class="flex items-start gap-6 contact-card transition-all duration-300 p-4 rounded-lg">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-envelope text-primary text-xl"></i>
            </div>
            <div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">${languageConfigs[lang].contact.emailTitle || 'Email Address'}</h4>
                <p class="text-gray-600">${languageConfigs[lang].footer.email}</p>
            </div>
        </div>`;
        
    // 只在中文版本添加电话号码
    if (lang === 'cn') {
        content = `
        <div class="flex items-start gap-6 contact-card transition-all duration-300 p-4 rounded-lg">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-phone text-primary text-xl"></i>
            </div>
            <div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">${languageConfigs[lang].contact.phoneTitle}</h4>
                <p class="text-gray-600">+86 189-3171-0082</p>
            </div>
        </div>${content}`;
    }
    
    return content;
}

// 生成联系按钮
function generateContactButtons(lang) {
    // 检查是否为RTL语言
    const isRTL = lang === 'ar';
    const iconMargin = isRTL ? 'ml-2' : 'mr-2';
    
    // 中文版本显示电话和邮箱按钮
    if (lang === 'cn') {
        return `
            <div class="mt-6 grid grid-cols-2 gap-4">
                <a href="tel:+86 189-3171-0082" class="!rounded-button bg-primary text-white px-6 py-4 text-center hover:bg-primary/90 flex items-center justify-center">
                    <i class="fas fa-phone ${iconMargin}"></i>立即拨打
                </a>
                <a href="mailto:${languageConfigs[lang].footer.email}" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center">
                    <i class="fas fa-envelope ${iconMargin}"></i>发送邮件
                </a>
            </div>`;
    } 
    // 其他语言版本只显示邮箱按钮
    else {
        return `
            <div class="mt-6">
                <a href="mailto:${languageConfigs[lang].footer.email}" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center w-full">
                    <i class="fas fa-envelope ${iconMargin}"></i>${languageConfigs[lang].contact.sendEmailButton || 'Send Email'}
                </a>
            </div>`;
    }
}

// 获取发送信息按钮文本
function getMessageButtonText(lang) {
    const messageTexts = {
        cn: '发送信息',
        en: 'Send Message',
        jp: 'メッセージ送信',
        ja: 'メッセージ送信',
        ru: 'Отправить сообщение',
        ar: 'إرسال رسالة',
        es: 'Enviar Mensaje',
        fr: 'Envoyer Message',
        pt: 'Enviar Mensagem',
        hi: 'संदेश भेजें',
        de: 'Nachricht senden'
    };
    return messageTexts[lang] || messageTexts.en;
}

// 生成联系页面内容
function generateContactPageContent(lang) {
    // 不再检查文件是否存在，由调用方决定是否需要生成内容

    const langConfig = languageConfigs[lang];
    
    // 确保联系信息翻译存在
    const contactInfo = {
        workingHoursTitle: langConfig.contact.workingHoursTitle || 'Working Hours',
        workingHoursText: langConfig.contact.workingHoursText || 'Monday - Friday: 8:30 - 17:30\nSaturday: 9:00 - 12:00',
        addressTitle: langConfig.contact.addressTitle || 'Address',
        emailTitle: langConfig.contact.emailTitle || 'Email',
        phoneTitle: langConfig.contact.phoneTitle || 'Phone',
        sendEmailButton: langConfig.contact.sendEmailButton || 'Send Email',
        callNowButton: langConfig.contact.callNowButton || 'Call Now'
    };
    
    let content = `<section class="page-banner relative h-[300px]">
            <div class="absolute inset-0">
                <img src="../images/banner/contact-banner.jpg" alt="Contact" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-primary/50">
                <div class="container mx-auto px-4 h-full flex flex-col justify-center">
                    <h1 class="text-4xl font-bold text-white mb-4">${langConfig.nav.contact}</h1>
                    <div class="text-white">
                        <a href="${lang}/index.html" class="hover:text-gray-200" title="${langConfig.homeText}">${langConfig.homeText}</a> / ${langConfig.nav.contact}
                    </div>
                </div>
            </div>
        </section>
        <section class="py-20 bg-white" id="contact-info">
            <div class="container mx-auto px-4">
                <div class="max-w-3xl mx-auto">
                    <div class="bg-gray-50 rounded-xl p-8 shadow-sm">
                        <h2 class="text-3xl font-bold text-gray-900 mb-6">${langConfig.nav.contact}</h2>
                        <p class="text-gray-600 mb-10">${pageSeo.getPageSeo(lang, 'contact').description}</p>
                        
                        <div class="space-y-8">
                            ${isRTL ? 
                            `<div class="contact-card p-4 rounded-lg">
                                <div class="flex items-start">
                                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                                        <i class="fas fa-map-marker-alt text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.addressTitle}</h4>
                                        <p class="text-gray-600">${langConfig.footer.address}</p>
                                    </div>
                                </div>
                            </div>` : 
                            `<div class="flex items-start gap-6 contact-card transition-all duration-300 p-4 rounded-lg">
                                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-map-marker-alt text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.addressTitle}</h4>
                                    <p class="text-gray-600">${langConfig.footer.address}</p>
                                </div>
                            </div>`}
                            
                            ${lang === 'cn' ? 
                              isRTL ? 
                              `<div class="contact-card p-4 rounded-lg">
                                <div class="flex items-start">
                                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                                        <i class="fas fa-phone text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.phoneTitle}</h4>
                                        <p class="text-gray-600">${langConfig.footer.phone}</p>
                                    </div>
                                </div>
                              </div>` :
                              `<div class="flex items-start gap-6 contact-card transition-all duration-300 p-4 rounded-lg">
                                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-phone text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.phoneTitle}</h4>
                                    <p class="text-gray-600">${langConfig.footer.phone}</p>
                                </div>
                              </div>` : ''}
                            
                            ${isRTL ? 
                            `<div class="contact-card p-4 rounded-lg">
                                <div class="flex items-start">
                                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                                        <i class="fas fa-envelope text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.emailTitle}</h4>
                                        <p class="text-gray-600">${langConfig.footer.email}</p>
                                    </div>
                                </div>
                            </div>` : 
                            `<div class="flex items-start gap-6 contact-card transition-all duration-300 p-4 rounded-lg">
                                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-envelope text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.emailTitle}</h4>
                                    <p class="text-gray-600">${langConfig.footer.email}</p>
                                </div>
                            </div>`}
                            
                            ${isRTL ? 
                            `<div class="contact-card p-4 rounded-lg">
                                <div class="flex items-start">
                                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                                        <i class="fas fa-clock text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.workingHoursTitle}</h4>
                                        <p class="text-gray-600">${contactInfo.workingHoursText}</p>
                                    </div>
                                </div>
                            </div>` : 
                            `<div class="flex items-start gap-6 contact-card transition-all duration-300 p-4 rounded-lg">
                                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-clock text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-gray-900 mb-2">${contactInfo.workingHoursTitle}</h4>
                                    <p class="text-gray-600">${contactInfo.workingHoursText}</p>
                                </div>
                            </div>`}
                        </div>
                        
                        <div class="mt-6">
                            ${lang === 'cn' ? `<div class="grid grid-cols-3 gap-4">
                                <a href="tel:${langConfig.footer.phone}" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center">
                                    <i class="fas fa-phone mr-2"></i>${contactInfo.callNowButton}
                                </a>
                                <a href="mailto:${langConfig.footer.email}" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center">
                                    <i class="fas fa-envelope mr-2"></i>${contactInfo.sendEmailButton}
                                </a>
                                <button id="send-message-btn" type="button" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center">
                                    <i class="fas fa-comment mr-2"></i>发送信息
                                </button>
                            </div>` : `<div class="grid grid-cols-2 gap-4">
                                <a href="mailto:${langConfig.footer.email}" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center">
                                    <i class="fas fa-envelope mr-2"></i>${contactInfo.sendEmailButton}
                                </a>
                                <button id="send-message-btn" type="button" class="!rounded-button border border-primary text-primary px-6 py-4 text-center hover:bg-primary hover:text-white flex items-center justify-center">
                                    <i class="fas fa-comment mr-2"></i>${getMessageButtonText(lang)}
                                </button>
                            </div>`}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="py-16 bg-gray-50" id="map">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">${contactInfo.addressTitle}</h2>
                </div>
                <div class="rounded-xl overflow-hidden shadow-md">
                    <div class="h-[500px] w-full bg-gray-200">
                        <img src="../images/map.jpg" alt="${langConfig.companyFullName}" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </section>`;
        
    return content;
}

// 主函数
function main() {
    // cases.html 由 scripts/3. generate-cases-page-improved.js 专门生成，
    // products.html 由 scripts/2. generate-multilingual-products.js 专门生成，
    // 这里排除二者，避免通用壳生成覆盖主体内容。
    const pages = ['contact', 'about', 'quality', 'news', 'index'];
    const availableLanguages = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
    
    // 处理命令行参数
    const args = process.argv.slice(2);
    let targetLanguages = [...availableLanguages]; // 默认所有语言
    let showCases = true;  // 默认显示工程案例
    let showNews = true;   // 默认显示新闻动态
    
    // 显示帮助信息
    if (args.includes('--help') || args.includes('-h')) {
        console.log('使用方法: node generate-page.js [语言代码...] [--no-cases] [--no-news]');
        console.log('');
        console.log('选项:');
        console.log('  不带参数         生成所有语言的页面，包含所有菜单项');
        console.log('  [语言代码...]    只生成指定语言的页面');
        console.log('  --no-cases      隐藏"工程案例"菜单项');
        console.log('  --no-news       隐藏"新闻动态"菜单项');
        console.log('  --help, -h      显示帮助信息');
        console.log('');
        console.log(`可用的语言代码: ${availableLanguages.join(', ')}`);
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
        const requestedLangs = langArgs.filter(arg => availableLanguages.includes(arg));
        if (requestedLangs.length > 0) {
            targetLanguages = requestedLangs;
            console.log(`将只生成以下语言的页面: ${targetLanguages.join(', ')}`);
        } else {
            console.log('警告：未找到有效的语言参数，将生成所有语言的页面。');
            console.log(`有效的语言参数: ${availableLanguages.join(', ')}`);
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

    // 为每个页面设置浮动导航配置
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

    // 更新浮动导航配置文件
    const floatingNavConfigPath = path.join(__dirname, '../js/floating-nav-config.js');
    fs.writeFileSync(floatingNavConfigPath, floatingNavConfig, 'utf8');
    console.log('已更新浮动导航配置文件');

    targetLanguages.forEach(lang => {
        pages.forEach(page => {
            try {
                // 读取现有页面内容(如果存在)
                let content = '';
                const filePath = path.join(__dirname, `../${lang}/${page}.html`);
                
                if (fs.existsSync(filePath)) {
                    content = readPageContent(lang, page);
                }
                
                // 使用模板生成新页面，传递菜单选项
                const generatedPage = generatePage(lang, page, content, menuOptions);
                
                // 保存生成的页面
                savePage(lang, page, generatedPage);
                
                console.log(`✓ Generated ${lang}/${page}.html`);
            } catch (error) {
                console.error(`✗ Error processing ${lang}/${page}.html:`, error);
            }
        });
    });
    
    console.log('\nAll pages have been generated successfully!');
}

main();

// 导出函数供测试和其他模块使用
module.exports = {
    generatePage,
    readTemplate,
    generateAlternateLinks,
    generateLanguageMenu,
    updateLanguageMenu,
    generateCasesHTML,
    addCasesToIndex,
    updateIndexProductLinks,
    updateExistingSearchLinks,
    replaceIndexHomeHero,
    INDEX_HOME_HERO
};
