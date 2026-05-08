/**
 * 检测当前页面路径层级，并返回适当的相对路径前缀
 * 用于确保浮动导航菜单中的链接正确指向语言目录下的页面
 * @returns {string} 路径前缀，如 '' 或 '../'
 */
function detectPathPrefix() {
    // 获取当前页面URL路径
    const path = window.location.pathname;
    
    // 检查是否在子目录下（如hp-products/）
    // 注意：这里假设子目录结构一致，且主要页面在语言目录下，产品页面在hp-products子目录下
    if (path.includes('/hp-products/') || path.match(/\/[a-z]{2}\/[^\/]+\/[^\/]+\.html$/)) {
        return '../';
    }
    
    // 如果是在语言目录的根目录下
    return '';
}

// 加载浮动导航组件
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 检测是否为RTL
        const isRTL = document.documentElement.dir === 'rtl';
        
        // 检测当前页面路径层级
        const pathPrefix = detectPathPrefix();
        
        // 根据语言方向动态生成适合的导航模板
        const floatingNavHTML = `
        <div id="floating-nav">
            <div id="floating-menu" class="fixed ${isRTL ? 'left-0 rounded-r-lg' : 'right-0 rounded-l-lg'} bg-white shadow-lg z-50">
                <div class="flex flex-col py-4">
                    <a href="#" id="toggle-floating-menu" class="mb-2 p-2 hover:bg-gray-100 transition-colors block text-center" title="展开菜单">
                        <i class="fas ${isRTL ? 'fa-chevron-right' : 'fa-chevron-left'} text-primary text-lg"></i>
                    </a>
                    <a href="${pathPrefix}index.html" data-nav="HOME_TEXT" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-home text-primary"></i>
                        <span class="nav-text"></span>
                    </a>
                    <a href="${pathPrefix}about.html" data-nav="NAV_ABOUT" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-building text-primary"></i>
                        <span class="nav-text"></span>
                    </a>
                    <a href="${pathPrefix}products.html" data-nav="NAV_PRODUCTS" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-box-open text-primary"></i>
                        <span class="nav-text"></span>
                    </a>
                    <a href="${pathPrefix}quality.html" data-nav="NAV_QUALITY" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-certificate text-primary"></i>
                        <span class="nav-text"></span>
                    </a>
                    ${(window.floatingNavConfig?.showCases !== false) ? `
                    <a href="${pathPrefix}cases.html" data-nav="NAV_CASES" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-project-diagram text-primary"></i>
                        <span class="nav-text"></span>
                    </a>` : ''}
                    ${(window.floatingNavConfig?.showNews !== false) ? `
                    <a href="${pathPrefix}news.html" data-nav="NAV_NEWS" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-newspaper text-primary"></i>
                        <span class="nav-text"></span>
                    </a>` : ''}
                    <a href="${pathPrefix}contact.html" data-nav="NAV_CONTACT" class="p-2 hover:bg-gray-100">
                        <i class="fas fa-envelope text-primary"></i>
                        <span class="nav-text"></span>
                    </a>
                </div>
            </div>
        </div>`;
        
        // 创建临时DOM元素以解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(floatingNavHTML, 'text/html');
        const template = doc.querySelector('#floating-nav');
        
        if (template) {
            const floatingNavContainer = document.getElementById('floating-nav-container');
            if (floatingNavContainer) {
                // 注入模板
                floatingNavContainer.innerHTML = template.innerHTML;
                
                // 设置文本
                const floatingNavLinks = floatingNavContainer.querySelectorAll('a[data-nav]');
                if (floatingNavLinks && floatingNavLinks.length > 0) {
                    floatingNavLinks.forEach(link => {
                        try {
                            const href = link.getAttribute('href');
                            if (!href) return;
                            
                            const textSpan = link.querySelector('.nav-text');
                            if (!textSpan) return;

                            // 从主导航获取翻译
                            // 需要考虑路径前缀的影响，移除路径前缀后再查找
                            const pathPrefixPattern = /^\.\.\/|^\.\//;
                            const cleanHref = href.replace(pathPrefixPattern, '');
                            
                            // 查找导航链接，尝试多种可能的选择器
                            const mainNavLink = document.querySelector(`.nav-item a[href$="${cleanHref}"]`) || 
                                              document.querySelector(`.nav-item a[href*="/${cleanHref}"]`) ||
                                              document.querySelector(`.nav-item a[href="${cleanHref}"]`);
                            
                            if (mainNavLink) {
                                const text = mainNavLink.textContent.trim();
                                textSpan.textContent = text;
                                link.setAttribute('title', text);
                            }
                        } catch (linkError) {
                            console.warn('处理导航链接时出错:', linkError);
                        }
                    });
                }
                // 初始化浮动导航
                initFloatingNav();
            } else {
                console.error('找不到浮动导航容器元素');
            }
        } else {
            console.error('找不到浮动导航模板');
        }
    } catch (error) {
        console.error('加载浮动导航组件失败:', error);
    }
});

// 初始化浮动导航
function initFloatingNav() {
    const floatingMenu = document.getElementById('floating-menu');
    const toggleButton = document.getElementById('toggle-floating-menu');
    
    if (!floatingMenu) {
        console.error('找不到浮动菜单元素 (floating-menu)');
        return;
    }
    if (!toggleButton) {
        console.error('找不到切换按钮元素 (toggle-floating-menu)');
        return;
    }
    
    // 添加样式确保菜单收缩状态也保持垂直居中，同时确保箭头按钮可见
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #floating-menu {
            transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out !important;
            opacity: 0; /* 初始隐藏，避免从页面顶部移动的效果 */
        }
        #floating-menu.collapsed-menu-ltr {
            transform: translate(calc(100% - 8px), -50%) !important;
        }
        #floating-menu.collapsed-menu-rtl {
            transform: translate(calc(-100% + 8px), -50%) !important;
        }
        #floating-menu.expanded-menu {
            transform: translate(0, -50%) !important;
        }
        
        /* 修改切换按钮在收缩状态下的样式 */
        #toggle-floating-menu {
            position: relative;
            overflow: visible;
        }
        
        /* 收缩状态下的箭头按钮样式 */
        #floating-menu.collapsed-menu-ltr #toggle-floating-menu {
            position: absolute;
            left: -5px;
            top: 0;
            transform: translateX(-100%);
            background: white;
            border-radius: 4px 0 0 4px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            width: 25px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            margin-top: 10px;
        }
        
        #floating-menu.collapsed-menu-rtl #toggle-floating-menu {
            position: absolute;
            right: -5px;
            top: 0;
            transform: translateX(100%);
            background: white;
            border-radius: 0 4px 4px 0;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            width: 25px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            margin-top: 10px;
        }
        
        /* 显示切换按钮的图标 */
        #floating-menu.collapsed-menu-ltr #toggle-floating-menu i,
        #floating-menu.collapsed-menu-rtl #toggle-floating-menu i {
            display: inline-block !important;
            font-size: 14px;
        }
    `;
    document.head.appendChild(styleElement);
    
    // 初始化配置，使用默认值或从floatingNavConfig获取
    const config = {
        initialState: window.floatingNavConfig?.initialState || 'collapsed',
        initialOpacity: window.floatingNavConfig?.initialOpacity !== undefined ? window.floatingNavConfig.initialOpacity : 0.8,
        autoHideDelay: window.floatingNavConfig?.autoHideDelay !== undefined ? window.floatingNavConfig.autoHideDelay : 5000,
        mobileBreakpoint: window.floatingNavConfig?.mobileBreakpoint || 767,
        mobilePosition: window.floatingNavConfig?.mobilePosition || 60,
        desktopPosition: window.floatingNavConfig?.desktopPosition || 50,
        verticalOffset: window.floatingNavConfig?.verticalOffset || 0,
        zIndex: window.floatingNavConfig?.zIndex || 50
    };
    
    let isOpen = config.initialState === 'expanded';
    let autoHideTimer = null;
    let isUserInteracting = false;
    
    // 立即设置初始位置和样式，避免从下往上的移动效果
    floatingMenu.style.top = '50%';
    floatingMenu.style.opacity = '0'; // 先隐藏，避免位置调整时的闪烁
    
    // 添加预设位置的样式类
    if (document.documentElement.dir === 'rtl') {
        floatingMenu.classList.add(isOpen ? 'expanded-menu' : 'collapsed-menu-rtl');
    } else {
        floatingMenu.classList.add(isOpen ? 'expanded-menu' : 'collapsed-menu-ltr');
    }
    
    // 处理菜单显示/隐藏
    function toggleMenu(event, force) {
        if (event) {
            event.preventDefault();
        }
        
        const newState = force !== undefined ? force : !isOpen;
        if (newState === isOpen) return;
        
        isOpen = newState;
        const isRTL = document.documentElement.dir === 'rtl';
        
        // 更新按钮的标题属性及ARIA属性以反映当前状态
        const expandText = window.floatingNavConfig?.i18n?.expandMenu || '展开菜单';
        const collapseText = window.floatingNavConfig?.i18n?.collapseMenu || '收起菜单';
        
        toggleButton.setAttribute('title', isOpen ? collapseText : expandText);
        toggleButton.setAttribute('aria-expanded', isOpen.toString());
        toggleButton.setAttribute('aria-label', isOpen ? collapseText : expandText);
        
        if (isRTL) {
            // 不再完全移除菜单，只是收缩大部分
            floatingMenu.classList.toggle('collapsed-menu-rtl', !isOpen);
            floatingMenu.classList.toggle('expanded-menu', isOpen);
            // 确保图标方向正确
            const icon = toggleButton.querySelector('i');
            icon.classList.remove('fa-chevron-left', 'fa-chevron-right');
            // 在RTL模式下，收缩时箭头指向左侧（fa-chevron-left），展开时指向右侧（fa-chevron-right）
            icon.classList.add(isOpen ? 'fa-chevron-left' : 'fa-chevron-right');
        } else {
            // 不再完全移除菜单，只是收缩大部分
            floatingMenu.classList.toggle('collapsed-menu-ltr', !isOpen);
            floatingMenu.classList.toggle('expanded-menu', isOpen);
            // 确保图标方向正确
            const icon = toggleButton.querySelector('i');
            icon.classList.remove('fa-chevron-left', 'fa-chevron-right'); 
            // 在LTR模式下，收缩时箭头指向右侧（fa-chevron-right），展开时指向左侧（fa-chevron-left）
            icon.classList.add(isOpen ? 'fa-chevron-right' : 'fa-chevron-left');
        }

        // 如果是手动打开菜单，重置自动隐藏计时器
        if (isOpen && event) {
            resetAutoHideTimer();
        }
    }
    
    // 重置自动隐藏计时器
    function resetAutoHideTimer() {
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
        }
        
        // 如果配置设置为false，则不使用自动隐藏
        if (config.autoHideDelay === false) return;
        
        // 自动收缩菜单（但不完全隐藏），除非用户正在交互
        autoHideTimer = setTimeout(() => {
            if (!isUserInteracting) {
                // 自动折叠而不是完全隐藏
                toggleMenu(null, false);
            }
        }, config.autoHideDelay);
    }
    
    // 用户交互事件处理
    function handleInteractionStart() {
        isUserInteracting = true;
        // 取消任何待处理的自动隐藏
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
        }
    }
    
    function handleInteractionEnd() {
        isUserInteracting = false;
        // 重新开始自动隐藏计时
        resetAutoHideTimer();
    }
    
    // 显示/隐藏按钮点击事件
    toggleButton.addEventListener('click', toggleMenu);
    
    // 键盘导航支持
    toggleButton.addEventListener('keydown', (event) => {
        // Enter或Space键触发菜单切换
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu(event);
        }
    });
    
    // 添加鼠标交互事件监听
    floatingMenu.addEventListener('mouseenter', handleInteractionStart);
    floatingMenu.addEventListener('mouseleave', handleInteractionEnd);
    floatingMenu.addEventListener('touchstart', handleInteractionStart);
    floatingMenu.addEventListener('touchend', handleInteractionEnd);
    floatingMenu.addEventListener('focus', handleInteractionStart);
    floatingMenu.addEventListener('blur', handleInteractionEnd);
    
    // 页面滚动事件处理
    const scrollThreshold = 100; // 显示阈值，降低到100px
    let scrollTimeout;
    
    // 添加过渡效果类和触摸设备样式
    floatingMenu.classList.add('transition-all', 'duration-300', 'ease-in-out');
    
    // 检测是否为触摸设备，增加触摸友好的样式
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        floatingMenu.classList.add('touch-device');
    }
    
    // 应用设备响应式样式
    function applyResponsiveStyles() {
        // 固定菜单中心点在屏幕中间 (50%)
        floatingMenu.style.top = '50%';
        // 基础变换由CSS样式控制，这里不需要设置transform
        
        // 应用垂直偏移（如果有）
        if (config.verticalOffset) {
            const currentTop = parseFloat(floatingMenu.style.top);
            floatingMenu.style.top = `calc(${currentTop}% + ${config.verticalOffset}px)`;
        }
    }
    
    // 应用z-index
    floatingMenu.style.zIndex = config.zIndex.toString();
    
    // 初始应用
    applyResponsiveStyles();
    
    // 窗口大小改变时重新应用
    window.addEventListener('resize', applyResponsiveStyles);
    
    function handleScroll(scrollTop) {
        // 如果未传入滚动位置，则获取当前位置
        if (scrollTop === undefined) {
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        }
        
        // 判断是否应该显示浮动菜单
        if (scrollTop > scrollThreshold) {
            // 只控制透明度和可点击性，不自动展开
            if (parseFloat(floatingMenu.style.opacity) < 1) {
                floatingMenu.style.opacity = '1';
            }
            floatingMenu.style.pointerEvents = 'auto';
        } else {
            // 当页面回到顶部时降低透明度，但依然可点击
            if (parseFloat(floatingMenu.style.opacity) > 0.7) {
                floatingMenu.style.opacity = '0.7';
            }
            floatingMenu.style.pointerEvents = 'auto';
            // 如果菜单已展开，则折叠它
            if (isOpen) {
                toggleMenu(null, false);
            }
        }
    }
    
    // 使用 requestAnimationFrame 和节流优化滚动事件
    let ticking = false;
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // 添加节流，只有滚动超过一定阈值才触发重绘
    const scrollThresholdPixels = 5; // 至少滚动5px才触发
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // 只有滚动距离超过阈值，才进行处理
        if (Math.abs(currentScrollY - lastScrollY) > scrollThresholdPixels && !ticking) {
            requestAnimationFrame(() => {
                handleScroll(currentScrollY);
                ticking = false;
                lastScrollY = currentScrollY;
            });
            ticking = true;
        }
    });
    
    // 确保页面加载时就检查滚动位置
    handleScroll();
    
    // 初始状态
    const isRTL = document.documentElement.dir === 'rtl';
    if (isRTL) {
        floatingMenu.classList.add('collapsed-menu-rtl');
    } else {
        floatingMenu.classList.add('collapsed-menu-ltr');
    }
    
    // 初始时使用配置设置菜单状态
    // 延迟显示菜单，确保初始位置和状态已经设置完成
    setTimeout(() => {
        // 平滑淡入效果
        floatingMenu.style.transition = 'opacity 0.5s ease-in-out';
        floatingMenu.style.opacity = config.initialOpacity.toString();
        floatingMenu.style.pointerEvents = 'auto';
    }, 100);
}
