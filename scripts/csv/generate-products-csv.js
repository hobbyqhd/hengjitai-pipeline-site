const path = require('path');
const { readdir, stat, writeFile, mkdir } = require('fs').promises; // Added mkdir

// --- 配置 ---
const PRODUCTS_DIR = path.join(__dirname, '..', '..', 'images', 'hp-products');
// 更新输出文件路径
const OUTPUT_DIR = path.join(__dirname, 'csv');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'hp_products_cn.csv');
const HEADER = "序号,产品种类,产品名称,产品规格,应用领域,产品特性,连接类型,产品描述"; // Added "序号" to header
const IMAGE_EXTENSIONS_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i;

// --- 从 generate-products-json.js 移植过来的内容 ---

const systemTranslations = {
  applications: {
    'cn': { '给水系统': '给水系统', '消防系统': '消防系统', '燃气系统': '燃气系统', '采暖系统': '采暖系统', '矿用系统': '矿用系统', '排水系统': '排水系统', '油气输送': '油气输送', '供暖系统': '供暖系统' }
  },
  features: {
    'cn': { '耐高温': '耐高温', '防腐蚀': '防腐蚀', '抗 UV': '抗 UV', '绝缘': '绝缘', '导电': '导电', '防水': '防水', '防火': '防火' }
  },
  connectionTypes: {
    'cn': { '丝扣连接': '丝扣连接', '法兰连接': '法兰连接', '承插连接': '承插连接', '卡箍连接': '卡箍连接', '焊接连接': '焊接连接', '沟槽连接': '沟槽连接' }
  }
};

/**
 * 从产品名称中提取规格信息等
 */
function extractProductInfo(productName, categoryName) {
  let diameter = null;

  const diameterDefinitions = [
    {
        regex: /\((?:DN)?(\d+)[×x](\d+)(?:(米|m))?\)/i,
        handler: (match) => {
            const diameterValue = match[0].toLowerCase().startsWith('(dn') ? `DN${match[1]}` : match[1];
            return {
                type: 'full',
                diameter: diameterValue,
                length: match[2],
                unit: (match[3] === '米' ? 'm' : match[3] ? match[3].toLowerCase() : 'm')
            };
        }
    },
    {
        regex: /(\d+)[×x](\d+)(?:(米|m))?/i,
        handler: (match) => ({ type: 'full', diameter: match[1], length: match[2], unit: (match[3] === '米' ? 'm' : match[3] ? match[3].toLowerCase() : 'm') })
    },
    {
        regex: /^(\d+)\((\d*\.?\d+)?\)/,
        handler: (match) => ({ type: 'diameter_thickness', diameter: match[1], thickness: match[2], unit: 'mm' })
    },
    {
        regex: /DN(\d+)/i,
        handler: (match) => ({ type: 'diameter_only', diameter: `DN${match[1]}`, unit: '' })
    },
    {
        regex: /(\d+)(mm|英寸)/i,
        handler: (match) => ({ type: 'diameter_only', diameter: match[1], unit: match[2] })
    },
    {
        regex: /^(\d+)(?=\s|$)/i,
        handler: (match) => ({ type: 'diameter_only', diameter: match[1], unit: 'mm' })
    }
  ];

  for (const def of diameterDefinitions) {
    const match = productName.match(def.regex);
    if (match) {
      diameter = def.handler(match);
      break;
    }
  }

  const applications = [];
  if (systemTranslations.applications && systemTranslations.applications.cn) {
    for (const appKey in systemTranslations.applications.cn) {
      if (productName.includes(appKey) || categoryName.includes(appKey)) {
        applications.push(appKey);
      }
    }
  }
  if ((productName.includes('给水') || productName.includes('饮用水') || categoryName.includes('给水')) && !applications.includes('给水系统')) applications.push('给水系统');
  if ((productName.includes('消防') || categoryName.includes('消防')) && !applications.includes('消防系统')) applications.push('消防系统');
  if ((productName.includes('燃气') || categoryName.includes('燃气')) && !applications.includes('燃气系统')) applications.push('燃气系统');
  if (productName.includes('排水') && !applications.includes('排水系统')) applications.push('排水系统');
  if ((productName.includes('矿用') || categoryName.includes('矿用')) && !applications.includes('矿用系统')) applications.push('矿用系统');
  if ((productName.includes('石油') || productName.includes('油气')) && !applications.includes('油气输送')) applications.push('油气输送');
  if ((productName.includes('供暖') || productName.includes('供热') || categoryName.includes('采暖')) && !applications.includes('供暖系统')) applications.push('供暖系统');
  if ((productName.includes('采暖') || categoryName.includes('采暖')) && !applications.includes('采暖系统')) applications.push('采暖系统');
  if (categoryName.includes('3PE') || productName.includes('3PE')) {
    if (!applications.includes('油气输送')) {
      applications.push('油气输送');
    }
  }

  const features = [];
  if (systemTranslations.features && systemTranslations.features.cn) {
    for (const featKey in systemTranslations.features.cn) {
      const regex = new RegExp(`(?<![a-zA-Z0-9])${featKey}(?![a-zA-Z0-9])`, 'i');
      if (regex.test(productName) || regex.test(categoryName)) {
         features.push(featKey);
      }
    }
  }
  if ((categoryName.includes('3PE') || productName.includes('3PE')) && !features.includes('三层PE防腐')) features.push('三层PE防腐');
  if ((categoryName.includes('TPEP') || productName.includes('TPEP')) && !features.includes('TPEP防腐')) features.push('TPEP防腐');
  if ((categoryName.includes('双抗') || productName.includes('双抗')) && !features.includes('双层抗腐蚀')) features.push('双层抗腐蚀');
  if ((categoryName.includes('环氧') || productName.includes('环氧')) && !features.includes('环氧树脂涂层')) features.push('环氧树脂涂层');
  if ((productName.includes('内外涂') || categoryName.includes('内外')) && !features.includes('内外均涂层')) features.push('内外均涂层');
  if ((productName.includes('镀锌') || categoryName.includes('镀锌')) && !features.includes('热浸镀锌')) features.push('热浸镀锌');
  if ((productName.includes('双金属') || categoryName.includes('双金属')) && !features.includes('双金属')) features.push('双金属');
  if ((productName.includes('大口径') || categoryName.includes('大口径')) && !features.includes('大口径')) features.push('大口径');

  const connectionTypes = [];
  if (systemTranslations.connectionTypes && systemTranslations.connectionTypes.cn) {
    for (const connKey in systemTranslations.connectionTypes.cn) {
      if (productName.includes(connKey) || categoryName.includes(connKey)) {
        connectionTypes.push(connKey);
      }
    }
  }
  if ((categoryName.includes('丝扣') || productName.includes('丝扣')) && !connectionTypes.includes('丝扣连接')) connectionTypes.push('丝扣连接');
  if ((categoryName.includes('法兰') || productName.includes('法兰')) && !connectionTypes.includes('法兰连接')) connectionTypes.push('法兰连接');
  if ((categoryName.includes('承插') || productName.includes('承插')) && !connectionTypes.includes('承插连接')) connectionTypes.push('承插连接');
  if ((categoryName.includes('卡箍') || productName.includes('卡箍')) && !connectionTypes.includes('卡箍连接')) connectionTypes.push('卡箍连接');
  if ((categoryName.includes('焊接') || productName.includes('焊接')) && !connectionTypes.includes('焊接连接')) connectionTypes.push('焊接连接');
  if ((categoryName.includes('沟槽') || productName.includes('沟槽')) && !connectionTypes.includes('沟槽连接')) connectionTypes.push('沟槽连接');

  return {
    specs: diameter,
    applications: [...new Set(applications)],
    features: [...new Set(features)],
    connectionTypes: [...new Set(connectionTypes)]
  };
}

/**
 * 生成标准化的产品中文描述
 */
function generateProductDescription(productName, categoryName, productInfo) {
  let description = `产品“${productName}”，分类“${categoryName}”。`;

  if (productInfo.applications && productInfo.applications.length > 0) {
    description += `主要应用领域包括：${productInfo.applications.join('、')}。`;
  }
  if (productInfo.features && productInfo.features.length > 0) {
    description += `主要特性有：${productInfo.features.join('、')}。`;
  }
  if (productInfo.connectionTypes && productInfo.connectionTypes.length > 0) {
    description += `支持的连接方式有：${productInfo.connectionTypes.join('、')}。`;
  }
  if (productInfo.specs) {
    let specString = '规格：';
    const specDiameter = productInfo.specs.diameter;
    const specUnit = productInfo.specs.unit; // unit for length in 'full' type, or for diameter in 'diameter_only'

    if (productInfo.specs.type === 'full') {
      if (specDiameter && typeof specDiameter === 'string' && specDiameter.toLowerCase().startsWith('dn')) {
        specString += `${specDiameter} × ${productInfo.specs.length}${specUnit || 'm'}`;
      } else if (specDiameter) {
        specString += `${specDiameter}mm × ${productInfo.specs.length}${specUnit || 'm'}`;
      }
    } else if (productInfo.specs.type === 'diameter_only') {
      if (specDiameter && typeof specDiameter === 'string' && specDiameter.toLowerCase().startsWith('dn')) {
        specString += specDiameter;
      } else if (specDiameter) {
        specString += `${specDiameter}${specUnit || 'mm'}`;
      }
    } else if (productInfo.specs.type === 'diameter_thickness') {
        specString += `${specDiameter}${specUnit || 'mm'} (${productInfo.specs.thickness}${specUnit || 'mm'})`;
    } else if (productInfo.specs.type === 'other') {
      specString += productInfo.specs.value;
    }
    description += `${specString}。`;
  }
  return description.trim();
}

// --- 辅助函数 (CSV specific) ---

/**
 * 格式化从 extractProductInfo 获取的规格信息
 * @param {object} specs - 从 extractProductInfo 返回的 specs 对象
 * @returns {string} - 格式化后的规格字符串
 */
function formatSpecs(specs) {
  if (!specs) return '';
  const specDiameter = specs.diameter;
  // For 'full' type, specs.unit is length unit. For 'diameter_only', it's diameter unit (or '' if DN).
  const specUnit = specs.unit; 

  switch (specs.type) {
    case 'full':
      let diameterDisplayFull;
      if (specDiameter && typeof specDiameter === 'string' && specDiameter.toLowerCase().startsWith('dn')) {
        diameterDisplayFull = specDiameter; // e.g. DN50
      } else if (specDiameter) {
        diameterDisplayFull = `${specDiameter}mm`; // e.g. 50mm
      } else {
        diameterDisplayFull = '';
      }
      const lengthStrFull = specs.length ? `${specs.length}${specUnit || 'm'}` : ''; // specUnit is length unit here
      return `${diameterDisplayFull}${diameterDisplayFull && lengthStrFull ? ' × ' : ''}${lengthStrFull}`;

    case 'diameter_only':
      if (specDiameter && typeof specDiameter === 'string' && specDiameter.toLowerCase().startsWith('dn')) {
        return specDiameter; // e.g., "DN50" (unit is already incorporated or not needed)
      } else if (specDiameter) {
        return `${specDiameter}${specUnit || 'mm'}`; // e.g., "50mm" or "2英寸"
      }
      return '';

    case 'diameter_thickness':
      const diameterStrDt = specDiameter ? `${specDiameter}mm` : ''; // Assuming diameter is numeric and needs mm
      const thicknessStrDt = specs.thickness ? `${specs.thickness}mm` : ''; // Assuming thickness needs mm
      return `${diameterStrDt}${thicknessStrDt ? ` (${thicknessStrDt})` : ''}`;

    case 'other':
      return specs.value || '';
    default:
      return '';
  }
}

/**
 * 将值转换为适合 CSV 的字符串，处理可能存在的逗号和引号
 * (简单实现：如果包含逗号或引号，则用双引号包裹，并将内部双引号转义为两个双引号)
 * @param {any} value
 * @returns {string}
 */
function escapeCsvValue(value) {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}


// --- 主逻辑 ---
async function main() {
  console.log(`正在从 ${PRODUCTS_DIR} 提取产品信息...`);

  try {
    // 检查基础目录是否存在
    await stat(PRODUCTS_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`错误：产品图片目录 '${PRODUCTS_DIR}' 不存在。`);
      process.exit(1);
    }
    console.error(`访问目录 '${PRODUCTS_DIR}' 时出错:`, err);
    process.exit(1);
  }

  // 确保输出目录存在
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (err) {
    console.error(`创建输出目录 '${OUTPUT_DIR}' 时出错:`, err);
    process.exit(1);
  }

  const csvRows = [];
  let dataFound = false;
  let serialNumber = 1; // Initialize serial number

  try {
    const categoryDirs = await readdir(PRODUCTS_DIR);

    for (const categoryDir of categoryDirs) {
      const categoryPath = path.join(PRODUCTS_DIR, categoryDir);
      const categoryStats = await stat(categoryPath);

      if (categoryDir.startsWith('.') || !categoryStats.isDirectory()) {
        continue;
      }

      const categoryName = categoryDir;
      const productFiles = await readdir(categoryPath);

      for (const file of productFiles) {
        if (file.match(IMAGE_EXTENSIONS_REGEX)) {
          const productNameWithExt = file;
          const productName = path.basename(productNameWithExt, path.extname(productNameWithExt));

          const productInfo = extractProductInfo(productName, categoryName);
          // const description = generateProductDescription(productName, categoryName, productInfo);

          const description = "";

          // 调整列的顺序，将产品描述放在最后，并添加序号
          const row = [
            escapeCsvValue(serialNumber++), // Add serial number and increment
            escapeCsvValue(categoryName),
            escapeCsvValue(productName),
            escapeCsvValue(formatSpecs(productInfo.specs)),
            escapeCsvValue(productInfo.applications.join(';')),
            escapeCsvValue(productInfo.features.join(';')),
            escapeCsvValue(productInfo.connectionTypes.join(';')),
            escapeCsvValue(description) // 产品描述现在是最后一项
          ];
          csvRows.push(row.join(','));
          dataFound = true;
        }
      }
    }

    if (!dataFound) {
      console.log(`提示：在 '${PRODUCTS_DIR}' 目录中没有找到任何产品图片文件。`);
      // Even if no data, create the file with BOM and header
    }

    // 写入 UTF-8 BOM 和表头，然后写入数据行
    const csvContent = '\uFEFF' + HEADER + '\n' + csvRows.join('\n') + '\n'; // Replaced '﻿' with explicit BOM
    await writeFile(OUTPUT_FILE, csvContent, 'utf8');

    console.log(`产品数据已成功提取并保存到 '${OUTPUT_FILE}'。`);
    if (dataFound) {
        console.log(`共处理了 ${csvRows.length} 个产品。`);
    }

  } catch (err) {
    console.error('生成 CSV 文件时出错:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
    generateCsv: main
};
