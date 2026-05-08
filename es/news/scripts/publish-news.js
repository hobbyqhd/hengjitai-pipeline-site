/**
 * 新闻自动发布脚本
 * 
 * 功能：
 * - 检查待发布新闻列表中是否有应该在今天发布的新闻
 * - 将到期发布的新闻从待发布列表移动到已发布列表
 * - 移动相关的HTML文件和资源文件
 * - 自动更新站点地图
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置文件路径
const PUBLISHED_FILE = path.join(__dirname, '..', 'file-list.json');
const SCHEDULED_FILE = path.join(__dirname, '..', 'scheduled-news.json');
const PUBLISHED_DIR = path.join(__dirname, '..', 'published');
const SCHEDULED_DIR = path.join(__dirname, '..', 'scheduled');
const PUBLISHED_ASSETS_DIR = path.join(__dirname, '..', 'assets', 'published');
const SCHEDULED_ASSETS_DIR = path.join(__dirname, '..', 'assets', 'scheduled');

// 获取当前语言
const CURRENT_LANG = path.basename(path.dirname(path.dirname(__dirname)));

// sitemap生成器路径
const SITEMAP_GENERATOR = path.join(__dirname, '..', '..', '..', 'scripts', 'generate-sitemap.js');

// 确保目录结构存在
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
  console.log('无待发布新闻，退出程序');
  process.exit(0);
}

// 获取当前日期 (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];
console.log(`当前日期: ${today}`);

// 跟踪变更
let hasChanges = false;
const filesToMove = [];
const foldersToMove = [];
const publishedCount = { total: 0 };

// 处理每个分类
scheduledData.files.forEach((scheduledCategory, categoryIndex) => {
  const categoryKey = scheduledCategory.category;
  console.log(`处理分类: ${categoryKey}`);
  
  // 查找对应的已发布分类
  const publishedCategoryIndex = publishedData.files.findIndex(
    cat => cat.category === categoryKey
  );
  
  // 如果分类不存在，创建它
  if (publishedCategoryIndex === -1) {
    publishedData.files.push({
      category: categoryKey,
      results: []
    });
    console.log(`创建新分类: ${categoryKey}`);
  }
  
  const publishedCatIndex = publishedCategoryIndex !== -1 ? 
    publishedCategoryIndex : publishedData.files.length - 1;
  
  // 处理新闻条目
  const newsToPublish = [];
  const remainingNews = [];
  
  scheduledCategory.results.forEach(newsItem => {
    // 检查发布日期
    if (newsItem.publishDate && newsItem.publishDate <= today) {
      console.log(`发布新闻: ${newsItem.title} (${newsItem.slug})`);
      
      // 添加到发布列表
      newsToPublish.push(newsItem);
      publishedCount.total++;
      
      // 添加HTML文件移动任务
      const htmlFileName = newsItem.slug;
      const categoryFolder = categoryKey;
      const sourcePath = path.join(SCHEDULED_DIR, categoryFolder, htmlFileName);
      const targetPath = path.join(PUBLISHED_DIR, categoryFolder, htmlFileName);
      
      if (fs.existsSync(sourcePath)) {
        filesToMove.push({ from: sourcePath, to: targetPath });
      } else {
        console.log(`警告: HTML文件不存在: ${sourcePath}`);
      }
      
      // 添加资源文件夹移动任务
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
      // 保留在待发布列表
      remainingNews.push(newsItem);
    }
  });
  
  if (newsToPublish.length > 0) {
    console.log(`分类 ${categoryKey} 有 ${newsToPublish.length} 篇新闻要发布`);
    
    // 更新已发布列表
    publishedData.files[publishedCatIndex].results.push(...newsToPublish);
    
    // 更新待发布列表
    scheduledData.files[categoryIndex].results = remainingNews;
  }
});

// 执行文件操作
if (hasChanges) {
  console.log(`====== 准备发布 ${publishedCount.total} 篇新闻 ======`);
  
  // 1. 排序已发布的新闻（按日期降序）
  publishedData.files.forEach(category => {
    category.results.sort((a, b) => 
      new Date(b.date || b.publishDate) - new Date(a.date || a.publishDate)
    );
  });
  
  // 2. 保存JSON文件
  try {
    fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(publishedData, null, 2), 'utf8');
    console.log(`已更新已发布新闻列表: ${PUBLISHED_FILE}`);
    
    fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(scheduledData, null, 2), 'utf8');
    console.log(`已更新待发布新闻列表: ${SCHEDULED_FILE}`);
  } catch (error) {
    console.error(`保存JSON文件失败: ${error.message}`);
    process.exit(1);
  }
  
  // 3. 移动HTML文件
  if (filesToMove.length > 0) {
    console.log(`移动 ${filesToMove.length} 个HTML文件`);
    
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
          console.warn(`警告: 源文件不存在: ${from}`);
        }
      } catch (error) {
        console.error(`移动文件失败 ${from} -> ${to}: ${error.message}`);
      }
    });
  }
  
  // 4. 移动资源文件夹
  if (foldersToMove.length > 0) {
    console.log(`移动 ${foldersToMove.length} 个资源文件夹`);
    
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
          
          // 复制文件夹内容
          copyFolderRecursive(from, to);
          console.log(`复制资源: ${from} -> ${to}`);
          
          // 删除源文件夹
          fs.rmSync(from, { recursive: true, force: true });
          console.log(`删除源文件夹: ${from}`);
        } else {
          console.warn(`警告: 源文件夹不存在: ${from}`);
        }
      } catch (error) {
        console.error(`移动文件夹失败 ${from} -> ${to}: ${error.message}`);
      }
    });
  }
  
  console.log('====== 新闻发布完成 ======');
} else {
  console.log('今天没有需要发布的新闻');
}

// 在发布完成后生成sitemap
if (hasChanges) {
  console.log('====== 更新站点地图 ======');
  try {
    execSync(`node "${SITEMAP_GENERATOR}"`, { stdio: 'inherit' });
    console.log('站点地图更新成功');
  } catch (error) {
    console.error('站点地图更新失败:', error.message);
  }
}

/**
 * 递归复制文件夹内容
 * @param {string} source 源文件夹路径
 * @param {string} target 目标文件夹路径
 */
function copyFolderRecursive(source, target) {
  // 确保目标文件夹存在
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  // 读取源文件夹内容
  const items = fs.readdirSync(source, { withFileTypes: true });
  
  // 复制每个项目
  items.forEach(item => {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);
    
    if (item.isDirectory()) {
      // 递归复制子文件夹
      copyFolderRecursive(sourcePath, targetPath);
    } else {
      // 复制文件
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}
