# SEO 优化实现文档

## 功能概述

本项目实现了完整的SEO(搜索引擎优化)功能，包含以下核心特性：

### 1. 元数据管理系统

核心文件: `scripts/shared/metadata.js`

```javascript
const meta = metadata.getPageMetadata('cn', 'about');
```

支持以下元数据类型：
- 基础SEO标签 (title, description, keywords)
- 社交媒体标签 (OpenGraph, Twitter Cards)
- 结构化数据 (JSON-LD)
- 多语言支持标签 (hreflang)
- 移动设备优化标签

### 2. 结构化数据支持

支持多种类型的Schema.org结构化数据：
```javascript
// 产品页面
const productData = metadata.generateStructuredData('product', {
    name: '3PE防腐钢管',
    description: '高品质3PE防腐钢管产品描述'
});

// 公司简介页面
const aboutData = metadata.generateStructuredData('about', {
    description: '公司简介',
    foundingDate: '1995'
});
```

### 3. 多语言SEO

- 自动生成语言切换链接
- 支持RTL语言
- 针对不同语言优化meta标签
```html
<link rel="alternate" hreflang="zh-CN" href="../cn/about.html" />
<link rel="alternate" hreflang="en" href="../en/about.html" />
```

### 4. 移动设备优化

```javascript
const mobileOptimization = {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    themeColor: '#ffffff',
    applicationName: companyName
};
```

### 5. 自动化工具

1. **Sitemap生成器**
```bash
node scripts/generate-sitemap.js
```

2. **Robots.txt**
```txt
User-agent: *
Allow: /
Sitemap: https://www.example.com/sitemap.xml
```

## 使用方法

### 1. 基础页面生成

```javascript
const metadata = require('./shared/metadata');

// 获取页面元数据
const meta = metadata.getPageMetadata('cn', 'about');
```

### 2. 产品页面生成

```javascript
const meta = metadata.getPageMetadata('cn', 'product', {
    name: '3PE防腐钢管',
    description: '高品质3PE防腐钢管,抗腐蚀能力强',
    keywords: '3PE防腐钢管,防腐钢管,钢管',
    image: '/images/products/3pe-pipe.jpg'
});
```

### 3. 更新站点配置

在 `metadata.js` 中修改 `siteConfig`:

```javascript
const siteConfig = {
    siteName: '沧州恒基泰管道装备有限公司',
    siteUrl: 'https://www.yoursite.com',
    logoUrl: 'https://www.yoursite.com/images/logo.png',
    socialMedia: {
        twitter: '@yourtwitterhandle',
        facebook: 'yourfacebookpage'
    }
};
```

## 最佳实践

1. **页面标题优化**
- 包含主要关键词
- 控制长度在60字符以内
- 品牌名称放在末尾

2. **Meta Description优化**
- 包含关键词
- 控制在150-160字符
- 有吸引力的描述文案

3. **URL结构**
- 使用语言代码作为目录 (/cn/, /en/)
- 使用语义化URL
- 保持URL简短清晰

4. **图片优化**
- 使用有意义的文件名
- 添加alt属性
- 优化图片大小和格式

## 监控与维护

1. **定期检查**
- 检查404错误页面
- 更新sitemap
- 验证结构化数据

2. **性能优化**
- 监控页面加载速度
- 优化移动端体验
- 检查Web Core Vitals指标

## 技术栈

- Node.js
- Schema.org
- OpenGraph Protocol
- Twitter Cards

## 注意事项

1. 确保所有页面都有唯一的标题和描述
2. 定期更新sitemap.xml
3. 保持多语言内容的同步更新
4. 监控并响应搜索引擎的爬虫反馈

## 扩展计划

- [ ] 添加更多类型的结构化数据
- [ ] 实现自动化SEO报告
- [ ] 添加SEO性能监控
- [ ] 优化移动端适配
