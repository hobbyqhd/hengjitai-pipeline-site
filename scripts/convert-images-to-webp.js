#!/usr/bin/env node
/**
 * 批量为 images/ 下的栅格图（jpg/jpeg/png）生成 .webp 副本（C1）。
 * 默认只处理 >= MIN_KB 的大图（节省 CI 时间），可用 --all 处理全部。
 *
 * 不删除原图（保留 fallback）；HTML 端可后续用 <picture> 切换。
 *
 * 用法：
 *   node scripts/convert-images-to-webp.js              # 仅处理 ≥150KB 的图
 *   node scripts/convert-images-to-webp.js --all        # 全部
 *   node scripts/convert-images-to-webp.js --quality=78 # 自定义质量
 *   node scripts/convert-images-to-webp.js --min=300    # 自定义阈值 KB
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.error('需要 sharp：npm install sharp --save-dev');
    process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const IMAGE_DIRS = ['images'];
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png']);

const args = process.argv.slice(2);
const PROCESS_ALL = args.includes('--all');
const QUALITY = parseInt((args.find((a) => a.startsWith('--quality=')) || '').split('=')[1] || '78', 10);
const MIN_KB = parseInt((args.find((a) => a.startsWith('--min=')) || '').split('=')[1] || '150', 10);

function walk(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, results);
        else if (e.isFile() && SUPPORTED.has(path.extname(e.name).toLowerCase())) results.push(full);
    }
    return results;
}

async function convertOne(src) {
    const dst = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    if (fs.existsSync(dst)) {
        const srcMtime = fs.statSync(src).mtimeMs;
        const dstMtime = fs.statSync(dst).mtimeMs;
        if (dstMtime >= srcMtime) return { src, dst, status: 'skip-cached' };
    }
    const stat = fs.statSync(src);
    if (!PROCESS_ALL && stat.size < MIN_KB * 1024) return { src, dst, status: 'skip-small' };

    try {
        await sharp(src).webp({ quality: QUALITY, effort: 4 }).toFile(dst);
        const out = fs.statSync(dst).size;
        const ratio = ((1 - out / stat.size) * 100).toFixed(1);
        return { src, dst, status: 'ok', srcKb: Math.round(stat.size / 1024), dstKb: Math.round(out / 1024), ratio };
    } catch (err) {
        return { src, dst, status: 'error', error: err.message };
    }
}

async function main() {
    const files = IMAGE_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
    let ok = 0, skipSmall = 0, skipCached = 0, errors = 0;
    let savedKb = 0;
    let processedKb = 0;

    for (const file of files) {
        const r = await convertOne(file);
        if (r.status === 'ok') {
            ok++;
            savedKb += r.srcKb - r.dstKb;
            processedKb += r.srcKb;
            console.log(`  [OK] ${path.relative(ROOT, file)}: ${r.srcKb}KB -> ${r.dstKb}KB (-${r.ratio}%)`);
        } else if (r.status === 'skip-small') skipSmall++;
        else if (r.status === 'skip-cached') skipCached++;
        else if (r.status === 'error') { errors++; console.error(`  [ERR] ${file}: ${r.error}`); }
    }

    console.log(`\n总计 ${files.length} 张图：转换 ${ok}，跳过(已存在新版) ${skipCached}，跳过(过小) ${skipSmall}，失败 ${errors}`);
    console.log(`输入合计 ${processedKb}KB，输出合计 ${processedKb - savedKb}KB，节省 ${savedKb}KB（${processedKb ? ((savedKb / processedKb) * 100).toFixed(1) : 0}%）。`);
}

main();
