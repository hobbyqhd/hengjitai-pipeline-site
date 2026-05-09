#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const macroConfig = require('./config/macro-category-mapping.json');

const LANGUAGES = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const ALLOWED = new Set(macroConfig.macroCategories || []);

function validateLanguage(rootDir, lang) {
  const filePath = path.join(rootDir, lang, 'products.json');
  if (!fs.existsSync(filePath)) {
    return {
      lang,
      filePath,
      total: 0,
      missingFile: true,
      invalidProducts: []
    };
  }

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const products = json.products || [];
  const invalidProducts = [];
  const perMacro = {};

  for (const macro of ALLOWED) perMacro[macro] = 0;

  for (const product of products) {
    const macros = Array.isArray(product.macroCategories) ? product.macroCategories : [];
    const hasAtLeastOne = macros.length > 0;
    const invalidMacros = macros.filter(m => !ALLOWED.has(m));

    if (!hasAtLeastOne || invalidMacros.length > 0) {
      invalidProducts.push({
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        macroCategories: macros,
        invalidMacros
      });
      continue;
    }

    macros.forEach(macro => {
      perMacro[macro] += 1;
    });
  }

  return {
    lang,
    filePath,
    total: products.length,
    missingFile: false,
    invalidProducts,
    perMacro
  };
}

function run() {
  const rootDir = path.join(__dirname, '..');
  const reports = LANGUAGES.map(lang => validateLanguage(rootDir, lang));

  let hasError = false;
  console.log('=== Macro Category Validation Report ===');

  for (const report of reports) {
    if (report.missingFile) {
      hasError = true;
      console.log(`❌ ${report.lang}: 缺少 products.json (${report.filePath})`);
      continue;
    }

    const invalidCount = report.invalidProducts.length;
    const coverage = report.total === 0 ? '0.00' : (((report.total - invalidCount) / report.total) * 100).toFixed(2);
    const status = invalidCount === 0 ? '✅' : '❌';
    console.log(`${status} ${report.lang}: total=${report.total}, valid=${report.total - invalidCount}, coverage=${coverage}%`);
    console.log(`   perMacro: ${JSON.stringify(report.perMacro)}`);

    if (invalidCount > 0) {
      hasError = true;
      report.invalidProducts.slice(0, 5).forEach(item => {
        console.log(
          `   - id=${item.id}, categoryId=${item.categoryId}, macros=${JSON.stringify(item.macroCategories)}, invalid=${JSON.stringify(item.invalidMacros)}`
        );
      });
    }
  }

  if (hasError) {
    console.error('\n宏分类校验失败：存在未归类或非法宏分类产品。');
    process.exit(1);
  }

  console.log('\n宏分类校验通过：所有产品至少归属一个合法宏分类。');
}

run();
