/**
 * 产品过滤和搜索功能
 */
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const searchInput = document.getElementById('product-search');
    const navMenuItems = document.querySelectorAll('.dropdown-menu a[href*="products.html?category="]');
    
    // 定义产品类别与产品名称的映射关系
    const categoryMap = {
        // 导航菜单中的主要分类
        'plastic-coating': [
            'cdu-quick-connect-plastic-coated-steel-pipes', 
            'threaded-connection-plastic-coated-steel-pipes', 
            'clamp-connection-plastic-coated-steel-pipes', 
            'socket-plastic-coated-steel-pipes',
            'bimetal-welded-plastic-coated-steel-pipes', 
            'internal-external-epoxy-coated-steel-pipe', 
            'external-galvanized-internal-plastic-coated-steel-pipes', 
            'water-supply-plastic-coated-steel-pipes', 
            'gas-plastic-coated-steel-pipes', 
            'fire-protection-plastic-coated-steel-pipes', 
            'colored-double-resistance-plastic-coated-steel-pipes', 
            'loose-flange-connection-plastic-coated-steel-pipes', 
            'grooved-connection-plastic-coated-steel-pipes', 
            'flange-connection-mining-plastic-coated-steel-pipes'
        ],
        'anti-corrosion': [
            '3pe-anti-corrosion-steel-pipes', 
            'socket-tpep-anti-corrosion-steel-pipes'
        ],
        'steel-pipes': [
            'large-diameter-internal-epoxy-coated-steel-pipes', 
            'large-diameter-composite-plastic-coated-steel-pipes', 
            'large-diameter-internal-ep-external-pe-anti-corrosion-steel-pipes'
        ],
        'pipe-fittings': [
            'loose-flange-connection-plastic-coated-steel-pipes', 
            'grooved-connection-plastic-coated-steel-pipes', 
            'flange-connection-mining-plastic-coated-steel-pipes'
        ]
    };
    
    // 选择所有产品卡片
    const productCards = document.querySelectorAll('.category-overview-card');
    
    // 给每个产品卡片添加分类属性
    productCards.forEach(card => {
        const href = card.getAttribute('href');
        if (href) {
            // 从href中提取产品标识符
            const productId = href.split('/').pop().replace('.html', '');
            
            // 确定这个产品属于哪些分类
            const categories = [];
            for (const [category, products] of Object.entries(categoryMap)) {
                if (products.some(product => productId.includes(product))) {
                    categories.push(category);
                }
            }
            
            // 设置data属性
            card.setAttribute('data-categories', categories.join(','));
        }
    });
    
    // 输出调试信息
    console.log('找到的产品卡片数量:', productCards.length);
    if (categorySelect) {
        console.log('可用的分类选项:', Array.from(categorySelect.options).map(o => ({ value: o.value, text: o.text })));
    }

    // 检查URL参数，如果有category参数，自动选中并过滤
    function checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            console.log('从URL获取到分类参数:', category);
            
            if (categorySelect) {
                // 首先尝试直接匹配下拉选择框的选项
                let matchFound = false;
                const options = Array.from(categorySelect.options);
                
                for (const option of options) {
                    // 检查选项值是否包含类别参数
                    if (option.value.includes(category)) {
                        categorySelect.value = option.value;
                        matchFound = true;
                        console.log('找到匹配的选项:', option.value);
                        break;
                    }
                }
                
                // 如果没有直接匹配，使用第一个选项（通常是"全部产品"）
                if (!matchFound) {
                    console.log('未找到匹配的选项，使用默认选项');
                }
            }
            
            // 无论是否找到匹配选项，都应用过滤
            filterProducts(category);
        } else {
            console.log('URL中没有分类参数');
        }
    }
    
    // 处理分类过滤
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            console.log('选择的分类:', selectedCategory);
            filterProducts(selectedCategory);
        });
    }

    // 处理搜索过滤
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // 防抖处理
            clearTimeout(window.searchDebounce);
            window.searchDebounce = setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category');
                filterProducts(category);
            }, 300);

        });
    }

    // 高亮显示当前激活的分类菜单项
    function highlightActiveCategory(category) {
        if (!category || category === 'all') return;
        
        // 移除所有菜单项的激活样式
        navMenuItems.forEach(item => {
            item.classList.remove('bg-gray-100', 'text-primary', 'font-medium');
        });
        
        // 给当前选中的菜单项添加激活样式
        navMenuItems.forEach(item => {
            if (item.href.includes(`category=${category}`)) {
                item.classList.add('bg-gray-100', 'text-primary', 'font-medium');
            }
        });
    }
    
    // 过滤产品
    function filterProducts(urlCategory) {
        // 如果提供了URL分类参数，优先使用它，否则使用下拉框选择的值
        const selectedCategory = urlCategory || (categorySelect ? categorySelect.value : 'all');
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        let visibleProducts = 0;
        
        // 高亮显示当前激活的分类
        highlightActiveCategory(selectedCategory);
        
        // 更新URL参数
        const url = new URL(window.location);
        if (selectedCategory && selectedCategory !== 'all') {
            url.searchParams.set('category', selectedCategory);
        } else {
            url.searchParams.delete('category');
        }
        history.replaceState({}, '', url);
        
        // 输出调试信息
        console.log('当前选择的分类:', selectedCategory);
        console.log('搜索文本:', searchText);
        console.log('当前URL:', window.location.href);
        
        // 遍历所有产品卡片
        productCards.forEach(card => {
            let shouldShow = false;
            
            // 获取产品的分类信息
            const categories = card.getAttribute('data-categories');
            
            if (selectedCategory === 'all') {
                // 显示所有产品
                shouldShow = true;
            } else if (categories && categories.includes(selectedCategory)) {
                // 产品属于选定的分类
                shouldShow = true;
            }
            
            // 如果有搜索文本，进一步过滤
            if (shouldShow && searchText) {
                const cardText = card.textContent.toLowerCase();
                shouldShow = cardText.includes(searchText);
            }
            
            // 显示或隐藏产品卡片
            if (shouldShow) {
                card.style.display = 'block';
                visibleProducts++;
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log('筛选后可见产品数量:', visibleProducts);
        
        // 滚动到产品列表顶部
        const productSection = document.querySelector('.category-overview-card');
        if (productSection) {
            const section = productSection.closest('section');
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    }

    // 初始检查 URL 参数
    checkUrlParameters();
});