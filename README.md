# 恒基泰管道装备多语言企业网站

## 项目概述

这是一个支持10种语言的企业网站项目，为全球钢管制造企业提供全球化数字营销解决方案。项目采用模块化设计，支持多语言内容管理及自动化页面生成。

### 支持语言

- 中文 (cn)
- 英语 (en)
- 日语 (jp)
- 俄语 (ru)
- 阿拉伯语 (ar)
- 西班牙语 (es)
- 法语 (fr)
- 葡萄牙语 (pt)
- 印地语 (hi)
- 德语 (de)

## 技术栈

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Node.js (用于页面生成)
- Cloudflare Pages (部署方案)
- PostCSS (CSS处理)

## 主要特性

- 响应式设计，支持各类设备访问
- 高级SEO优化，支持多语言搜索引擎收录和结构化数据
- 统一的模板系统和组件化架构，便于维护
- RTL支持（阿拉伯语等）
- 优化的页面加载速度和性能
- 自动化页面生成系统
- 产品过滤和搜索功能
- 图片查看器和交互式内容

## 目录结构

```
├── [语言代码]/      # 各语言版本页面
│   ├── about.html
│   ├── cases.html
│   ├── contact.html
│   ├── index.html
│   ├── news.html
│   ├── products.html
│   └── quality.html
├── css/            # 样式文件
├── js/             # JavaScript文件
├── images/         # 图片资源
├── templates/      # HTML模板
└── scripts/        # 页面生成脚本
```

## 开发指南

### 项目设置

克隆项目后，安装依赖：

```bash
npm install
```

### 添加新页面

使用页面生成工具添加新页面：

```bash
# 生成基本页面
node scripts/1.\ generate-page.js [语言代码]

# 生成产品页面
node scripts/2.\ generate-products-page.js [语言代码]

# 生成案例页面
node scripts/3.\ generate-cases-page.js [语言代码]
```

### 更新样式

项目使用Tailwind CSS，修改样式请更新：

1. 修改 `tailwind.config.js` - Tailwind配置
2. 编辑 `css/tailwind-source.css` - 自定义Tailwind样式
3. 编辑 `css/style.css` - 传统CSS样式

然后运行以下命令重新构建CSS：

```bash
npm run build:tailwind  # 仅构建Tailwind
npm run build:css       # 构建所有CSS
npm run build           # 完整构建流程
```

### 本地开发

推荐使用VS Code和Live Server插件进行开发。开启Tailwind监视模式：

```bash
npm run watch:tailwind
```

## 部署

网站采用Cloudflare Pages进行静态页面部署，通过以下命令进行：

```bash
# 构建项目
npm run build

# 部署到Cloudflare Pages
npm run deploy
```

项目配置了自动化部署流程，支持持续集成和交付。

## 文档

- [市场价值分析报告](doc/市场分析.md)
- [SEO优化实现文档](doc/SEO.md)
- [产品页面生成器优化建议](doc/optimization-suggestions.md)

## 功能详细说明

### 1. 多语言内容管理
- 统一的翻译系统，支持10种语言无缝切换
- 语言特定的内容适配（包括RTL语言支持）
- 多语言SEO优化和hreflang标签实现

### 2. 产品展示系统
- 分类筛选功能：支持按产品类别筛选
- 产品搜索功能：基于关键词的产品搜索
- 产品详情弹窗：查看详细参数和规格
- 高清图片预览：产品图像放大查看功能

### 3. 客户案例展示
- 案例分类展示：按行业、地区等分类
- 案例详情页面：包含项目背景、方案和成果
- 案例数据统一管理（JSON格式）

### 4. 用户交互组件
- 浮动导航菜单：优化用户浏览体验
- 消息提交系统：联系表单和反馈系统
- 返回顶部功能：增强大页面浏览体验
- 图片查看器：支持图片缩放和浏览

### 5. 高级SEO功能
- 元数据管理系统：统一管理所有页面的SEO相关标签
- 结构化数据支持：实现丰富的搜索结果显示
- 多语言SEO：每种语言的特定优化
- 自动生成sitemap.xml：提升搜索引擎索引效率

### 6. 自动化构建系统
- 页面生成工具：基于模板快速创建新页面
- 样式构建流程：Tailwind与自定义CSS结合
- 部署自动化：Cloudflare Pages集成

## 更新日志

### 2025-06-13
- 添加产品过滤功能增强
- 优化图片查看器交互体验
- 更新文档和功能说明
- 提升SEO结构化数据支持

### 2025-05-22
- 完成10种语言版本开发
- 优化页面加载速度
- 添加市场分析报告