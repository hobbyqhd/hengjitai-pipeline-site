# 恒基泰管道装备网站新闻系统设计文档

**文档版本：** 1.0  
**创建日期：** 2025年6月15日

## 目录

1. [系统概述](#1-系统概述)
2. [文件结构](#2-文件结构)
3. [数据结构](#3-数据结构)
4. [自动发布机制](#4-自动发布机制)
5. [工作流程](#5-工作流程)
6. [维护指南](#6-维护指南)
7. [SEO考量](#7-seo考量)
8. [故障排除](#8-故障排除)
9. [未来扩展](#9-未来扩展)

## 1. 系统概述

恒基泰管道装备网站的新闻系统采用基于JSON的数据管理方式，结合GitHub Actions自动化工作流，实现了以下功能：

- 提前准备多天的新闻内容
- 按照预设日期自动发布
- 显示已发布内容，隐藏未发布内容
- 确保搜索引擎仅索引已发布内容
- 自动化发布过程，无需人工干预

该系统充分利用现有的Git工作流程，通过提交代码到`main`分支来触发网站更新，降低了维护复杂度同时提升了内容管理效率。

## 2. 文件结构

新闻系统的文件结构如下：

```
/cn/news/
  ├── file-list.json                # 已发布新闻列表
  ├── scheduled-news.json           # 待发布新闻列表
  ├── published/                    # 已发布的详细内容
  │   ├── category1/
  │   │   ├── news-title-1.html
  │   │   └── news-title-2.html
  │   ├── category2/
  │   │   └── ...
  │   └── ...
  ├── scheduled/                    # 待发布的详细内容
  │   ├── category1/
  │   │   ├── future-news-1.html
  │   │   └── future-news-2.html
  │   ├── category2/
  │   │   └── ...
  │   └── ...
  ├── scripts/
  │   └── publish-news.js           # 发布脚本
  └── assets/
      ├── published/                # 已发布新闻的图片等资源
      │   ├── news-title-1/
      │   │   ├── main.jpg
      │   │   └── gallery1.jpg
      │   └── ...
      └── scheduled/                # 待发布新闻的图片等资源
          ├── future-news-1/
          │   ├── main.jpg
          │   └── gallery1.jpg
          └── ...
```

## 3. 数据结构

### 3.1 `file-list.json` 结构

```json
{
  "categories": {
    "category1": "公司新闻",
    "category2": "行业动态",
    "category3": "技术文章",
    "category4": "媒体报道"
  },
  "files": [
    {
      "category": "category1",
      "results": [
        {
          "title": "2020年回顾与展望",
          "slug": "2020.html",
          "date": "2020-12-31",
          "publishDate": "2020-12-31",
          "categoryKey": "category1",
          "category": "公司新闻",
          "content": "回顾2020年的主要成就和对未来的展望...",
          "src": "/images/news/2020-summary.jpg",
          "alt": "2020年回顾",
          "detailUrl": "news/category1/2020.html"
        },
        // 更多已发布新闻...
      ]
    },
    // 更多分类...
  ]
}
```

### 3.2 `scheduled-news.json` 结构

与`file-list.json`结构相同，但包含尚未发布的新闻内容。

### 3.3 新闻条目字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| title | 字符串 | 新闻标题 |
| slug | 字符串 | URL友好的文件名，如 "company-news-2025.html" |
| date | 字符串 | 显示用日期，格式为 "YYYY-MM-DD" |
| publishDate | 字符串 | 实际发布日期，格式为 "YYYY-MM-DD" |
| categoryKey | 字符串 | 分类键，如 "category1" |
| category | 字符串 | 分类名称，如 "公司新闻" |
| content | 字符串 | 新闻内容摘要或完整HTML内容 |
| src | 字符串 | 主图片路径 |
| alt | 字符串 | 图片替代文本 |
| detailUrl | 字符串 | 详情页URL |

## 4. 自动发布机制

### 4.1 GitHub Actions 工作流

使用GitHub Actions创建定时任务，每天自动检查并发布到期内容。配置文件`.github/workflows/publish-news.yml`如下：

```yaml
name: Daily News Publication

on:
  schedule:
    - cron: '30 0 * * *'  # UTC时间，对应北京时间8:30
  workflow_dispatch: # 允许手动触发

jobs:
  publish-news:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Run publication script
        run: node cn/news/scripts/publish-news.js

      - name: Check if there are changes
        id: check-changes
        run: |
          git diff --quiet || echo "has_changes=true" >> $GITHUB_OUTPUT

      - name: Commit and push changes
        if: steps.check-changes.outputs.has_changes == 'true'
        run: |
          git config --global user.name 'News Publication Bot'
          git config --global user.email 'bot@example.com'
          git add -A
          git commit -m "Auto-publish news for $(date +'%Y-%m-%d')"
          git push
```

### 4.2 发布脚本逻辑

`publish-news.js`脚本执行以下操作：

1. 读取`scheduled-news.json`和`file-list.json`
2. 检查当前日期，找出应该发布的新闻
3. 将达到发布日期的新闻从`scheduled-news.json`移动到`file-list.json`
4. 将相关HTML文件从`scheduled/`目录移动到`published/`目录
5. 将相关资源文件从`assets/scheduled/`移动到`assets/published/`
6. 更新并保存JSON文件
7. Git操作自动提交所有变更

## 5. 工作流程

### 5.1 内容准备流程

1. **新闻内容准备**
   - 撰写新闻文本
   - 准备相关图片资源
   - 创建HTML详情页面（如需）

2. **文件创建**
   - 在`scheduled-news.json`添加新闻条目，设置`publishDate`
   - 将HTML文件保存到`cn/news/scheduled/<category>/`目录
   - 将图片资源保存到`cn/news/assets/scheduled/<news-name>/`目录

3. **提交到仓库**
   - 将所有文件添加到Git
   - 提交并推送到`main`分支
   - 内容已上传但尚未发布（因为`publishDate`未到）

### 5.2 自动发布流程

1. **定时检查**
   - GitHub Actions按计划运行发布脚本
   - 检查`scheduled-news.json`中的`publishDate`

2. **内容移动**
   - 将到期发布的新闻条目从`scheduled-news.json`移动到`file-list.json`
   - 移动相应的HTML文件和资源文件到已发布目录

3. **提交更改**
   - 自动提交所有变更到`main`分支
   - 触发网站重新构建和部署
   - 新内容在网站上可见

## 6. 维护指南

### 6.1 添加新闻

1. 打开`cn/news/scheduled-news.json`
2. 在适当分类的`results`数组中添加新闻条目
3. 设置所有必要字段，特别是`publishDate`（决定发布时间）
4. 将相关文件保存到正确位置
5. 提交并推送更改

### 6.2 修改未发布新闻

1. 在`scheduled-news.json`中找到并修改相应条目
2. 更新相关HTML和图片资源
3. 提交更改

### 6.3 修改已发布新闻

1. 在`file-list.json`中找到并修改相应条目
2. 更新相关HTML和图片资源
3. 提交更改

### 6.4 删除新闻

1. 从相应JSON文件中移除条目
2. 删除相关HTML和资源文件
3. 提交更改

### 6.5 手动触发发布

如需在计划时间外发布内容：

1. 访问GitHub仓库
2. 转到Actions标签页
3. 选择"Daily News Publication"工作流
4. 点击"Run workflow"按钮
5. 确认运行

## 7. SEO考量

### 7.1 搜索引擎可见性

- 已发布新闻在网站前端可见，搜索引擎可以正常索引
- 未发布新闻（`scheduled-news.json`中的内容）对用户和搜索引擎均不可见
- 发布脚本自动将内容从不可见状态转为可见状态

### 7.2 URL结构

新闻详情页面采用SEO友好的URL结构：
```
https://hengjitaipipeline.com/cn/news/category1/news-title.html
```

### 7.3 结构化数据

新闻页面包含结构化数据标记，帮助搜索引擎理解内容：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "新闻标题",
  "datePublished": "2025-06-15",
  "publisher": {
    "@type": "Organization",
    "name": "沧州恒基泰管道装备有限公司",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hengjitaipipeline.com/images/logo.png"
    }
  }
}
</script>
```

## 8. 故障排除

### 8.1 常见问题

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| 到期新闻未发布 | GitHub Actions未运行 | 检查GitHub Actions日志，手动触发工作流 |
| 新闻发布但图片丢失 | 图片路径错误或资源未移动 | 检查脚本运行日志，确认资源路径正确 |
| JSON格式错误 | 手动编辑时的语法错误 | 使用JSON验证工具检查格式 |
| 发布错误内容 | `publishDate`设置错误 | 及时修改并重新提交 |

### 8.2 脚本错误排查

如果自动发布脚本失败：

1. 检查GitHub Actions运行日志
2. 确认JSON文件语法正确
3. 验证文件路径和目录结构
4. 检查Git权限配置

## 9. 未来扩展

### 9.1 潜在功能增强

- **多语言支持**：扩展结构支持各语言版本独立发布
- **作者管理**：添加作者信息和内容归属
- **评论系统**：集成用户评论功能
- **分析集成**：添加阅读量、分享数统计
- **内容审批流程**：增加内容审核和多级发布流程

### 9.2 系统优化方向

- **内容预览**：添加未发布内容的预览功能
- **批量操作**：支持批量添加和编辑新闻
- **富媒体支持**：增强对视频、幻灯片等内容的支持
- **自动化测试**：添加新闻发布流程的自动化测试

---

## 附录：快速参考

### JSON字段要求

| 字段 | 是否必填 | 格式 | 示例 |
|------|---------|------|------|
| title | 是 | 字符串 | "公司新产品发布会" |
| slug | 是 | 字符串 | "new-product-release.html" |
| date | 是 | YYYY-MM-DD | "2025-06-15" |
| publishDate | 是 | YYYY-MM-DD | "2025-06-15" |
| categoryKey | 是 | 字符串 | "category1" |
| content | 是 | 字符串/HTML | "公司发布了新产品..." |
| src | 是 | 路径 | "/images/news/product.jpg" |
| alt | 是 | 字符串 | "新产品图片" |
| detailUrl | 是 | 路径 | "news/category1/news-title.html" |

### 目录用途说明

| 目录 | 用途 |
|------|------|
| cn/news/file-list.json | 已发布新闻列表 |
| cn/news/scheduled-news.json | 待发布新闻列表 |
| cn/news/published/ | 已发布新闻HTML文件 |
| cn/news/scheduled/ | 待发布新闻HTML文件 |
| cn/news/assets/published/ | 已发布新闻资源 |
| cn/news/assets/scheduled/ | 待发布新闻资源 |
| cn/news/scripts/ | 自动化脚本 |
