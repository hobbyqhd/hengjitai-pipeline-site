#!/usr/bin/env node

/**
 * CSV转JSON转换脚本 - HY产品数据处理器
 * 
 * 功能说明：
 * 1. 读取各语言的CSV产品数据文件 (scripts/csv/hp_products_*.csv)
 * 2. 转换为标准化的JSON格式产品数据结构
 * 3. 为每种语言生成对应的产品数据JSON文件
 * 
 * 重要架构说明：
 * - 本脚本生成的JSON文件仅包含纯产品数据，不包含任何页面翻译内容
 * - 页面翻译内容完全内嵌在 generate-multilingual-products.js 脚本中
 * - 这样确保了产品数据与页面翻译的清晰分离，便于维护和扩展
 * 
 * 生成的JSON数据结构：
 * - metadata: 元数据信息（产品数量、分类数量、更新时间、语言等）
 * - categories: 产品分类数据（ID、名称、数量、图片等）
 * - products: 产品详细信息（规格、特性、应用、图片等）
 * - groupedProducts: 按分类分组的产品索引
 * 
 * 使用方法：
 * node scripts/0\ csv-to-json-converter.js
 * 
 * 输入文件：scripts/csv/hp_products_*.csv
 * 输出文件：{language}/products.json
 * 
 * 支持语言：cn, en, jp, ru, ar, es, fr, pt, hi, de
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// 语言配置
const LANGUAGES = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];

// 产品类别映射到英文ID
const categoryMapping = {
  // 中文类别到英文ID的映射
  '3PE防腐钢管': '3pe-anti-corrosion-steel-pipes',
  'CDU快速接头涂塑钢管': 'cdu-quick-connect-plastic-coated-steel-pipes',
  '丝扣连接涂塑钢管': 'threaded-connection-plastic-coated-steel-pipes',
  '内外环氧树脂涂塑钢管': 'internal-external-epoxy-coated-steel-pipe',
  '卡箍连接涂塑钢管': 'clamp-connection-plastic-coated-steel-pipes',
  '双金属焊接涂塑钢管': 'bimetal-welded-plastic-coated-steel-pipes',
  '外镀锌内涂塑钢管': 'external-galvanized-internal-plastic-coated-steel-pipes',
  '大口径内EP外PE防腐钢管': 'large-diameter-internal-ep-external-pe-anti-corrosion-steel-pipes',
  '大口径内环氧涂塑钢管': 'large-diameter-internal-epoxy-coated-steel-pipes',
  '大口径涂塑复合钢管': 'large-diameter-composite-plastic-coated-steel-pipes',
  '彩色双抗涂塑钢管': 'colored-double-resistance-plastic-coated-steel-pipes',
  '承插口TPEP防腐钢管': 'socket-tpep-anti-corrosion-steel-pipes',
  '承插口涂塑钢管': 'socket-plastic-coated-steel-pipes',
  '松套法兰连接涂塑钢管': 'loose-flange-connection-plastic-coated-steel-pipes',
  '沟槽连涂塑钢管': 'grooved-connection-plastic-coated-steel-pipes',
  '法兰连接矿用涂塑钢管': 'flange-connection-mining-plastic-coated-steel-pipes',
  '消防涂塑钢管': 'fire-protection-plastic-coated-steel-pipes',
  '燃气涂塑钢管': 'gas-plastic-coated-steel-pipes',
  '给水涂塑钢管': 'water-supply-plastic-coated-steel-pipes'
};

// 应用领域标准化
const applicationMapping = {
  '油气输送': 'oil-gas-transport',
  '给水系统': 'water-supply',
  '排水系统': 'drainage',
  '消防系统': 'fire-protection',
  '市政工程': 'municipal',
  '工业管道': 'industrial'
};

// 连接类型标准化
const connectionMapping = {
  '焊接连接': 'welded',
  '丝扣连接': 'threaded',
  '卡箍连接': 'clamp',
  '法兰连接': 'flange',
  '沟槽连接': 'grooved',
  '承插连接': 'socket'
};

/**
 * 解析产品特性
 */
function parseFeatures(featuresStr) {
  if (!featuresStr) return [];
  return featuresStr.split(';').map(f => f.trim()).filter(f => f);
}

/**
 * 解析应用领域
 */
function parseApplications(applicationsStr) {
  if (!applicationsStr) return [];
  return applicationsStr.split(';').map(app => {
    const trimmed = app.trim();
    return {
      name: trimmed,
      id: applicationMapping[trimmed] || trimmed.toLowerCase().replace(/\s+/g, '-')
    };
  });
}

/**
 * 生成产品图片路径
 */
function generateImagePath(categoryName, productName, chineseCategoryName = null, chineseProductName = null) {
  // 如果提供了中文名称，优先使用中文名称生成路径
  if (chineseCategoryName && chineseProductName) {
    return `/images/hp-products/${chineseCategoryName}/${chineseProductName}.jpg`;
  }
  
  // 检查是否为中文类别（在categoryMapping中存在）
  const categoryId = categoryMapping[categoryName];
  if (categoryId) {
    // 使用中文名称生成路径
    return `/images/hp-products/${categoryName}/${productName}.jpg`;
  } else {
    // 非中文类别，尝试找到对应的中文类别名
    console.warn(`未找到类别映射: ${categoryName}`);
    // 返回一个基于原始名称的路径，但添加警告
    return `/images/hp-products/${categoryName}/${productName}.jpg`;
  }
}

/**
 * 处理单个产品数据
 */
function processProduct(row, index, chineseCategoryName = null, chineseProductName = null) {
  // 处理可能的BOM问题，获取序号
  const serialNumber = row['序号'] || row['﻿序号'] || (index + 1);
  
  const product = {
    id: `product-${String(serialNumber).padStart(3, '0')}`,
    categoryId: categoryMapping[row['产品种类']] || row['产品种类'].toLowerCase().replace(/\s+/g, '-'),
    categoryName: row['产品种类'],
    name: row['产品名称'],
    specification: row['产品规格'],
    applications: parseApplications(row['应用领域']),
    features: parseFeatures(row['产品特性']),
    connectionType: row['连接类型'] ? {
      name: row['连接类型'],
      id: connectionMapping[row['连接类型']] || row['连接类型'].toLowerCase().replace(/\s+/g, '-')
    } : null,
    description: row['产品描述'],
    image: generateImagePath(row['产品种类'], row['产品名称'], chineseCategoryName, chineseProductName),
    slug: `${categoryMapping[row['产品种类']] || 'product'}-${String(serialNumber).padStart(3, '0')}`
  };

  return product;
}

/**
 * 按类别分组产品（只存储产品ID，避免重复数据）
 */
function groupProductsByCategory(products) {
  const grouped = {};
  
  products.forEach(product => {
    const categoryId = product.categoryId;
    if (!grouped[categoryId]) {
      grouped[categoryId] = {
        id: categoryId,
        name: product.categoryName,
        productIds: [],
        count: 0
      };
    }
    grouped[categoryId].productIds.push(product.id);
    grouped[categoryId].count++;
  });

  return grouped;
}

/**
 * 生成产品分类数据
 */
function generateCategories(groupedProducts, products) {
  return Object.values(groupedProducts).map(category => {
    // 找到该分类的第一个产品用作分类图片
    const firstProductId = category.productIds[0];
    const firstProduct = products.find(p => p.id === firstProductId);
    
    return {
      id: category.id,
      name: category.name,
      count: category.count,
      image: firstProduct?.image || '/images/hp-products/default.jpg',
      url: `hp-products/${category.id}.html`
    };
  });
}

/**
 * 读取CSV文件并转换为JSON
 */
async function convertCsvToJson(csvFilePath, outputPath) {
  try {
    console.log(`读取CSV文件: ${csvFilePath}`);
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // 解析CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`解析到 ${records.length} 个产品`);

    // 处理产品数据
    const products = records.map((row, index) => processProduct(row, index));
    
    // 按类别分组
    const groupedProducts = groupProductsByCategory(products);
    
    // 生成分类数据
    const categories = generateCategories(groupedProducts, products);

    // 构建最终的JSON结构（仅包含产品数据，不包含页面翻译）
    const jsonData = {
      metadata: {
        totalProducts: products.length,
        totalCategories: categories.length,
        lastUpdated: new Date().toISOString(),
        language: 'cn',
        languageCode: 'zh-CN'
      },
      categories: categories,
      products: products,
      groupedProducts: groupedProducts
    };

    // 创建输出目录
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入JSON文件
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`JSON文件已生成: ${outputPath}`);

    return jsonData;
  } catch (error) {
    console.error('转换过程中出现错误:', error);
    throw error;
  }
}

/**
 * 创建或加载中文名称映射
 */
async function createOrLoadChineseMapping() {
  const mappingPath = path.join(__dirname, 'chinese-name-mapping.json');
  
  if (fs.existsSync(mappingPath)) {
    console.log('加载现有的中文名称映射...');
    return JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  }
  
  console.log('创建中文名称映射...');
  const csvDir = path.join(__dirname, 'csv');
  const cnCsvPath = path.join(csvDir, 'hp_products_cn.csv');
  
  if (!fs.existsSync(cnCsvPath)) {
    throw new Error('中文CSV文件不存在，无法创建映射');
  }
  
  const mapping = {};
  const cnContent = fs.readFileSync(cnCsvPath, 'utf-8');
  const cnRecords = parse(cnContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  // 为每种语言创建映射
  for (const lang of LANGUAGES) {
    if (lang === 'cn') continue;
    
    const langCsvPath = path.join(csvDir, `hp_products_${lang}.csv`);
    if (!fs.existsSync(langCsvPath)) {
      console.warn(`⚠️  ${lang} CSV文件不存在，跳过映射创建`);
      continue;
    }
    
    const langContent = fs.readFileSync(langCsvPath, 'utf-8');
    const langRecords = parse(langContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    mapping[lang] = {};
    
    // 创建序号到中文名称的映射
    for (let i = 0; i < Math.min(cnRecords.length, langRecords.length); i++) {
      const cnRecord = cnRecords[i];
      const langRecord = langRecords[i];
      
      const cnSerialNumber = cnRecord['序号'] || cnRecord['﻿序号'] || (i + 1);
      const langSerialNumber = langRecord['序号'] || langRecord['﻿序号'] || (i + 1);
      
      if (String(cnSerialNumber) === String(langSerialNumber)) {
        const langCategoryName = langRecord['产品种类'];
        const langProductName = langRecord['产品名称'];
        const cnCategoryName = cnRecord['产品种类'];
        const cnProductName = cnRecord['产品名称'];
        
        const key = `${langCategoryName}|${langProductName}`;
        mapping[lang][key] = {
          chineseCategoryName: cnCategoryName,
          chineseProductName: cnProductName
        };
      }
    }
    
    console.log(`${lang} 语言映射创建完成: ${Object.keys(mapping[lang]).length} 个产品`);
  }
  
  // 保存映射文件
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`映射文件已保存: ${mappingPath}`);
  
  return mapping;
}

/**
 * 为所有语言生成JSON文件（包括中文映射）
 */
async function generateAllLanguageJsonFiles() {
  const csvDir = path.join(__dirname, 'csv');
  
  // 首先创建或加载中文名称映射
  const chineseMapping = await createOrLoadChineseMapping();
  
  console.log('\n开始为所有语言生成产品JSON文件...\n');
  
  for (const lang of LANGUAGES) {
    try {
      console.log(`处理语言: ${lang}`);
      
      const csvFileName = `hp_products_${lang}.csv`;
      const csvFilePath = path.join(csvDir, csvFileName);
      
      if (!fs.existsSync(csvFilePath)) {
        console.log(`⚠️  CSV文件不存在: ${csvFileName}，跳过该语言`);
        continue;
      }
      
      const outputPath = path.join(__dirname, '..', lang, 'products.json');
      
      // 确保输出目录存在
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // 转换数据
      const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`解析到 ${records.length} 个产品`);

      // 处理产品数据（使用中文映射）
      const products = records.map((row, index) => {
        if (lang === 'cn') {
          return processProduct(row, index);
        } else {
          // 非中文语言，使用映射
          const categoryName = row['产品种类'];
          const productName = row['产品名称'];
          const key = `${categoryName}|${productName}`;
          
          let chineseCategoryName = null;
          let chineseProductName = null;
          
          if (chineseMapping[lang] && chineseMapping[lang][key]) {
            chineseCategoryName = chineseMapping[lang][key].chineseCategoryName;
            chineseProductName = chineseMapping[lang][key].chineseProductName;
          }
          
          return processProduct(row, index, chineseCategoryName, chineseProductName);
        }
      });
      
      // 按类别分组
      const groupedProducts = groupProductsByCategory(products);
      
      // 生成分类数据
      const categories = generateCategories(groupedProducts, products);

      // 构建最终的JSON结构（仅包含产品数据，不包含页面翻译）
      const jsonData = {
        metadata: {
          totalProducts: products.length,
          totalCategories: categories.length,
          lastUpdated: new Date().toISOString(),
          language: lang,
          languageCode: getLanguageCode(lang)
        },
        categories: categories,
        products: products,
        groupedProducts: groupedProducts
      };

      // 写入JSON文件
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`✅ ${lang} 语言的JSON文件已生成: ${outputPath}`);
      console.log(`   - 产品数量: ${products.length}`);
      console.log(`   - 分类数量: ${categories.length}\n`);
      
    } catch (error) {
      console.error(`❌ 处理 ${lang} 语言时出错:`, error.message);
    }
  }
}

/**
 * 获取语言代码
 */
function getLanguageCode(lang) {
  const languageCodes = {
    'cn': 'zh-CN',
    'en': 'en-US',
    'jp': 'ja-JP',
    'ru': 'ru-RU',
    'ar': 'ar-SA',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'pt': 'pt-PT',
    'hi': 'hi-IN',
    'de': 'de-DE'
  };
  return languageCodes[lang] || lang;
}

// 主执行函数
async function main() {
  try {
    console.log('🚀 开始完整的CSV到JSON转换流程...\n');
    
    // 检查CSV目录和文件
    const csvDir = path.join(__dirname, 'csv');
    if (!fs.existsSync(csvDir)) {
      throw new Error(`CSV目录不存在: ${csvDir}`);
    }
    
    // 检查中文CSV文件
    const cnCsvPath = path.join(csvDir, 'hp_products_cn.csv');
    if (!fs.existsSync(cnCsvPath)) {
      throw new Error(`中文CSV文件不存在: ${cnCsvPath}`);
    }
    
    console.log('✅ CSV目录和文件检查通过');
    
    // 生成所有语言的JSON文件（包括映射创建）
    await generateAllLanguageJsonFiles();
    
    console.log('\n🎉 所有语言的产品JSON文件生成完成！');
    
    // 显示结果汇总
    console.log('\n=== 生成结果汇总 ===');
    let successCount = 0;
    let failCount = 0;
    
    for (const lang of LANGUAGES) {
      const jsonPath = path.join(__dirname, '..', lang, 'products.json');
      if (fs.existsSync(jsonPath)) {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        console.log(`✅ ${lang}: ${jsonData.metadata.totalProducts} 产品, ${jsonData.metadata.totalCategories} 分类`);
        successCount++;
      } else {
        console.log(`❌ ${lang}: 文件未生成`);
        failCount++;
      }
    }
    
    console.log(`\n总处理语言数: ${LANGUAGES.length}`);
    console.log(`成功生成: ${successCount}`);
    console.log(`失败: ${failCount}`);
    
  } catch (error) {
    console.error('❌ 转换失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  convertCsvToJson,
  generateAllLanguageJsonFiles,
  processProduct,
  groupProductsByCategory,
  generateCategories,
  parseFeatures,
  parseApplications,
  generateImagePath
};
