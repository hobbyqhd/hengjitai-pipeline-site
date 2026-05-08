/**
 * 产品详情弹窗功能
 * 用于显示产品的详细信息
 */

document.addEventListener('DOMContentLoaded', () => {
    // 动态加载模态框滚动条样式
    if (!document.getElementById('modal-scroll-styles')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'modal-scroll-styles';
        styleLink.rel = 'stylesheet';
        styleLink.href = '../../css/modal-scroll.css';
        document.head.appendChild(styleLink);
    }
    
    // 根据当前语言获取翻译文本
    function getTranslation(key) {
        const lang = document.documentElement.lang || 'en';
        const translations = {
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
            }
        };
        
        if (translations[key] && translations[key][lang]) {
            return translations[key][lang];
        }
        
        // 默认回退到英文
        return translations[key]['en'] || key;
    }
    
    // 创建模态框HTML并添加到文档
    function createProductModal() {
        const modal = document.createElement('div');
        modal.id = 'product-modal';
        modal.className = 'fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4 opacity-0 invisible transition-all duration-300';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'product-modal-title');

        // 使用RTL属性以支持阿拉伯文等
        const isRTL = document.documentElement.lang === 'ar';
        const rtlClass = isRTL ? ' rtl' : '';
        const rtlDir = isRTL ? ' dir="rtl"' : '';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto${rtlClass}"${rtlDir}>
                <div class="flex justify-between items-center border-b p-4">
                    <h3 id="product-modal-title" class="text-xl font-semibold text-gray-900"></h3>
                    <button id="close-modal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-1/2 p-4">
                        <img id="product-modal-image" class="w-full h-auto object-contain" alt="" />
                    </div>
                    <div class="w-full md:w-1/2 p-4 flex flex-col">
                        <div class="mb-4">
                            <h4 id="product-category-title" class="text-lg font-medium text-gray-700 mb-2"></h4>
                            <div id="product-modal-specs" class="text-md text-gray-600 mb-4"></div>
                        </div>
                        <div class="mb-4 flex flex-row items-start gap-x-4 overflow-x-auto py-2"> <!-- MODIFIED: Outer container for tags -->
                            <div id="product-modal-applications" class="flex flex-wrap gap-2"></div> <!-- MODIFIED: Removed mb-3 -->
                            <div id="product-modal-features" class="flex flex-wrap gap-1"></div> <!-- MODIFIED: Removed mb-3 -->
                            <div id="product-modal-connections" class="flex flex-wrap gap-2"></div>
                        </div>
                        <!-- 产品描述区域 - 添加到右下角 -->
                        <div class="mt-auto pt-4 border-t border-gray-200">
                            <h5 class="text-md font-semibold text-gray-800 mb-2">${getTranslation('product_description')}</h5>
                            <div id="product-modal-description" class="text-sm text-gray-600 overflow-y-auto max-h-48"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 为关闭按钮添加事件监听
        document.getElementById('close-modal').addEventListener('click', () => {
            closeProductModal();
        });

        // 点击模态框外部区域关闭模态框
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProductModal();
            }
        });
    }

    // 打开产品详情模态框
    function openProductModal(productData) {
        const modal = document.getElementById('product-modal');
        if (!modal) {
            console.error('产品模态框不存在');
            return;
        }

        // 填充模态框内容
        document.getElementById('product-modal-title').textContent = productData.name;
        document.getElementById('product-modal-image').src = productData.image;
        document.getElementById('product-modal-image').alt = productData.name;
        document.getElementById('product-category-title').textContent = productData.category;

        // 处理规格信息
        const specsElement = document.getElementById('product-modal-specs');
        if (productData.specs) {
            try {
                // 规格可能是JSON字符串或普通字符串
                let specs;
                if (typeof productData.specs === 'string' && productData.specs.startsWith('{')) {
                    specs = JSON.parse(productData.specs);
                } else {
                    specs = productData.specs;
                }

                // 根据规格类型显示不同的内容
                if (typeof specs === 'object') {
                    const lang = document.documentElement.lang || 'en';
                    const unitMap = {
                        'cn': '米',
                        'en': 'm',
                        'jp': 'm',
                        'ru': 'м',
                        'ar': 'م',
                        'es': 'm',
                        'fr': 'm',
                        'pt': 'm',
                        'hi': 'मी',
                        'de': 'm'
                    };
                    const unit = unitMap[lang] || 'm';

                    if (specs.type === 'full') {
                        const diameterFormat = {
                            'cn': '直径{0}mm × 长度{1}{2}',
                            'en': 'Diameter {0}mm × Length {1}{2}',
                            'jp': '直径{0}mm × 长度{1}{2}',
                            'ru': 'Диаметр {0}мм × Длина {1}{2}',
                            'ar': 'قطر {0}مم × طول {1}{2}',
                            'es': 'Diámetro {0}mm × Longitud {1}{2}',
                            'fr': 'Diamètre {0}mm × Longueur {1}{2}',
                            'pt': 'Diâmetro {0}mm × Comprimento {1}{2}',
                            'hi': 'व्यास {0}मिमी × लंबाई {1}{2}',
                            'de': 'Durchmesser {0}mm × Länge {1}{2}'
                        };
                        const format = diameterFormat[lang] || diameterFormat['en'];
                        specsElement.textContent = format
                            .replace('{0}', specs.diameter)
                            .replace('{1}', specs.length)
                            .replace('{2}', unit);
                    } else if (specs.type === 'diameter_only') {
                        const diameterOnlyFormat = {
                            'cn': '直径{0}mm',
                            'en': 'Diameter {0}mm',
                            'jp': '直径{0}mm',
                            'ru': 'Диаметр {0}мм',
                            'ar': 'قطر {0}مم',
                            'es': 'Diámetro {0}mm',
                            'fr': 'Diamètre {0}mm',
                            'pt': 'Diâmetro {0}mm',
                            'hi': 'व्यास {0}मिमी',
                            'de': 'Durchmesser {0}mm'
                        };
                        const format = diameterOnlyFormat[lang] || diameterOnlyFormat['en'];
                        specsElement.textContent = format.replace('{0}', specs.diameter);
                    }
                } else {
                    // 如果是简单字符串
                    specsElement.textContent = specs;
                }
            } catch (e) {
                console.warn('规格解析错误:', e);
                specsElement.textContent = productData.specs;
            }
        } else {
            specsElement.style.display = 'none';
        }

        // 处理应用领域标签
        const applicationsElement = document.getElementById('product-modal-applications');
        applicationsElement.innerHTML = '';
        if (productData.applications && productData.applications.length > 0) {
            try {
                const applications = typeof productData.applications === 'string' ? 
                    JSON.parse(productData.applications) : productData.applications;
                applications.forEach(app => {
                    const tag = document.createElement('span');
                    tag.className = 'inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm';
                    tag.textContent = app;
                    applicationsElement.appendChild(tag);
                });
            } catch (e) {
                console.warn('应用领域解析错误:', e);
            }
        } else {
            applicationsElement.style.display = 'none';
        }

        // 处理产品特性标签
        const featuresElement = document.getElementById('product-modal-features');
        featuresElement.innerHTML = '';
        if (productData.features && productData.features.length > 0) {
            try {
                const features = typeof productData.features === 'string' ? 
                    JSON.parse(productData.features) : productData.features;
                features.forEach(feature => {
                    const tag = document.createElement('span');
                    tag.className = 'inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm';
                    tag.textContent = feature;
                    featuresElement.appendChild(tag);
                });
            } catch (e) {
                console.warn('产品特性解析错误:', e);
            }
        } else {
            featuresElement.style.display = 'none';
        }

        // 处理连接方式标签
        const connectionsElement = document.getElementById('product-modal-connections');
        connectionsElement.innerHTML = '';
        if (productData.connections && productData.connections.length > 0) {
            try {
                const connections = typeof productData.connections === 'string' ? 
                    JSON.parse(productData.connections) : productData.connections;
                connections.forEach(conn => {
                    const tag = document.createElement('span');
                    tag.className = 'inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm';
                    tag.textContent = conn;
                    connectionsElement.appendChild(tag);
                });
            } catch (e) {
                console.warn('连接方式解析错误:', e);
            }
        } else {
            connectionsElement.style.display = 'none';
        }

        // 处理产品描述
        const descriptionElement = document.getElementById('product-modal-description');
        if (productData.description) {
            descriptionElement.textContent = productData.description;
            descriptionElement.parentElement.style.display = 'block'; // 显示描述区域
            
            // 动态调整描述区域高度
            setTimeout(() => {
                // 检查内容高度是否超过容器
                const contentHeight = descriptionElement.scrollHeight;
                // 如果内容很短，减小容器高度以避免空白
                if (contentHeight < 100) {
                    descriptionElement.style.maxHeight = Math.max(50, contentHeight) + 'px';
                } else if (window.innerHeight < 700) {
                    // 在小屏幕设备上，限制最大高度
                    descriptionElement.style.maxHeight = '120px';
                } else {
                    // 在大屏幕上允许更多内容显示
                    descriptionElement.style.maxHeight = '180px';
                }
                
                // 检查内容是否可滚动
                if (descriptionElement.scrollHeight > descriptionElement.clientHeight) {
                    descriptionElement.classList.add('can-scroll');
                    
                    // 添加滚动事件监听器，以便在滚动到底部时隐藏阴影
                    descriptionElement.addEventListener('scroll', function() {
                        // 当滚动到底部时
                        if (this.scrollHeight - this.scrollTop - this.clientHeight < 2) {
                            this.classList.remove('can-scroll');
                        } else {
                            this.classList.add('can-scroll');
                        }
                    });
                }
            }, 10);
        } else {
            descriptionElement.textContent = '';
            descriptionElement.parentElement.style.display = 'none'; // 隐藏无描述产品
        }

        // 显示模态框
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');

        // 阻止背景滚动
        document.body.classList.add('overflow-hidden');
        
        // 确保产品详情在移动设备上可以正常滚动
        setTimeout(() => {
            // 找到所有可能需要滚动的容器
            const scrollContainers = modal.querySelectorAll('.overflow-y-auto, .overflow-x-auto');
            
            // 为触摸设备添加滚动支持
            scrollContainers.forEach(container => {
                // 确保触摸事件不会被模态框的点击事件捕获
                container.addEventListener('touchmove', (e) => {
                    e.stopPropagation();
                }, { passive: true });
                
                // 对于非常小的屏幕设备，自动添加视觉提示
                if (window.innerWidth < 480 && container.scrollHeight > container.clientHeight) {
                    // 添加视觉提示，表明内容可滚动
                    container.style.boxShadow = 'inset 0 -10px 10px -10px rgba(0,0,0,0.2)';
                    container.style.borderBottomLeftRadius = '4px';
                    container.style.borderBottomRightRadius = '4px';
                }
            });
        }, 100);
    }

    // 关闭产品详情模态框
    function closeProductModal() {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        modal.setAttribute('aria-hidden', 'true');
        modal.classList.add('opacity-0', 'invisible');
        modal.classList.remove('opacity-100', 'visible');

        // 恢复背景滚动
        document.body.classList.remove('overflow-hidden');
    }

    // 为产品详情按钮添加点击事件
    function setupProductButtons() {
        createProductModal();

        // 为所有产品详情按钮添加事件
        document.querySelectorAll('.product-details-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productData = {
                    name: button.getAttribute('data-product-name'),
                    image: button.getAttribute('data-product-image'),
                    category: button.getAttribute('data-product-category'),
                    specs: button.getAttribute('data-product-specs'),
                    applications: button.getAttribute('data-product-applications'),
                    features: button.getAttribute('data-product-features'),
                    connections: button.getAttribute('data-product-connections'),
                    description: button.getAttribute('data-product-description')
                };
                openProductModal(productData);
            });
        });
    }

    // 初始化
    setupProductButtons();
});
