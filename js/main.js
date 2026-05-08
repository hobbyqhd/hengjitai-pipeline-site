/**
 * Cangzhou Hengjitai Pipeline Equipment Co., Ltd. Website JavaScript
 * Author: GitHub Copilot
 * Date: 2025-05-20
 */

// 组件加载函数
async function loadComponents() {
    try {
        // 使用内联模板以避免CORS问题
        const headerHTML = `
        <template id="site-header">
            <!-- 网站头部模板 -->
            <header class="fixed w-full bg-white shadow-sm z-50">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between h-20">
                        <a href="index.html" class="text-3xl font-bold text-primary">Logo</a>
                        <nav class="hidden lg:flex items-center space-x-8">
                            <a href="index.html" class="text-gray-800 hover:text-primary">首页</a>
                            <a href="about.html" class="text-gray-800 hover:text-primary">关于我们</a>
                            <a href="products.html" class="text-gray-800 hover:text-primary">产品中心</a>
                            <a href="quality.html" class="text-gray-800 hover:text-primary">质量控制</a>
                            <a href="cases.html" class="text-gray-800 hover:text-primary">工程案例</a>
                            <a href="news.html" class="text-gray-800 hover:text-primary">新闻动态</a>
                            <a href="contact.html" class="text-gray-800 hover:text-primary">联系我们</a>
                        </nav>
                        <button class="lg:hidden focus:outline-none">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        </template>`;

        // 页脚模板已移至page-components.js中统一管理
        const footerHTML = '';
        
        const backToTopHTML = `
        <template id="back-to-top">
            <!-- 返回顶部按钮模板 -->
            <a href="#" title="回到顶部" class="fixed bottom-8 right-8 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 invisible transition-all duration-300">
                <i class="fas fa-chevron-up"></i>
            </a>
        </template>`;

        // 创建解析HTML的函数
        function parseTemplate(html) {
            const parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        }

        // 解析所有模板
        const headerDoc = parseTemplate(headerHTML);
        const footerDoc = parseTemplate(footerHTML);
        const backToTopDoc = parseTemplate(backToTopHTML);
        
        // 获取模板元素
        const header = headerDoc.querySelector('#site-header');
        const footer = footerDoc.querySelector('#site-footer');
        const backToTop = backToTopDoc.querySelector('#back-to-top');
        
        // 加载头部
        if (header) {
            document.body.insertBefore(header.content.cloneNode(true), document.body.firstChild);
        }
        
        // 页脚已通过模板系统加载，不需要在这里注入
        // if (footer) {
        //     document.body.appendChild(footer.content.cloneNode(true));
        // }
        
        // 加载回到顶部按钮
        if (backToTop) {
            document.body.appendChild(backToTop.content.cloneNode(true));
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // 加载组件
    await loadComponents();
    
    // 获取轮播图元素
    const slidesContainer = document.querySelector('.hero-slider');
    const slides = slidesContainer ? document.querySelectorAll('.hero-slider .slide') : [];
    const dots = slidesContainer ? document.querySelectorAll('.hero-slider .dot') : [];
    const prevBtn = document.querySelector('.hero-slider .prev');
    const nextBtn = document.querySelector('.hero-slider .next');
    let currentSlide = 0;
    const slideInterval = 5000; // 每5秒切换一次
    let slideTimer;

    // Initialize the carousel
    function initSlider() {
        // 检查是否有轮播图
        if (!slidesContainer || slides.length === 0) {
            console.info('当前页面没有轮播图组件，跳过初始化');
            return;
        }
        
        try {
            // Set the first slide as active
            showSlide(currentSlide);
            // Start automatic rotation
            startSlideTimer();
            
            // Add event listeners
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            
            if (dots && dots.length) {
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        currentSlide = index;
                        showSlide(currentSlide);
                    });
                });
            }
        } catch (error) {
            console.error('初始化轮播图出错:', error);
        }
    }

    // Show slide at specified index
    function showSlide(index) {
        if (!slides || slides.length === 0) {
            return; // 没有轮播图，直接返回
        }
        
        try {
            // Remove active state from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            if (dots && dots.length) {
                dots.forEach(dot => dot.classList.remove('active'));
            }
            
            // Activate current slide and corresponding dot
            slides[index].classList.add('active');
            if (dots && dots.length && dots[index]) {
                dots[index].classList.add('active');
            }
            
            // Reset automatic rotation timer
            resetSlideTimer();
        } catch (error) {
            console.error('切换轮播图出错:', error);
        }
    }

    // Go to next slide
    function nextSlide() {
        if (!slides || slides.length === 0) return;
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Go to previous slide
    function prevSlide() {
        if (!slides || slides.length === 0) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Start automatic carousel rotation
    function startSlideTimer() {
        if (!slides || slides.length <= 1) return; // 只有一张或没有轮播图时不需要自动切换
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    // Reset automatic carousel timer
    function resetSlideTimer() {
        if (!slides || slides.length <= 1) return;
        clearInterval(slideTimer);
        startSlideTimer();
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.lg\\:hidden');
    const mainNav = document.querySelector('nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('hidden');
            mainNav.classList.toggle('fixed');
            mainNav.classList.toggle('inset-0');
            mainNav.classList.toggle('bg-white');
            mainNav.classList.toggle('z-50');
            mainNav.classList.toggle('p-4');
            mainNav.classList.toggle('overflow-y-auto');
            document.body.classList.toggle('overflow-hidden');
        });

        // Close menu when clicking links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    mainNav.classList.add('hidden');
                    mainNav.classList.remove('fixed', 'inset-0', 'bg-white', 'z-50', 'p-4', 'overflow-y-auto');
                    document.body.classList.remove('overflow-hidden');
                }
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.querySelector('[title="回到顶部"]');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible');
                backToTopBtn.classList.remove('opacity-100', 'visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Submenu handling for mobile
    const subMenuParents = document.querySelectorAll('.nav-item');
    subMenuParents.forEach(parent => {
        const link = parent.querySelector('a');
        const submenu = parent.querySelector('.submenu');

        if (link && submenu) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    });

    // Language switcher handling 
    const langSwitcher = document.querySelector('.language-select');
    if (langSwitcher) {
        const dropdownMenu = langSwitcher.querySelector('.dropdown-menu');
        langSwitcher.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    // Initialize certificate slider
    function initCertSlider() {
        const slider = document.querySelector('.certificates-slider');
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // Scroll animation effects
    function initScrollAnimations() {
        // Get all elements that need animation
        const animatedElements = document.querySelectorAll('.section-title, .advantage-item, .product-category, .about-content, .about-image, .case-item');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, 
            { threshold: 0.1 }
        );

        // Observe each element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Initialization function
    function init() {
        initSlider();
        initCertSlider();
        initScrollAnimations();
    }

    // Execute initialization
    init();
});

// Hide loading animation after page load completes
window.addEventListener('load', function() {
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('preloader-hide');
        }
    }, 500);
});
