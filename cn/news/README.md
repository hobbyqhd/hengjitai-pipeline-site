# 恒基泰管道装备网站 - 新闻系统使用说明

本文档简要说明恒基泰管道装备网站的新闻发布系统及其使用方法。详细技术文档请参见 `doc/news-system-design.md` 和 `doc/news-system-guide.md`。

## 系统概述

新闻系统采用基于JSON和GitHub Actions的自动化发布流程，允许提前准备内容并按预设日期自动发布。

### 主要文件和目录

```
cn/news/
  ├── file-list.json                # 已发布新闻列表
  ├── scheduled-news.json           # 待发布新闻列表
  ├── published/                    # 已发布的详细内容
  ├── scheduled/                    # 待发布的详细内容
  ├── assets/                       # 新闻相关的图片等资源
  └── scripts/                      # 自动化脚本
      └── publish-news.js           # 发布脚本
```

## 如何添加新闻

1. 在 `cn/news/scheduled-news.json` 中添加新闻条目
2. 将详细HTML文件保存到 `cn/news/scheduled/分类名称/` 目录
3. 将相关图片保存到 `cn/news/assets/scheduled/文章名称/` 目录
4. 提交更改到仓库

## 自动发布流程

系统通过GitHub Actions实现每日自动发布：
- 每天早上8:30自动运行
- 检查 `scheduled-news.json` 中的发布日期
- 将到期发布的内容移动到已发布状态
- 自动提交更改到仓库

## 手动触发发布

如需立即发布内容：
1. 访问GitHub仓库
2. 转到Actions标签页
3. 选择"Daily News Publication"
4. 点击"Run workflow"按钮

## 发布日期格式

发布日期必须使用标准格式 `YYYY-MM-DD`，例如 `2025-06-30`。

## 更多信息

详细的系统设计和使用指南请参阅：
- `doc/news-system-design.md` - 技术设计文档
- `doc/news-system-guide.md` - 用户指南
