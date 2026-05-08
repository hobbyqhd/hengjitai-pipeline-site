/**
 * 修复所有产品页面中 application-name 元数据标签的内容
 * 将英文名称替换为相应语言的公司名称
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const pageComponents = require('./shared/page-components');

// 使用 Promise 版本的文件操作
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// 设置基础目录
const BASE_DIR = path.join(__dirname, '..');

// 导入语言列表
const LANGUAGES = pageComponents.LANGUAGES;

/**
 * 递归获取目录中的所有HTML文件
 */
async function getAllHtmlFilesInDir(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // 递归处理子目录
      const subDirFiles = await getAllHtmlFilesInDir(fullPath);
      files.push(...subDirFiles);
    } else if (entry.name.endsWith('.html')) {
      // 添加HTML文件
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * 修复单个HTML文件中的 application-name 内容
 */
async function fixApplicationNameInFile(filePath, lang) {
  try {
    // 获取语言配置
    const langConfig = pageComponents.getLanguageConfig(lang);
    const companyFullName = langConfig.companyFullName;
    
    // 读取文件内容
    let content = await readFile(filePath, 'utf8');
    
    // 匹配 application-name 标签
    const appNameRegex = /<meta name="application-name" content="([^"]*)"/;
    
    // 检查文件内容是否包含 application-name 标签
    if (appNameRegex.test(content)) {
      // 替换 application-name 的内容
      content = content.replace(
        appNameRegex,
        `<meta name="application-name" content="${companyFullName}"`
      );
      
      // 写入修改后的内容
      await writeFile(filePath, content, 'utf8');
      console.log(`✓ 已修复: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ 文件中未找到 application-name 标签: ${filePath}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ 处理文件时出错: ${filePath}`, err);
    return false;
  }
}

/**
 * 主函数：修复所有语言版本页面的 application-name 内容
 */
async function fixAllApplicationNames() {
  try {
    let totalFixed = 0;
    let totalFiles = 0;
    
    for (const lang of LANGUAGES) {
      console.log(`\n处理 ${lang} 语言的文件...`);
      
      // 获取该语言目录下的所有HTML文件
      const langDir = path.join(BASE_DIR, lang);
      const htmlFiles = await getAllHtmlFilesInDir(langDir);
      
      // 修复每个文件
      for (const file of htmlFiles) {
        totalFiles++;
        const fixed = await fixApplicationNameInFile(file, lang);
        if (fixed) totalFixed++;
      }
      
      console.log(`已完成 ${lang} 语言的处理。`);
    }
    
    console.log(`\n总计: 处理了 ${totalFiles} 个文件，修复了 ${totalFixed} 个文件的 application-name 内容。`);
  } catch (err) {
    console.error('发生错误:', err);
  }
}

// 执行主函数
fixAllApplicationNames();
