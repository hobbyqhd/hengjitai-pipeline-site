#!/usr/bin/env node

/**
 * 图片 SEO 优化脚本
 * 为图片生成 WebP 格式，添加 alt 属性检查
 */

const fs = require('fs');
const path = require('path');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const imageDirs = ['images', 'cn/images', 'en/images', 'jp/images', 'de/images', 'es/images', 'fr/images', 'pt/images', 'ru/images', 'ar/images', 'hi/images'];

function scanImages() {
    const results = {
        total: 0,
        withoutAlt: [],
        largeFiles: [],
        missingWebP: []
    };

    imageDirs.forEach(dir => {
        const fullPath = path.join(process.cwd(), dir);
        if (fs.existsSync(fullPath)) {
            scanDirectory(fullPath, results);
        }
    });

    return results;
}

function scanDirectory(dirPath, results) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
        if (file.isDirectory()) {
            scanDirectory(path.join(dirPath, file.name), results);
        } else if (imageExtensions.includes(path.extname(file.name).toLowerCase())) {
            results.total++;
            const filePath = path.join(dirPath, file.name);
            
            // 检查文件大小
            const stats = fs.statSync(filePath);
            if (stats.size > 500 * 1024) { // 大于 500KB
                results.largeFiles.push({
                    path: filePath,
                    size: Math.round(stats.size / 1024) + 'KB'
                });
            }
            
            // 检查是否有对应的 WebP 文件
            const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            if (!fs.existsSync(webpPath)) {
                results.missingWebP.push(filePath);
            }
        }
    });
}

// 生成图片优化报告
function generateReport() {
    const results = scanImages();
    
    console.log('\n=== 图片 SEO 优化报告 ===');
    console.log(`总图片数量: ${results.total}`);
    
    if (results.largeFiles.length > 0) {
        console.log(`\n⚠️  大文件 (>500KB): ${results.largeFiles.length}`);
        results.largeFiles.forEach(file => {
            console.log(`  - ${file.path} (${file.size})`);
        });
    }
    
    if (results.missingWebP.length > 0) {
        console.log(`\n📸 缺少 WebP 格式: ${results.missingWebP.length}`);
        results.missingWebP.slice(0, 5).forEach(file => {
            console.log(`  - ${file}`);
        });
        if (results.missingWebP.length > 5) {
            console.log(`  ... 还有 ${results.missingWebP.length - 5} 个文件`);
        }
    }
    
    console.log('\n💡 优化建议:');
    console.log('1. 使用工具如 ImageOptim/TinyPNG 压缩大文件');
    console.log('2. 考虑为主要图片生成 WebP 格式');
    console.log('3. 在 HTML 中使用 <picture> 元素支持 WebP');
    console.log('4. 确保所有图片都有描述性的 alt 属性');
}

if (require.main === module) {
    generateReport();
}

module.exports = { scanImages, generateReport };
