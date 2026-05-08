#!/usr/bin/env node
/**
 * IndexNow 协议 ping（G2）。
 *
 * IndexNow 让 Bing/Yandex/Naver/Seznam 等搜索引擎在 sitemap 更新后立即重新抓取，
 * 比传统 sitemap ping 更快。Google 暂未官方支持，但 Bing/Yandex 是主流非英语市场关键。
 *
 * 准备：
 *   1. 在站点根目录放置 <key>.txt，内容就是 <key>（鉴权）。
 *   2. 设置环境变量 INDEXNOW_KEY 或在脚本内 hardcode。
 *
 * 用法：
 *   INDEXNOW_KEY=<your-32-char-key> node scripts/indexnow-ping.js [--limit=100]
 *
 * 行为：
 *   - 读取 sitemap-*.xml 收集所有 <loc> URL
 *   - 默认提交全部，可用 --limit=N 截断
 *   - 一次最多 10000 URL（IndexNow 限制）
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const HOST = 'hengjitaipipeline.com';
const KEY = process.env.INDEXNOW_KEY || '';

if (!KEY) {
    console.error('未设置 INDEXNOW_KEY。请前往 https://www.bing.com/indexnow 申请并设置。');
    process.exit(1);
}

const args = process.argv.slice(2);
const LIMIT = parseInt((args.find((a) => a.startsWith('--limit=')) || '').split('=')[1] || '10000', 10);

function collectUrls() {
    const sitemaps = fs.readdirSync(ROOT).filter((f) => /^sitemap-[a-z]+\.xml$/.test(f));
    const urls = new Set();
    for (const sm of sitemaps) {
        const xml = fs.readFileSync(path.join(ROOT, sm), 'utf8');
        for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
            urls.add(m[1]);
        }
    }
    return [...urls];
}

function postIndexNow(urls) {
    const payload = JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: urls
    });
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: 'POST',
            hostname: 'api.indexnow.org',
            path: '/IndexNow',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

(async () => {
    const urls = collectUrls().slice(0, LIMIT);
    console.log(`收集到 ${urls.length} 个 URL，开始 ping IndexNow...`);
    const result = await postIndexNow(urls);
    console.log(`HTTP ${result.status}`);
    if (result.body) console.log(result.body);
    if (result.status >= 400) process.exit(2);
})();
