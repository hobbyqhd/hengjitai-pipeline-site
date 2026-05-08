/**
 * 工程案例详情弹窗功能
 * 用于显示工程案例的详细信息
 * 适配新布局：文字在上，图片在下
 */

document.addEventListener('DOMContentLoaded', () => {
    // 显示案例详情模态框
    function showCaseModal(caseData) {
        const modal = document.getElementById('case-modal');
        if (!modal) {
            return;
        }
        
        // 获取所有模态框元素
        const elements = {
            title: document.getElementById('case-modal-title'),
            image: document.getElementById('case-modal-image'),
            categories: document.getElementById('case-modal-categories'),
            overview: document.getElementById('case-modal-overview'),
            solution: document.getElementById('case-modal-solution'),
            results: document.getElementById('case-modal-results')
        };
        
        // 确保所有必须的元素都存在
        if (!elements.title || !elements.image || !elements.categories || 
            !elements.overview || !elements.solution || !elements.results) {
            return;
        }
        
        // 设置标题和图片
        elements.title.textContent = caseData.title || '未命名案例';
        elements.image.src = caseData.image || '';
        elements.image.alt = caseData.title || '案例图片';
        elements.image.title = caseData.title || '案例图片';
        
        // 清空并设置分类标签
        elements.categories.innerHTML = '';
        if (caseData.categories && Array.isArray(caseData.categories)) {
            caseData.categories.forEach(category => {
                const span = document.createElement('span');
                span.className = 'px-3 py-1 bg-blue-100 text-primary text-sm rounded-full mr-2 mb-2';
                span.textContent = category;
                elements.categories.appendChild(span);
            });
        } else {
            // 如果没有分类，添加一个默认分类
            const span = document.createElement('span');
            span.className = 'px-3 py-1 bg-blue-100 text-primary text-sm rounded-full mr-2 mb-2';
            span.textContent = '未分类';
            elements.categories.appendChild(span);
        }
        
        // 设置内容区域，添加更好的格式支持
        elements.overview.innerHTML = caseData.overview ? 
            formatContent(caseData.overview) : 
            '<p>暂无概述信息</p>';
            
        elements.solution.innerHTML = caseData.solution ? 
            formatContent(caseData.solution) : 
            '<p>暂无解决方案信息</p>';
            
        elements.results.innerHTML = caseData.results ? 
            formatContent(caseData.results) : 
            '<p>暂无结果信息</p>';
        
        // 显示模态框
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 重置滚动位置到顶部
        const scrollableContent = document.querySelector('.case-modal-scroll');
        if (scrollableContent) {
            scrollableContent.scrollTop = 0;
        }
    }
    
    // 内容格式化函数 - 处理换行和基本格式
    function formatContent(content) {
        // 如果已经是HTML，则直接返回
        if (content.trim().startsWith('<')) {
            return content;
        }
        
        // 处理段落和换行
        return content
            .split('\n\n')
            .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
            .join('');
    }
    
    // 隐藏案例详情模态框
    function hideCaseModal() {
        const modal = document.getElementById('case-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // 恢复背景滚动
            
            // 在关闭后也重置滚动位置，确保下一次打开时从顶部开始
            setTimeout(() => {
                const scrollableContent = document.querySelector('.case-modal-scroll');
                if (scrollableContent) {
                    scrollableContent.scrollTop = 0;
                }
            }, 300); // 短暂延迟，确保动画完成后重置
        }
    }
    
    // 初始化：绑定事件
    function init() {
        // 绑定关闭按钮事件
        const closeModalBtn = document.getElementById('close-case-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                hideCaseModal();
            });
        }
        
        const closeDetailsBtn = document.getElementById('close-case-details');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                hideCaseModal();
            });
        }
        
        // 点击模态框背景关闭
        const modal = document.getElementById('case-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                // 检查点击的是否是背景遮罩或模态框本身（不包括模态框内容）
                if (e.target === modal || 
                    e.target.classList.contains('modal-overlay') || 
                    e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                    hideCaseModal();
                }
            });
        }
        
        // 按下ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideCaseModal();
            }
        });
    }
    
    // 初始化模态框功能
    init();
    
    // 将showCaseModal函数导出为全局变量，供Vue组件调用
    window.openCaseModal = showCaseModal;
});
