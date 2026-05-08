/**
 * 简单的下拉菜单控制器
 * 不需要依赖任何外部库
 */
document.addEventListener('DOMContentLoaded', function() {
    // 语言选择器下拉菜单
    const langDropdown = document.getElementById('language-dropdown');
    const langButton = document.getElementById('language-button');
    const langMenu = document.getElementById('language-menu');
    
    if (langButton && langMenu) {
        // 点击按钮时切换菜单显示
        langButton.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
            // 切换箭头方向
            const arrow = langButton.querySelector('svg');
            if (arrow) {
                arrow.classList.toggle('rotate-180');
            }
        });
        
        // 点击页面其他地方时关闭菜单
        document.addEventListener('click', function(e) {
            if (!langDropdown.contains(e.target)) {
                langMenu.classList.add('hidden');
                // 恢复箭头方向
                const arrow = langButton.querySelector('svg');
                if (arrow) {
                    arrow.classList.remove('rotate-180');
                }
            }
        });
        
        // ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !langMenu.classList.contains('hidden')) {
                langMenu.classList.add('hidden');
                // 恢复箭头方向
                const arrow = langButton.querySelector('svg');
                if (arrow) {
                    arrow.classList.remove('rotate-180');
                }
            }
        });
    }
});
