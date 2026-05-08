#!/usr/bin/env node

/**
 * 自动化部署脚本
 * 在部署前自动执行 SEO 优化任务
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始自动化部署流程...\n');

// 步骤 1: 构建项目
console.log('📦 步骤 1: 构建项目');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ 项目构建完成\n');
} catch (error) {
    console.error('❌ 项目构建失败');
    process.exit(1);
}

// 步骤 2: 生成 Sitemap
console.log('🗺️  步骤 2: 生成 Sitemap');
try {
    execSync('npm run seo:sitemap', { stdio: 'inherit' });
    console.log('✅ Sitemap 生成完成\n');
} catch (error) {
    console.warn('⚠️  Sitemap 生成失败，继续部署');
}

// 步骤 3: SEO 检查
console.log('🔍 步骤 3: SEO 健康检查');
try {
    execSync('npm run seo:audit', { stdio: 'inherit' });
    console.log('✅ SEO 检查完成\n');
} catch (error) {
    console.warn('⚠️  SEO 检查发现问题，但继续部署');
}

// 步骤 4: 图片检查
console.log('🖼️  步骤 4: 图片优化检查');
try {
    execSync('npm run seo:images', { stdio: 'inherit' });
    console.log('✅ 图片检查完成\n');
} catch (error) {
    console.warn('⚠️  图片检查失败，继续部署');
}

// 步骤 5: 验证重要文件
console.log('📋 步骤 5: 验证重要文件');
const requiredFiles = [
    'robots.txt',
    'sitemap.xml', 
    '_headers',
    '_redirects',
    'seo-config.json'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
    console.warn(`⚠️  缺少文件: ${missingFiles.join(', ')}`);
} else {
    console.log('✅ 所有重要文件都存在');
}

// 步骤 6: 执行部署
console.log('\n🌐 步骤 6: 部署到 Cloudflare Pages');
try {
    execSync('wrangler deploy', { stdio: 'inherit' });
    console.log('\n🎉 部署成功完成!');
    
    // 部署后提示
    console.log('\n📊 部署后建议:');
    console.log('1. 检查 Google Search Console 的索引状态');
    console.log('2. 提交新的 Sitemap 到搜索引擎');
    console.log('3. 监控 Core Web Vitals 性能指标');
    console.log('4. 验证多语言页面的 hreflang 标签');
    
} catch (error) {
    console.error('❌ 部署失败');
    process.exit(1);
}

// 生成部署报告
const deployReport = {
    timestamp: new Date().toISOString(),
    status: 'success',
    files: {
        sitemap: fs.existsSync('sitemap.xml'),
        robots: fs.existsSync('robots.txt'),
        headers: fs.existsSync('_headers'),
        redirects: fs.existsSync('_redirects')
    },
    warnings: missingFiles
};

fs.writeFileSync('deploy-report.json', JSON.stringify(deployReport, null, 2));
console.log('\n📄 部署报告已保存到 deploy-report.json');
