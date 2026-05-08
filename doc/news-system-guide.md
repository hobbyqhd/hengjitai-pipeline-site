# 网站新闻系统使用和维护指南

本文档是技术文档 [news-system-design.md](news-system-design.md) 的简化版，专为内容编辑人员设计，提供使用新闻系统的简明指南。

## 基本概念

新闻系统允许您:
1. 提前准备和上传新闻内容
2. 设置发布日期，系统会在该日期自动发布内容
3. 组织新闻到不同分类

## 如何添加新闻

### 步骤1: 准备新闻内容

1. 撰写新闻文本内容
2. 准备相关图片
3. 如果需要详细页面，准备HTML文件

### 步骤2: 添加到待发布列表

打开文件 `cn/news/scheduled-news.json`，在适当分类下添加新条目:

```json
{
  "title": "新闻标题",
  "slug": "news-title.html", 
  "date": "2025-06-20",
  "publishDate": "2025-06-20", 
  "categoryKey": "category1",
  "category": "公司新闻",
  "content": "新闻内容摘要...",
  "src": "/images/news/assets/published/news-title/main.jpg",
  "alt": "图片描述",
  "detailUrl": "news/category1/news-title.html"
}
```

**字段说明:**
- `title`: 新闻标题
- `slug`: 文件名 (建议使用英文、数字和连字符)
- `date`: 显示给用户的日期
- `publishDate`: 实际发布日期 (系统据此决定何时发布)
- `categoryKey`: 分类键 (使用预定义的分类键)
- `category`: 分类名称
- `content`: 新闻摘要或简短描述
- `src`: 主图片路径
- `alt`: 图片替代文本
- `detailUrl`: 详情页URL

### 步骤3: 添加图片和详情页

1. 创建详情页HTML文件:
   - 保存到 `cn/news/scheduled/分类文件夹/`
   - 文件名必须与上方定义的`slug`一致

2. 添加图片资源:
   - 在 `cn/news/assets/scheduled/` 创建与新闻同名的文件夹
   - 将图片文件放入该文件夹

### 步骤4: 提交内容

将所有添加的文件提交到Git仓库:
1. 使用Git客户端或GitHub网页界面
2. 提交修改到`main`分支
3. 推送更改

## 新闻发布流程

1. 自动发布:
   - 系统每天早上8:30自动检查待发布新闻
   - 达到`publishDate`的新闻会自动发布
   - 无需人工干预

2. 手动触发发布:
   - 访问GitHub仓库
   - 进入Actions标签页
   - 选择"Daily News Publication"工作流
   - 点击"Run workflow"按钮

## 修改和删除

### 修改未发布新闻:
1. 在`scheduled-news.json`中找到并修改内容
2. 更新相关文件
3. 提交更改

### 修改已发布新闻:
1. 在`file-list.json`中找到并修改内容
2. 更新相关文件
3. 提交更改

### 删除新闻:
1. 从JSON文件中删除对应条目
2. 删除相关文件
3. 提交更改

## 常见问题解决

### 新闻未按计划发布
- 检查`publishDate`格式是否正确(YYYY-MM-DD)
- 验证JSON文件格式是否有效
- 检查GitHub Actions是否运行正常

### 图片显示错误
- 确认图片路径正确
- 检查图片是否已上传到正确位置
- 验证图片格式是否受支持

### JSON文件格式错误
使用在线JSON验证工具检查格式正确性:
1. 访问 https://jsonlint.com/
2. 粘贴JSON内容
3. 点击验证
4. 修复任何报告的错误

## GitHub 通知系统

新闻系统使用 GitHub 内置的通知功能，在工作流执行完成后自动发送执行状态通知。

### 通知内容

GitHub 通知会包含：

- 工作流执行状态（成功/警告/失败）
- 操作执行摘要
- 指向详细 Actions 运行记录的链接

### 通知接收设置

要接收 GitHub 通知：

1. 在 GitHub 上关注项目仓库（点击 "Watch" 按钮）
2. 在个人 GitHub 设置页面中配置通知首选项
3. 确保您的电子邮件已在 GitHub 中验证

### 通知级别说明

系统会根据工作流执行结果发送不同级别的通知：

- **成功通知**：所有任务均成功完成时
- **警告通知**：部分任务成功但有跳过或次要问题时
- **错误通知**：关键任务失败时

### 通知问题排查

如未收到通知：

- 检查您的电子邮件垃圾箱
- 确认您已正确设置 GitHub 通知首选项
- 验证您是否已关注相关仓库
- 检查您是否有足够的仓库访问权限

更多关于 GitHub 通知系统的详细设置，请参考[GitHub通知配置指南](github-notification-setup.md)。

## 联系支持

如遇到任何问题或需要帮助，请联系IT部门或系统管理员。
