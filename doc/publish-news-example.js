/**
 * 自动发布新闻脚本
 * 
 * 此脚本检查待发布新闻，将达到发布日期的新闻移动到已发布列表
 * 并移动相应的HTML文件和资源文件
 * 
 * 使用方法：node publish-news.js
 */

const fs = require('fs');
const path = require('path');

// 文件路径配置
const PUBLISHED_FILE = path.join(__dirname, '..', 'file-list.json');
const SCHEDULED_FILE = path.join(__dirname, '..', 'scheduled-news.json');
const PUBLISHED_DIR = path.join(__dirname, '..', 'published');
const SCHEDULED_DIR = path.join(__dirname, '..', 'scheduled');
const PUBLISHED_ASSETS_DIR = path.join(__dirname, '..', 'assets', 'published');
const SCHEDULED_ASSETS_DIR = path.join(__dirname, '..', 'assets', 'scheduled');

// 确保目录存在
[PUBLISHED_DIR, SCHEDULED_DIR, PUBLISHED_ASSETS_DIR, SCHEDULED_ASSETS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`创建目录: ${dir}`);
  }
});

// 读取JSON文件
let publishedData, scheduledData;
try {
  publishedData = JSON.parse(fs.readFileSync(PUBLISHED_FILE, 'utf8'));
  console.log('已读取已发布新闻列表');
} catch (error) {
  console.error(`读取已发布新闻列表失败: ${error.message}`);
  // 如果文件不存在，创建初始结构
  publishedData = {
    categories: {
      category1: "公司新闻",
      category2: "行业动态",
      category3: "技术文章",
      category4: "媒体报道"
    },
    files: []
  };
  console.log('创建新的已发布新闻列表结构');
}

try {
  scheduledData = JSON.parse(fs.readFileSync(SCHEDULED_FILE, 'utf8'));
  console.log('已读取待发布新闻列表');
} catch (error) {
  console.error(`读取待发布新闻列表失败: ${error.message}`);
  process.exit(1);
}

// 获取当前日期 (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];
console.log(`当前日期: ${today}`);

// 记录变更
let hasChanges = false;
const filesToMove = [];
const foldersToMove = [];
const totalPublished = { count: 0 };

// 处理每个分类
scheduledData.files.forEach((scheduledCategory, categoryIndex) => {
  // 查找对应的已发布分类
  const publishedCategoryIndex = publishedData.files.findIndex(
    cat => cat.category === scheduledCategory.category
  );
  
  // 分类不存在则创建
  if (publishedCategoryIndex === -1) {
    publishedData.files.push({
      category: scheduledCategory.category,
      results: []
    });
  }
  
  const currentPublishedCatIndex = publishedCategoryIndex !== -1 ? 
    publishedCategoryIndex : publishedData.files.length - 1;
  
  // 处理新闻条目
  const newsToPublish = [];
  const remainingNews = [];
  
  scheduledCategory.results.forEach(newsItem => {
    // 检查发布日期
    if (newsItem.publishDate && newsItem.publishDate <= today) {
      // 将新闻添加到发布列表
      newsToPublish.push(newsItem);
      totalPublished.count++;
      
      // 收集需要移动的HTML文件
      const htmlFileName = newsItem.slug;
      const sourcePath = path.join(SCHEDULED_DIR, scheduledCategory.category, htmlFileName);
      const targetPath = path.join(PUBLISHED_DIR, scheduledCategory.category, htmlFileName);
      
      if (fs.existsSync(sourcePath)) {
        filesToMove.push({ from: sourcePath, to: targetPath });
      } else {
        console.log(`警告: HTML文件不存在: ${sourcePath}`);
      }
      
      // 收集需要移动的资源文件夹
      const assetBaseName = path.basename(newsItem.slug, path.extname(newsItem.slug));
      const assetSourceDir = path.join(SCHEDULED_ASSETS_DIR, assetBaseName);
      const assetTargetDir = path.join(PUBLISHED_ASSETS_DIR, assetBaseName);
      
      if (fs.existsSync(assetSourceDir)) {
        foldersToMove.push({ from: assetSourceDir, to: assetTargetDir });
      } else {
        console.log(`注意: 资源文件夹不存在: ${assetSourceDir}`);
      }
      
      hasChanges = true;
    } else {
      remainingNews.push(newsItem);
    }
  });
  
  if (newsToPublish.length > 0) {
    console.log(`发布 ${scheduledCategory.category} 分类的 ${newsToPublish.length} 篇新闻`);
    
    // 更新已发布列表
    publishedData.files[currentPublishedCatIndex].results.push(...newsToPublish);
    
    // 更新待发布列表
    scheduledData.files[categoryIndex].results = remainingNews;
  }
});

// 如果有变更，执行文件操作
if (hasChanges) {
  console.log(`====== 处理总计 ${totalPublished.count} 篇新闻 ======`);
  
  // 1. 为已发布新闻排序（最新的在前面）
  publishedData.files.forEach(category => {
    category.results.sort((a, b) => 
      new Date(b.date || b.publishDate) - new Date(a.date || a.publishDate)
    );
  });
  
  // 2. 更新JSON文件
  try {
    fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(publishedData, null, 2), 'utf8');
    console.log(`已更新已发布新闻列表: ${PUBLISHED_FILE}`);
    
    fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(scheduledData, null, 2), 'utf8');
    console.log(`已更新待发布新闻列表: ${SCHEDULED_FILE}`);
  } catch (error) {
    console.error(`更新JSON文件失败: ${error.message}`);
    process.exit(1);
  }
  
  // 3. 移动HTML文件
  console.log(`准备移动 ${filesToMove.length} 个HTML文件`);
  filesToMove.forEach(({ from, to }) => {
    try {
      const targetDir = path.dirname(to);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`创建目录: ${targetDir}`);
      }
      
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
        console.log(`移动HTML: ${from} -> ${to}`);
      } else {
        console.warn(`警告: 源HTML文件不存在: ${from}`);
      }
    } catch (error) {
      console.error(`移动HTML文件失败 ${from} -> ${to}: ${error.message}`);
    }
  });
  
  // 4. 移动资源文件夹
  console.log(`准备移动 ${foldersToMove.length} 个资源文件夹`);
  foldersToMove.forEach(({ from, to }) => {
    try {
      const targetDir = path.dirname(to);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      if (fs.existsSync(from)) {
        // 创建目标文件夹
        if (!fs.existsSync(to)) {
          fs.mkdirSync(to, { recursive: true });
        }
        
        // 复制文件夹内所有文件
        copyFolderRecursive(from, to);
        console.log(`复制资源: ${from} -> ${to}`);
        
        // 删除原文件夹
        fs.rmSync(from, { recursive: true, force: true });
        console.log(`删除原资源文件夹: ${from}`);
      } else {
        console.warn(`警告: 源资源文件夹不存在: ${from}`);
      }
    } catch (error) {
      console.error(`移动资源文件夹失败 ${from} -> ${to}: ${error.message}`);
    }
  });
  
  console.log('====== 新闻发布完成 ======');
} else {
  console.log('今天没有需要发布的新闻。');
}

/**
 * 递归复制文件夹
 * @param {string} source 源文件夹路径
 * @param {string} target 目标文件夹路径
 */
function copyFolderRecursive(source, target) {
  // 读取源文件夹
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  entries.forEach(entry => {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    if (entry.isDirectory()) {
      // 递归复制子文件夹
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      copyFolderRecursive(sourcePath, targetPath);
    } else {
      // 复制文件
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}
