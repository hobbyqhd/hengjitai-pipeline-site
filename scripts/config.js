/**
 * 网站配置文件
 *
 * 此文件包含网站全局配置信息，供所有生成脚本使用。
 *
 * SEO 文案设计目标（B1+B2）：
 * - title: 控制在 50-60 字符（中英文按字符数；CJK 视觉宽度等同 ~30 字）；嵌入主关键词 + 品类 + 品牌。
 * - description: 控制在 140-160 字符；包含产品规格、应用场景、地理标识与品牌。
 * - keywords: 5-10 个高价值关键词，逗号分隔。
 */

const COMMON_BRAND_EN = 'Cangzhou Hengjitai';
const COMMON_BRAND_CN = '恒基泰管道装备';

module.exports = {
    // 语言配置
    languages: ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'],

    // 路径配置
    paths: {
        templates: 'templates',
        images: 'images',
        output: './',
        scripts: 'scripts'
    },

    // SEO配置
    seo: {
        title: {
            cn: '恒基泰管道装备 - 涂塑钢管及防腐管道专家',
            en: 'Hengjitai Pipeline Equipment - Expert in Plastic-Coated Steel Pipes',
            jp: '恒基泰管道設備 - プラスチックコーティングパイプおよび防食管専門メーカー',
            ru: 'Цанчжоу Хэнцзитай - Эксперт в области стальных труб с пластиковым покрытием',
            ar: 'هينغجيتاي لمعدات خطوط الأنابيب - خبراء في الأنابيب الفولاذية المطلية بالبلاستيك',
            es: 'Hengjitai Pipeline Equipment - Experto en Tuberías de Acero con Recubrimiento Plástico',
            fr: 'Hengjitai Pipeline Equipment - Expert en Tubes en Acier à Revêtement Plastique',
            pt: 'Hengjitai Pipeline Equipment - Especialista em Tubos de Aço com Revestimento Plástico',
            hi: 'कांगझोउ हेंगजिताई - प्लास्टिक कोटेड स्टील पाइप्स में विशेषज्ञ',
            de: 'Hengjitai Pipeline Equipment - Experte für kunststoffbeschichtete Stahlrohre'
        },
        description: {
            cn: '沧州恒基泰管道装备有限公司，专业生产涂塑钢管、3PE/TPEP 防腐钢管、镀锌钢管及管件，DN15-DN2200 全规格，管道装备专业供应商，品质优良服务全球。',
            en: 'Cangzhou Hengjitai Pipeline Equipment Co., Ltd. — manufacturer of plastic-coated steel pipes, 3PE/TPEP anti-corrosion pipes and fittings (DN15–DN2200). Pipeline equipment supplier serving 60+ countries.',
            jp: '恒基泰管道設備有限公司は塗塑鋼管・3PE/TPEP防食鋼管・継手の専門メーカー（DN15-DN2200全規格対応）。国家級ハイテク企業として世界60ヵ国以上に高品質と信頼性を提供。',
            ru: 'Cangzhou Hengjitai — производитель стальных труб с пластиковым покрытием, антикоррозийных труб 3PE/TPEP и фитингов (DN15–DN2200). Поставки в более 60 стран.',
            ar: 'شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب تصنع الأنابيب الفولاذية المطلية بالبلاستيك وأنابيب 3PE/TPEP المضادة للتآكل وملحقاتها (DN15–DN2200) بجودة عالية لأكثر من 60 دولة حول العالم.',
            es: 'Cangzhou Hengjitai fabrica tuberías de acero con recubrimiento plástico, tubos anticorrosión 3PE/TPEP y accesorios (DN15-DN2200). Proveedor de equipos de tuberías con exportación a 60+ países.',
            fr: 'Cangzhou Hengjitai fabrique des tubes en acier à revêtement plastique, des tubes anti-corrosion 3PE/TPEP et raccords (DN15-DN2200). Fournisseur d’équipements de tuyauterie, exportation vers 60+ pays.',
            pt: 'A Cangzhou Hengjitai fabrica tubos de aço com revestimento plástico, tubos anticorrosão 3PE/TPEP e conexões (DN15-DN2200). Fornecedor de equipamentos de tubulação, exporta para 60+ países.',
            hi: 'Cangzhou Hengjitai - प्लास्टिक-कोटेड स्टील पाइप, 3PE/TPEP एंटी-कोरोज़न पाइप और फिटिंग्स (DN15-DN2200) के निर्माता। पाइपलाइन उपकरण आपूर्तिकर्ता, 60+ देशों में निर्यात।',
            de: 'Cangzhou Hengjitai – Hersteller von kunststoffbeschichteten Stahlrohren, 3PE/TPEP-Korrosionsschutzrohren und Fittings (DN15–DN2200). Rohrleitungsausrüster mit Export in 60+ Länder.'
        },
        keywords: {
            cn: '涂塑钢管,3PE防腐钢管,TPEP防腐钢管,镀锌钢管,管件,工业管道,恒基泰管道装备,DN15-DN2200',
            en: 'plastic-coated steel pipes,3PE anti-corrosion pipes,TPEP pipes,galvanized pipes,pipe fittings,industrial pipelines,Cangzhou Hengjitai',
            jp: '塗塑鋼管,3PE防食鋼管,TPEP防食鋼管,亜鉛めっき鋼管,継手,工業用配管,恒基泰管道設備',
            ru: 'трубы с пластиковым покрытием,трубы 3PE,трубы TPEP,оцинкованные трубы,фитинги,промышленные трубопроводы,Хэнцзитай',
            ar: 'أنابيب فولاذية مطلية بالبلاستيك,أنابيب 3PE,أنابيب TPEP,أنابيب مجلفنة,تجهيزات الأنابيب,خطوط أنابيب صناعية,هينغجيتاي',
            es: 'tuberías de acero con recubrimiento plástico,tubos 3PE,tubos TPEP,tubos galvanizados,accesorios,tuberías industriales,Hengjitai',
            fr: 'tubes en acier à revêtement plastique,tubes 3PE,tubes TPEP,tubes galvanisés,raccords,tuyauteries industrielles,Hengjitai',
            pt: 'tubos de aço com revestimento plástico,tubos 3PE,tubos TPEP,tubos galvanizados,conexões,tubulações industriais,Hengjitai',
            hi: 'प्लास्टिक कोटेड स्टील पाइप,3PE पाइप,TPEP पाइप,गैल्वेनाइज़्ड पाइप,फिटिंग्स,औद्योगिक पाइपलाइन,Hengjitai',
            de: 'kunststoffbeschichtete Stahlrohre,3PE-Rohre,TPEP-Rohre,verzinkte Rohre,Fittings,Industrierohrleitungen,Hengjitai'
        },

        // 各语言、各页面 SEO 配置（B1+B2）
        // ========================================================
        // 设计：title 控制在 50-60 字符 / desc 在 140-160 字符
        // ========================================================
        pages: {
            cn: {
                index: {
                    title: '涂塑钢管制造商-3PE/TPEP防腐钢管厂家｜沧州恒基泰管道装备有限公司',
                    description: '恒基泰管道装备是管道装备专业供应商，专业生产涂塑钢管、3PE/TPEP防腐钢管、镀锌钢管、内外涂塑复合钢管及管件，DN15-DN2200全规格，已为60+国家市政、消防、燃气项目供货。',
                    keywords: '涂塑钢管厂家,3PE防腐钢管,TPEP防腐钢管,内外涂塑钢管,镀锌钢管,管件,DN15-DN2200,恒基泰管道装备'
                },
                about: {
                    title: '关于恒基泰-涂塑钢管行业资质与生产实力｜沧州恒基泰管道装备有限公司',
                    description: '沧州恒基泰管道装备有限公司成立于2026年，位于河北省沧州市盐山县边务镇李郭庄村口南100米，专注管道装备、钢制管件、管托支吊架及防腐管件等工程配套产品供应。',
                    keywords: '恒基泰管道装备简介,公司历史,生产能力,ISO9001认证,涂塑钢管厂家,高新技术企业,恒基泰管道装备'
                },
                products: {
                    title: '涂塑钢管/3PE防腐/TPEP/镀锌钢管全系列产品中心｜恒基泰管道装备',
                    description: '恒基泰管道装备产品中心：涂塑钢管、3PE/TPEP防腐钢管、内外涂塑复合钢管、镀锌钢管、消防钢管、电缆穿线管及配套管件，DN15-DN2200全规格、可定制颜色与连接方式，规格齐全。',
                    keywords: '涂塑钢管,3PE防腐钢管,TPEP防腐钢管,内外涂塑钢管,镀锌钢管,消防钢管,电缆穿线管,管件'
                },
                quality: {
                    title: '质量控制体系-ISO9001/CE/SGS认证｜沧州恒基泰管道装备有限公司',
                    description: '恒基泰管道装备建立完善的质量管理体系，通过ISO9001、CE、SGS国际认证，配备光谱仪、水压试验台、电火花检测等先进设备，每批涂塑钢管100%全检出厂，质量可追溯。',
                    keywords: '质量控制,质量管理体系,ISO9001认证,CE认证,SGS认证,涂塑钢管检测,水压试验,恒基泰管道装备'
                },
                cases: {
                    title: '应用案例-涂塑钢管市政/消防/燃气工程实例｜恒基泰管道装备',
                    description: '恒基泰管道装备涂塑钢管成功应用于全国及海外60+国家的市政供水、消防工程、燃气输配、矿用排水、电缆保护等项目，累计供货超100万吨，覆盖500+地标性工程。',
                    keywords: '涂塑钢管案例,市政供水工程,消防工程,燃气输配,矿用钢管,电缆保护管,工程案例'
                },
                news: {
                    title: '新闻动态-涂塑钢管行业资讯/技术分享｜沧州恒基泰管道装备有限公司',
                    description: '恒基泰管道装备新闻中心：涂塑钢管行业最新动态、3PE/TPEP防腐技术分享、市政与燃气工程案例报道、展会信息、企业资讯、产品更新与施工指南，定期更新。',
                    keywords: '涂塑钢管新闻,行业资讯,3PE技术,TPEP技术,展会信息,工程案例报道,恒基泰管道装备'
                },
                contact: {
                    title: '联系恒基泰-涂塑钢管报价/技术咨询｜沧州恒基泰管道装备有限公司',
                    description: '恒基泰管道装备24小时接受涂塑钢管/3PE防腐钢管/管件的报价咨询、技术支持、定制需求与样品申请。电话+86 189-3171-0082，地址河北省沧州市盐山县边务镇李郭庄村口南100米，欢迎来访洽谈。',
                    keywords: '涂塑钢管报价,3PE钢管咨询,管件采购,技术支持,恒基泰管道装备联系方式,样品申请'
                }
            },
            en: {
                index: {
                    title: 'Plastic-Coated Steel Pipe Manufacturer | 3PE/TPEP Anti-Corrosion Pipes — Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai is a pipeline equipment supplier manufacturing plastic-coated steel pipes, 3PE/TPEP anti-corrosion pipes, galvanized pipes & fittings (DN15-DN2200) for 60+ countries.',
                    keywords: 'plastic-coated steel pipe manufacturer,3PE anti-corrosion pipe,TPEP pipe,galvanized steel pipe,pipe fittings,DN15-DN2200,Cangzhou Hengjitai'
                },
                about: {
                    title: 'About Cangzhou Hengjitai — Pipeline Equipment and Steel Fitting Supplier & High-Tech Enterprise',
                    description: 'Established in 2026, Cangzhou Hengjitai covers project-based supply in 100 meters south of the entrance of Liguozhuang Village, Bianwu Town, Yanshan County, Cangzhou, Hebei, China. Annual capacity custom project supply. ISO9001/CE/SGS certified. Backbone supplier of plastic-coated pipes worldwide.',
                    keywords: 'Cangzhou Hengjitai profile,company history,production capacity,ISO9001 certified,plastic-coated pipe supplier,high-tech enterprise'
                },
                products: {
                    title: 'Products: Plastic-Coated, 3PE, TPEP, Galvanized Steel Pipes & Fittings — Cangzhou Hengjitai',
                    description: 'Full product range: plastic-coated steel pipes, 3PE/TPEP anti-corrosion pipes, galvanized pipes, fire-fighting pipes, cable conduits and matching fittings. DN15-DN2200, customizable color & joints.',
                    keywords: 'plastic-coated steel pipes,3PE anti-corrosion pipes,TPEP pipes,galvanized pipes,fire pipes,cable conduits,pipe fittings'
                },
                quality: {
                    title: 'Quality Control — ISO9001 / CE / SGS Certified Plastic-Coated Pipes | Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai operates a comprehensive QA system certified by ISO9001, CE and SGS. Spectrometer, hydrostatic press and spark testing equipment ensure 100% inspection of every plastic-coated pipe batch.',
                    keywords: 'quality control,quality management,ISO9001,CE,SGS,plastic-coated pipe inspection,hydrostatic test'
                },
                cases: {
                    title: 'Case Studies — Plastic-Coated Steel Pipe Projects in Water, Fire & Gas | Cangzhou Hengjitai',
                    description: 'Hengjitai plastic-coated and 3PE/TPEP pipes have been deployed in municipal water, fire protection, gas distribution, mining drainage and cable protection projects across 60+ countries — over 1,000,000 tons delivered.',
                    keywords: 'plastic-coated pipe case studies,municipal water projects,fire protection,gas distribution,mining pipes,cable conduits,reference projects'
                },
                news: {
                    title: 'News & Industry Insights — Plastic-Coated Steel Pipes Updates | Cangzhou Hengjitai',
                    description: 'Latest news from Cangzhou Hengjitai: industry updates on plastic-coated steel pipes, 3PE/TPEP coating technology, project reports, exhibition coverage, product launches and installation guidance.',
                    keywords: 'plastic-coated pipe news,3PE technology,TPEP technology,industry insights,exhibitions,project reports,Hengjitai updates'
                },
                contact: {
                    title: 'Contact Cangzhou Hengjitai — Plastic-Coated Steel Pipe Quotes & Technical Support',
                    description: 'Contact Cangzhou Hengjitai 24/7 for plastic-coated steel pipe quotes, 3PE/TPEP technical consultation, custom orders and samples. Tel +86 189-3171-0082, address: 中国河北省沧州市盐山县边务镇李郭庄村口南100米.',
                    keywords: 'plastic-coated pipe quote,3PE pipe inquiry,fittings procurement,technical support,Hengjitai contact,samples'
                }
            },
            jp: {
                index: {
                    title: '塗塑鋼管メーカー｜3PE/TPEP防食鋼管を製造する恒基泰管道設備有限公司',
                    description: '恒基泰管道設備は国家級ハイテク企業として塗塑鋼管・3PE/TPEP防食鋼管・亜鉛めっき鋼管・継手（DN15-DN2200全規格）を製造し、世界60ヵ国以上の市政・消防・ガス事業に供給しています。',
                    keywords: '塗塑鋼管メーカー,3PE防食鋼管,TPEP防食鋼管,亜鉛めっき鋼管,継手,DN15-DN2200,恒基泰管道設備'
                },
                about: {
                    title: '会社概要｜配管設備・鋼製継手サプライヤー恒基泰管道設備',
                    description: '恒基泰管道設備有限公司は2026年設立、河北省沧州盐山産業園に工程配套の工場と年産20万トンの生産能力を有し、ISO9001/CE/SGS認証を取得した塗塑鋼管業界の主要サプライヤーです。',
                    keywords: '恒基泰管道設備会社概要,会社沿革,生産能力,ISO9001認証,塗塑鋼管メーカー,ハイテク企業'
                },
                products: {
                    title: '製品一覧｜塗塑鋼管・3PE/TPEP防食鋼管・亜鉛めっき鋼管・継手',
                    description: '恒基泰管道設備の製品ラインナップ：塗塑鋼管、3PE/TPEP防食鋼管、内外塗塑複合鋼管、亜鉛めっき鋼管、消防用鋼管、ケーブル保護管、継手類。DN15-DN2200全規格、色・接続方式カスタム可。',
                    keywords: '塗塑鋼管,3PE防食鋼管,TPEP防食鋼管,内外塗塑鋼管,亜鉛めっき鋼管,消防鋼管,ケーブル保護管,継手'
                },
                quality: {
                    title: '品質管理体制｜ISO9001/CE/SGS認証済み塗塑鋼管メーカー恒基泰管道設備',
                    description: '恒基泰管道設備は完全な品質管理システムを構築し、ISO9001・CE・SGS認証を取得。分光計、水圧試験機、スパーク検査装置を備え、全ロット100%検査の上で出荷します。',
                    keywords: '品質管理,品質管理体制,ISO9001認証,CE認証,SGS認証,塗塑鋼管検査,水圧試験'
                },
                cases: {
                    title: '導入事例｜塗塑鋼管・3PE防食鋼管の市政・消防・ガス案件実績',
                    description: '恒基泰管道設備の塗塑・3PE/TPEP防食鋼管は中国国内および海外60ヵ国以上の市政給水、消防、ガス配管、鉱山排水、ケーブル保護工事に採用され、累計100万トン超を納入しています。',
                    keywords: '塗塑鋼管事例,市政給水,消防工事,ガス配管,鉱山用鋼管,ケーブル保護管,工事実績'
                },
                news: {
                    title: 'ニュース｜塗塑鋼管業界動向と技術情報｜恒基泰管道設備',
                    description: '恒基泰管道設備ニュース：塗塑鋼管業界の最新動向、3PE/TPEP防食技術の解説、市政・ガス案件のレポート、展示会情報、製品アップデート、施工ガイドを定期的に発信しています。',
                    keywords: '塗塑鋼管ニュース,業界動向,3PE技術,TPEP技術,展示会情報,工事レポート,恒基泰管道設備'
                },
                contact: {
                    title: 'お問い合わせ｜塗塑鋼管の見積・技術相談｜恒基泰管道設備',
                    description: '恒基泰管道設備有限公司は塗塑鋼管・3PE/TPEP防食鋼管・継手の見積、技術相談、カスタムオーダー、サンプル請求を24時間受付中。Tel +86 189-3171-0082、地址: 中国河北省沧州市盐山县边务镇李郭庄村口南100米。',
                    keywords: '塗塑鋼管見積,3PE鋼管相談,継手調達,技術サポート,恒基泰管道設備連絡先,サンプル'
                }
            },
            ru: {
                index: {
                    title: 'Производитель труб с пластиковым покрытием 3PE/TPEP — Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai — поставщик трубопроводного оборудования. Производство стальных труб с пластиковым покрытием, 3PE/TPEP труб, оцинкованных труб и фитингов (DN15-DN2200) для 60+ стран.',
                    keywords: 'производитель труб с пластиковым покрытием,трубы 3PE,трубы TPEP,оцинкованные трубы,фитинги,DN15-DN2200,Хэнцзитай'
                },
                about: {
                    title: 'О компании Cangzhou Hengjitai — производитель труб с пластиковым покрытием с 2026 года',
                    description: 'Cangzhou Hengjitai основана в 2026 году, расположен в индустриальном парке Яньшань (Хэбэй), 80 000 м², годовая мощность поставка под проект. Сертификаты ISO9001, CE, SGS.',
                    keywords: 'о компании Хэнцзитай,история компании,производственные мощности,ISO9001,производитель труб,высокие технологии'
                },
                products: {
                    title: 'Продукция: трубы с пластиковым покрытием, 3PE/TPEP, оцинкованные, фитинги — Hengjitai',
                    description: 'Полная линейка: стальные трубы с пластиковым покрытием, 3PE/TPEP антикоррозийные трубы, оцинкованные трубы, противопожарные трубы, кабельные каналы, фитинги. DN15-DN2200.',
                    keywords: 'трубы с пластиковым покрытием,трубы 3PE,трубы TPEP,оцинкованные трубы,противопожарные трубы,кабельные каналы,фитинги'
                },
                quality: {
                    title: 'Контроль качества — сертификаты ISO9001 / CE / SGS | Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai имеет полную систему контроля качества, сертифицированную ISO9001, CE и SGS. Спектрометры, гидростатические испытания и контроль искрой обеспечивают 100% проверку каждой партии.',
                    keywords: 'контроль качества,управление качеством,ISO9001,CE,SGS,контроль труб,гидроиспытания,Хэнцзитай'
                },
                cases: {
                    title: 'Реализованные проекты — трубы с пластиковым покрытием в водоснабжении, газе, пожаротушении',
                    description: 'Трубы Hengjitai с пластиковым и 3PE/TPEP покрытием применяются в коммунальном водоснабжении, пожаротушении, газоснабжении, водоотведении и защите кабелей в 60+ странах. Поставлено более 1 000 000 тонн.',
                    keywords: 'проекты Хэнцзитай,водоснабжение,пожаротушение,газоснабжение,горные трубы,защита кабелей,референсы'
                },
                news: {
                    title: 'Новости и аналитика — трубы с пластиковым покрытием | Cangzhou Hengjitai',
                    description: 'Новости Hengjitai: отраслевые обновления о трубах с пластиковым покрытием, технологии 3PE/TPEP, отчёты о проектах, выставки, новинки продукции и инструкции по монтажу.',
                    keywords: 'новости труб,3PE,TPEP,отрасль,выставки,отчёты по проектам,Хэнцзитай'
                },
                contact: {
                    title: 'Контакты Cangzhou Hengjitai — заказы и техническая поддержка по трубам',
                    description: 'Cangzhou Hengjitai круглосуточно принимает запросы цен, технические консультации, заказы и заявки на образцы по трубам с пластиковым покрытием. Тел +86 189-3171-0082, адрес: 中国河北省沧州市盐山县边务镇李郭庄村口南100米.',
                    keywords: 'запрос цены,трубы 3PE,фитинги,техподдержка,контакты Хэнцзитай,образцы'
                }
            },
            ar: {
                index: {
                    title: 'مُصنّع الأنابيب الفولاذية المطلية بالبلاستيك 3PE/TPEP - شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب',
                    description: 'شركة تسانغتشو هينغجيتاي لمعدات خطوط الأنابيب مورد متخصص لمعدات خطوط الأنابيب تصنع الأنابيب الفولاذية المطلية بالبلاستيك وأنابيب 3PE/TPEP المضادة للتآكل وأنابيب مجلفنة وملحقاتها (DN15-DN2200) لأكثر من 60 دولة.',
                    keywords: 'مُصنّع أنابيب فولاذية مطلية,أنابيب 3PE,أنابيب TPEP,أنابيب مجلفنة,تجهيزات,DN15-DN2200,هينغجيتاي'
                },
                about: {
                    title: 'عن هينغجيتاي لمعدات خطوط الأنابيب - منذ عام 2026 في تصنيع الأنابيب المطلية',
                    description: 'تأسست شركة هينغجيتاي عام 2026 في منطقة يانشان الصناعية بمقاطعة خبي، تمتد على 80,000 م² بطاقة إنتاجية 200,000 طن سنوياً، حاصلة على شهادات ISO9001 وCE وSGS.',
                    keywords: 'عن هينغجيتاي,تاريخ الشركة,طاقة إنتاجية,ISO9001,مُصنّع أنابيب,شركة تكنولوجيا'
                },
                products: {
                    title: 'منتجاتنا: أنابيب مطلية بالبلاستيك، 3PE، TPEP، مجلفنة، تجهيزات - هينغجيتاي',
                    description: 'مجموعة كاملة: أنابيب فولاذية مطلية بالبلاستيك، أنابيب 3PE/TPEP المضادة للتآكل، أنابيب مجلفنة، أنابيب إطفاء حريق، قنوات كابلات وتجهيزات. DN15-DN2200 بألوان ووصلات قابلة للتخصيص.',
                    keywords: 'أنابيب مطلية,أنابيب 3PE,أنابيب TPEP,أنابيب مجلفنة,أنابيب إطفاء,قنوات كابلات,تجهيزات'
                },
                quality: {
                    title: 'مراقبة الجودة - شهادات ISO9001 / CE / SGS | شركة هينغجيتاي',
                    description: 'تمتلك هينغجيتاي نظاماً شاملاً لضمان الجودة معتمداً من ISO9001 وCE وSGS. أجهزة الطيف، اختبار الضغط الهيدروستاتيكي والشرر تضمن فحص 100% لكل دفعة من الأنابيب.',
                    keywords: 'مراقبة الجودة,إدارة الجودة,ISO9001,CE,SGS,فحص الأنابيب,اختبار هيدروستاتيكي'
                },
                cases: {
                    title: 'دراسات الحالة - مشاريع الأنابيب المطلية في المياه والإطفاء والغاز',
                    description: 'تم استخدام أنابيب هينغجيتاي المطلية و3PE/TPEP في مشاريع مياه البلديات والإطفاء وتوزيع الغاز والصرف المنجمي وحماية الكابلات في أكثر من 60 دولة، بكمية تتجاوز 1,000,000 طن.',
                    keywords: 'دراسات حالة,مشاريع المياه,حماية الحريق,توزيع الغاز,أنابيب التعدين,حماية الكابلات,مراجع'
                },
                news: {
                    title: 'الأخبار والرؤى الصناعية - الأنابيب المطلية بالبلاستيك | هينغجيتاي',
                    description: 'أحدث أخبار هينغجيتاي: تحديثات صناعة الأنابيب المطلية بالبلاستيك، تقنيات 3PE/TPEP، تقارير المشاريع، المعارض، إطلاق المنتجات وإرشادات التركيب.',
                    keywords: 'أخبار الأنابيب,3PE,TPEP,صناعة,معارض,تقارير المشاريع,هينغجيتاي'
                },
                contact: {
                    title: 'تواصل مع هينغجيتاي لمعدات خطوط الأنابيب - عروض الأسعار والدعم الفني',
                    description: 'تستقبل هينغجيتاي طلبات عروض الأسعار والاستشارات الفنية وطلبات العينات حول الأنابيب المطلية و3PE/TPEP والملحقات على مدار 24 ساعة. هاتف +86 189-3171-0082، العنوان: 中国河北省沧州市盐山县边务镇李郭庄村口南100米.',
                    keywords: 'عرض سعر,أنابيب 3PE,تجهيزات,دعم فني,تواصل هينغجيتاي,عينات'
                }
            },
            es: {
                index: {
                    title: 'Fabricante de Tubos de Acero Recubiertos 3PE/TPEP — Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai, empresa nacional de alta tecnología, fabrica tubos de acero con recubrimiento plástico, tubos 3PE/TPEP, tubos galvanizados y accesorios (DN15-DN2200) exportando a 60+ países.',
                    keywords: 'fabricante de tubos recubiertos,tubos 3PE,tubos TPEP,tubos galvanizados,accesorios,DN15-DN2200,Hengjitai'
                },
                about: {
                    title: 'Sobre Cangzhou Hengjitai — 20 años fabricando tubos recubiertos de acero',
                    description: 'Cangzhou Hengjitai se fundó en 2005 en el parque industrial de Yanshan County, Hebei. 80.000 m² y capacidad anual de 200.000 toneladas. Certificada ISO9001, CE y SGS, líder en tubos recubiertos.',
                    keywords: 'sobre Hengjitai,historia empresa,capacidad producción,ISO9001,fabricante de tubos,empresa alta tecnología'
                },
                products: {
                    title: 'Productos: tubos recubiertos, 3PE/TPEP, galvanizados y accesorios — Hengjitai',
                    description: 'Gama completa: tubos de acero con recubrimiento plástico, tubos anticorrosión 3PE/TPEP, tubos galvanizados, tubos para incendios, conductos para cables y accesorios. DN15-DN2200.',
                    keywords: 'tubos recubiertos,tubos 3PE,tubos TPEP,tubos galvanizados,tubos contra incendios,conductos para cables,accesorios'
                },
                quality: {
                    title: 'Control de Calidad — Certificaciones ISO9001 / CE / SGS | Hengjitai',
                    description: 'Cangzhou Hengjitai opera un sistema de calidad integral certificado por ISO9001, CE y SGS. Espectrómetros, prensa hidrostática y pruebas de chispa garantizan inspección 100% de cada lote.',
                    keywords: 'control de calidad,gestión calidad,ISO9001,CE,SGS,inspección tubos,prueba hidrostática'
                },
                cases: {
                    title: 'Casos de Éxito — proyectos con tubos recubiertos en agua, incendios y gas',
                    description: 'Tubos recubiertos y 3PE/TPEP de Hengjitai se han implementado en proyectos de agua municipal, protección contra incendios, distribución de gas, drenaje minero y protección de cables en 60+ países. Más de 1.000.000 t entregadas.',
                    keywords: 'casos de éxito,agua municipal,protección incendios,gas,minería,protección cables,referencias'
                },
                news: {
                    title: 'Noticias e Insights del Sector — Tubos Recubiertos | Hengjitai',
                    description: 'Últimas noticias de Hengjitai: actualizaciones del sector de tubos recubiertos, tecnología 3PE/TPEP, informes de proyectos, ferias, lanzamientos y guías de instalación.',
                    keywords: 'noticias tubos,3PE,TPEP,sector,ferias,proyectos,Hengjitai'
                },
                contact: {
                    title: 'Contacto Cangzhou Hengjitai — Cotizaciones y Soporte Técnico de Tubos',
                    description: 'Cangzhou Hengjitai atiende cotizaciones, consultas técnicas, pedidos personalizados y solicitudes de muestras de tubos recubiertos y 3PE/TPEP las 24h. Tel +86 189-3171-0082, dirección: 中国河北省沧州市盐山县边务镇李郭庄村口南100米.',
                    keywords: 'cotización tubos,tubos 3PE,accesorios,soporte técnico,contacto Hengjitai,muestras'
                }
            },
            fr: {
                index: {
                    title: 'Fabricant de Tubes en Acier Revêtus 3PE/TPEP — Cangzhou Hengjitai',
                    description: "Cangzhou Hengjitai, entreprise nationale de haute technologie, fabrique des tubes en acier à revêtement plastique, tubes anticorrosion 3PE/TPEP, tubes galvanisés et raccords (DN15-DN2200) pour 60+ pays.",
                    keywords: 'fabricant tubes revêtus,tubes 3PE,tubes TPEP,tubes galvanisés,raccords,DN15-DN2200,Hengjitai'
                },
                about: {
                    title: 'À propos de Cangzhou Hengjitai — 20 ans dans les tubes en acier revêtus',
                    description: "Cangzhou Hengjitai a été créée en 2005 dans le parc industriel de Yanshan County (Hebei). проектные поставки, capacité annuelle de 200 000 tonnes, certifiée ISO9001, CE et SGS, fournisseur clé de tubes revêtus.",
                    keywords: 'à propos Hengjitai,historique,capacité production,ISO9001,fabricant tubes,entreprise high-tech'
                },
                products: {
                    title: 'Produits : tubes revêtus, 3PE/TPEP, galvanisés et raccords — Hengjitai',
                    description: "Gamme complète : tubes en acier à revêtement plastique, tubes anticorrosion 3PE/TPEP, tubes galvanisés, tubes incendie, gaines de câbles et raccords. DN15-DN2200, couleurs/raccords personnalisables.",
                    keywords: 'tubes revêtus,tubes 3PE,tubes TPEP,tubes galvanisés,tubes incendie,gaines câbles,raccords'
                },
                quality: {
                    title: 'Contrôle Qualité — Certifications ISO9001 / CE / SGS | Hengjitai',
                    description: 'Cangzhou Hengjitai exploite un système qualité complet certifié ISO9001, CE et SGS. Spectromètres, presse hydrostatique et test à étincelles garantissent une inspection 100% de chaque lot.',
                    keywords: 'contrôle qualité,gestion qualité,ISO9001,CE,SGS,inspection tubes,test hydrostatique'
                },
                cases: {
                    title: "Études de Cas — projets de tubes revêtus en eau, incendie et gaz",
                    description: "Les tubes revêtus et 3PE/TPEP de Hengjitai ont été utilisés dans des projets d'eau potable, protection incendie, distribution de gaz, drainage minier et protection câbles dans 60+ pays — plus de 1 000 000 t livrées.",
                    keywords: 'études de cas,eau municipale,protection incendie,gaz,mines,protection câbles,références'
                },
                news: {
                    title: "Actualités et Analyses Sectorielles — Tubes Revêtus | Hengjitai",
                    description: "Dernières actualités Hengjitai : tendances du secteur des tubes revêtus, technologie 3PE/TPEP, rapports projets, salons, lancements de produits et guides d'installation.",
                    keywords: 'actualités tubes,3PE,TPEP,secteur,salons,rapports projets,Hengjitai'
                },
                contact: {
                    title: 'Contact Cangzhou Hengjitai — Devis et Support Technique Tubes',
                    description: "Cangzhou Hengjitai traite 24h/24 vos demandes de devis, consultations techniques, commandes personnalisées et demandes d'échantillons pour tubes revêtus et 3PE/TPEP. Tél +86 189-3171-0082, adresse : 中国河北省沧州市盐山县边务镇李郭庄村口南100米.",
                    keywords: 'devis tubes,tubes 3PE,raccords,support technique,contact Hengjitai,échantillons'
                }
            },
            pt: {
                index: {
                    title: 'Fabricante de Tubos de Aço Revestidos 3PE/TPEP — Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai, empresa nacional de alta tecnologia, fabrica tubos de aço com revestimento plástico, tubos 3PE/TPEP, tubos galvanizados e conexões (DN15-DN2200) exportando para 60+ países.',
                    keywords: 'fabricante de tubos revestidos,tubos 3PE,tubos TPEP,tubos galvanizados,conexões,DN15-DN2200,Hengjitai'
                },
                about: {
                    title: 'Sobre a Cangzhou Hengjitai — 20 anos de experiência em tubos revestidos',
                    description: 'Fundada em 2026 no parque industrial de Yanshan County (Hebei), com 80.000 m² e capacidade anual de 200.000 toneladas. Certificada ISO9001, CE e SGS. Fornecedor chave de tubos revestidos.',
                    keywords: 'sobre Hengjitai,história,capacidade produção,ISO9001,fabricante tubos,empresa high-tech'
                },
                products: {
                    title: 'Produtos: tubos revestidos, 3PE/TPEP, galvanizados e conexões — Hengjitai',
                    description: 'Linha completa: tubos de aço com revestimento plástico, tubos anticorrosão 3PE/TPEP, tubos galvanizados, tubos de combate a incêndio, eletrodutos e conexões. DN15-DN2200 customizáveis.',
                    keywords: 'tubos revestidos,tubos 3PE,tubos TPEP,tubos galvanizados,tubos incêndio,eletrodutos,conexões'
                },
                quality: {
                    title: 'Controle de Qualidade — Certificações ISO9001 / CE / SGS | Hengjitai',
                    description: 'A Cangzhou Hengjitai opera um sistema integral de qualidade certificado pela ISO9001, CE e SGS. Espectrômetros, prensa hidrostática e teste de faíscas garantem inspeção 100% de cada lote.',
                    keywords: 'controle qualidade,gestão qualidade,ISO9001,CE,SGS,inspeção tubos,teste hidrostático'
                },
                cases: {
                    title: 'Estudos de Caso — projetos de tubos revestidos em água, incêndio e gás',
                    description: 'Tubos revestidos e 3PE/TPEP da Hengjitai foram aplicados em água potável municipal, proteção contra incêndio, distribuição de gás, drenagem mineira e proteção de cabos em 60+ países, com mais de 1.000.000 t entregues.',
                    keywords: 'estudos de caso,água municipal,proteção incêndio,gás,mineração,proteção cabos,referências'
                },
                news: {
                    title: 'Notícias e Análises Setoriais — Tubos Revestidos | Hengjitai',
                    description: 'Últimas notícias da Hengjitai: tendências do setor de tubos revestidos, tecnologia 3PE/TPEP, relatórios de projetos, feiras, lançamentos de produtos e guias de instalação.',
                    keywords: 'notícias tubos,3PE,TPEP,setor,feiras,projetos,Hengjitai'
                },
                contact: {
                    title: 'Contato Cangzhou Hengjitai — Cotações e Suporte Técnico de Tubos',
                    description: 'A Cangzhou Hengjitai atende 24h cotações, consultas técnicas, pedidos personalizados e amostras de tubos revestidos e 3PE/TPEP. Tel +86 189-3171-0082, endereço: 中国河北省沧州市盐山县边务镇李郭庄村口南100米.',
                    keywords: 'cotação tubos,tubos 3PE,conexões,suporte técnico,contato Hengjitai,amostras'
                }
            },
            hi: {
                index: {
                    title: 'प्लास्टिक-कोटेड स्टील पाइप निर्माता 3PE/TPEP - Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai एक पाइपलाइन उपकरण आपूर्तिकर्ता है जो प्लास्टिक कोटेड स्टील पाइप, 3PE/TPEP एंटी-कोरोज़न पाइप, गैल्वेनाइज़्ड पाइप और फिटिंग्स (DN15-DN2200) का निर्माण करता है, 60+ देशों में निर्यात।',
                    keywords: 'प्लास्टिक कोटेड पाइप निर्माता,3PE पाइप,TPEP पाइप,गैल्वेनाइज़्ड पाइप,फिटिंग्स,DN15-DN2200,Hengjitai'
                },
                about: {
                    title: 'Cangzhou Hengjitai के बारे में - 20 वर्षों का प्लास्टिक कोटेड पाइप अनुभव',
                    description: 'Cangzhou Hengjitai की स्थापना 2005 में हेबेई के यानशान औद्योगिक पार्क में हुई। 80,000 वर्ग मीटर सुविधा, 200,000 टन वार्षिक क्षमता, ISO9001, CE और SGS प्रमाणित।',
                    keywords: 'Hengjitai परिचय,कंपनी इतिहास,उत्पादन क्षमता,ISO9001,पाइप निर्माता,हाई-टेक उद्यम'
                },
                products: {
                    title: 'उत्पाद: प्लास्टिक कोटेड, 3PE/TPEP, गैल्वेनाइज़्ड पाइप और फिटिंग्स - Hengjitai',
                    description: 'पूरी रेंज: प्लास्टिक कोटेड स्टील पाइप, 3PE/TPEP एंटी-कोरोज़न पाइप, गैल्वेनाइज़्ड पाइप, फायर पाइप, केबल कंड्यूट और फिटिंग्स। DN15-DN2200, रंग/जोड़ कस्टमाइज़ करने योग्य।',
                    keywords: 'प्लास्टिक कोटेड पाइप,3PE पाइप,TPEP पाइप,गैल्वेनाइज़्ड पाइप,फायर पाइप,केबल कंड्यूट,फिटिंग्स'
                },
                quality: {
                    title: 'गुणवत्ता नियंत्रण - ISO9001 / CE / SGS प्रमाणन | Hengjitai',
                    description: 'Cangzhou Hengjitai ISO9001, CE और SGS द्वारा प्रमाणित व्यापक गुणवत्ता प्रबंधन प्रणाली संचालित करता है। स्पेक्ट्रोमीटर, हाइड्रोस्टैटिक प्रेस और स्पार्क परीक्षण हर बैच की 100% जांच सुनिश्चित करते हैं।',
                    keywords: 'गुणवत्ता नियंत्रण,गुणवत्ता प्रबंधन,ISO9001,CE,SGS,पाइप निरीक्षण,हाइड्रोस्टैटिक परीक्षण'
                },
                cases: {
                    title: 'केस स्टडीज़ - जल, अग्नि और गैस परियोजनाओं में प्लास्टिक कोटेड पाइप',
                    description: 'Hengjitai के प्लास्टिक कोटेड और 3PE/TPEP पाइपों को 60+ देशों में नगरपालिका जल, अग्नि सुरक्षा, गैस वितरण, खनन जल निकासी और केबल सुरक्षा परियोजनाओं में लगाया गया है — 1,000,000+ टन वितरित।',
                    keywords: 'पाइप केस स्टडी,नगर जल,अग्नि सुरक्षा,गैस वितरण,खनन पाइप,केबल सुरक्षा,संदर्भ परियोजनाएं'
                },
                news: {
                    title: 'समाचार और उद्योग अंतर्दृष्टि - प्लास्टिक कोटेड पाइप | Hengjitai',
                    description: 'Hengjitai के नवीनतम समाचार: प्लास्टिक कोटेड पाइप उद्योग अपडेट, 3PE/TPEP तकनीक, परियोजना रिपोर्ट, प्रदर्शनियां, उत्पाद लॉन्च और इंस्टॉलेशन गाइड।',
                    keywords: 'पाइप समाचार,3PE,TPEP,उद्योग,प्रदर्शनियां,परियोजना रिपोर्ट,Hengjitai'
                },
                contact: {
                    title: 'Cangzhou Hengjitai से संपर्क करें - पाइप कोटेशन और तकनीकी सहायता',
                    description: 'Cangzhou Hengjitai 24 घंटे प्लास्टिक कोटेड और 3PE/TPEP पाइपों के लिए कोटेशन, तकनीकी परामर्श, कस्टम ऑर्डर और सैंपल अनुरोध स्वीकार करता है। टेल +86 189-3171-0082, पता: 中国河北省沧州市盐山县边务镇李郭庄村口南100米।',
                    keywords: 'पाइप कोटेशन,3PE पाइप,फिटिंग्स,तकनीकी सहायता,Hengjitai संपर्क,सैंपल'
                }
            },
            de: {
                index: {
                    title: 'Hersteller kunststoffbeschichteter Stahlrohre 3PE/TPEP — Cangzhou Hengjitai',
                    description: 'Cangzhou Hengjitai ist ein nationales Rohrleitungsausrüster, das kunststoffbeschichtete Stahlrohre, 3PE/TPEP-Korrosionsschutzrohre, verzinkte Rohre und Fittings (DN15-DN2200) für 60+ Länder fertigt.',
                    keywords: 'Hersteller kunststoffbeschichtete Stahlrohre,3PE-Rohre,TPEP-Rohre,verzinkte Rohre,Fittings,DN15-DN2200,Hengjitai'
                },
                about: {
                    title: 'Über Cangzhou Hengjitai — 20 Jahre Erfahrung in beschichteten Stahlrohren',
                    description: 'Cangzhou Hengjitai wurde 2005 im Industriepark Yanshan County (Hebei) gegründet. 80.000 m² Werksfläche, 200.000 t Jahreskapazität. ISO9001-, CE- und SGS-zertifiziert. Schlüssellieferant beschichteter Rohre.',
                    keywords: 'über Hengjitai,Firmengeschichte,Produktionskapazität,ISO9001,Rohrhersteller,Rohrleitungsausrüster'
                },
                products: {
                    title: 'Produkte: beschichtete, 3PE/TPEP, verzinkte Rohre & Fittings — Hengjitai',
                    description: 'Gesamtsortiment: kunststoffbeschichtete Stahlrohre, 3PE/TPEP-Korrosionsschutzrohre, verzinkte Rohre, Brandschutzrohre, Kabelschutzrohre und Fittings. DN15-DN2200, Farben/Verbindungen anpassbar.',
                    keywords: 'beschichtete Rohre,3PE-Rohre,TPEP-Rohre,verzinkte Rohre,Brandschutzrohre,Kabelschutzrohre,Fittings'
                },
                quality: {
                    title: 'Qualitätskontrolle — ISO9001 / CE / SGS-Zertifizierung | Hengjitai',
                    description: 'Cangzhou Hengjitai betreibt ein umfassendes Qualitätsmanagementsystem nach ISO9001, CE und SGS. Spektrometer, hydrostatische Pressen und Funkenprüfungen gewährleisten 100% Inspektion jeder Charge.',
                    keywords: 'Qualitätskontrolle,Qualitätsmanagement,ISO9001,CE,SGS,Rohrprüfung,hydrostatischer Test'
                },
                cases: {
                    title: 'Referenzen — beschichtete Rohre für Wasser, Brandschutz, Gas',
                    description: 'Hengjitai beschichtete und 3PE/TPEP-Rohre wurden in kommunalen Wasserprojekten, Brandschutz, Gasverteilung, Bergbauentwässerung und Kabelschutz in 60+ Ländern eingesetzt – über 1.000.000 t geliefert.',
                    keywords: 'Referenzen,kommunales Wasser,Brandschutz,Gas,Bergbau,Kabelschutz,Projektreferenzen'
                },
                news: {
                    title: 'News & Branchen-Insights — Beschichtete Rohre | Hengjitai',
                    description: 'Aktuelle News von Hengjitai: Branchenupdates zu beschichteten Stahlrohren, 3PE/TPEP-Technologie, Projektberichte, Messen, Produkteinführungen und Installationsanleitungen.',
                    keywords: 'Rohr News,3PE,TPEP,Branche,Messen,Projektberichte,Hengjitai'
                },
                contact: {
                    title: 'Kontakt Cangzhou Hengjitai — Angebote und technischer Support für Rohre',
                    description: 'Cangzhou Hengjitai bearbeitet 24/7 Anfragen für Angebote, technische Beratung, kundenspezifische Bestellungen und Muster zu beschichteten und 3PE/TPEP-Rohren. Tel +86 189-3171-0082, Adresse: 中国河北省沧州市盐山县边务镇李郭庄村口南100米.',
                    keywords: 'Rohrangebot,3PE-Rohr,Fittings,technischer Support,Kontakt Hengjitai,Muster'
                }
            }
        }
    },

    // 构建配置
    build: {
        incremental: true,
        cacheTTL: 3600,
        logLevel: 'info'
    }
};
