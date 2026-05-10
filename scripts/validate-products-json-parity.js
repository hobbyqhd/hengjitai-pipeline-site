#!/usr/bin/env node

/**
 * 校验各语言 products.json 与基准语言（cn）在分类与产品维度是否一致：
 * - 产品条数、id 顺序、slug 顺序
 * - 分类条数、category id 顺序、各类 count
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
const BASE = 'cn';

function loadJson(root, lang) {
  const filePath = path.join(root, lang, 'products.json');
  if (!fs.existsSync(filePath)) return { missing: true, filePath, data: null };
  return { missing: false, filePath, data: JSON.parse(fs.readFileSync(filePath, 'utf8')) };
}

function run() {
  const rootDir = path.join(__dirname, '..');
  const base = loadJson(rootDir, BASE);
  if (base.missing) {
    console.error(`❌ 基准语言缺少文件: ${base.filePath}`);
    process.exit(1);
  }

  const refProducts = base.data.products || [];
  const refCats = base.data.categories || [];
  const refProductIds = refProducts.map(p => p.id);
  const refSlugs = refProducts.map(p => p.slug);
  const refCatIds = refCats.map(c => c.id);
  const refCatCounts = refCats.map(c => c.count);

  let hasError = false;
  console.log('=== Products JSON Parity Report (base: cn) ===\n');

  for (const lang of LANGUAGES) {
    if (lang === BASE) continue;
    const cur = loadJson(rootDir, lang);
    if (cur.missing) {
      hasError = true;
      console.log(`❌ ${lang}: 缺少 ${cur.filePath}`);
      continue;
    }

    const products = cur.data.products || [];
    const cats = cur.data.categories || [];

    if (products.length !== refProducts.length) {
      hasError = true;
      console.log(`❌ ${lang}: 产品数量 ${products.length} ≠ 基准 ${refProducts.length}`);
    }

    if (cats.length !== refCats.length) {
      hasError = true;
      console.log(`❌ ${lang}: 分类数量 ${cats.length} ≠ 基准 ${refCats.length}`);
    }

    const ids = products.map(p => p.id);
    const slugs = products.map(p => p.slug);
    if (ids.join('\0') !== refProductIds.join('\0')) {
      hasError = true;
      const i = ids.findIndex((v, idx) => v !== refProductIds[idx]);
      console.log(`❌ ${lang}: products[].id 顺序或内容与基准不一致（首个差异索引 ${i}）`);
    }
    if (slugs.join('\0') !== refSlugs.join('\0')) {
      hasError = true;
      const i = slugs.findIndex((v, idx) => v !== refSlugs[idx]);
      console.log(`❌ ${lang}: products[].slug 与基准不一致（首个差异索引 ${i}）`);
    }

    const catIds = cats.map(c => c.id);
    const catCounts = cats.map(c => c.count);
    if (catIds.join('\0') !== refCatIds.join('\0')) {
      hasError = true;
      console.log(`❌ ${lang}: categories[].id 顺序与基准不一致`);
    }
    if (catCounts.join(',') !== refCatCounts.join(',')) {
      hasError = true;
      console.log(`❌ ${lang}: categories[].count 与基准不一致`);
    }

    if (
      products.length === refProducts.length &&
      cats.length === refCats.length &&
      ids.join('\0') === refProductIds.join('\0') &&
      slugs.join('\0') === refSlugs.join('\0') &&
      catIds.join('\0') === refCatIds.join('\0') &&
      catCounts.join(',') === refCatCounts.join(',')
    ) {
      console.log(`✅ ${lang}: 与基准一致（${products.length} 产品, ${cats.length} 分类）`);
    }
  }

  console.log(`\n✅ ${BASE}: 基准 ${refProducts.length} 产品, ${refCats.length} 分类`);

  if (hasError) {
    console.error('\n产品 JSON 多语言一致性校验失败。');
    process.exit(1);
  }
  console.log('\n产品 JSON 多语言一致性校验通过。');
}

run();
