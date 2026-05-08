/**
 * 轻量 RUM 上报（G3）。
 *
 * 引入 web-vitals 官方脚本（4 KB gzipped），监听 Core Web Vitals：
 *   LCP（Largest Contentful Paint）
 *   CLS（Cumulative Layout Shift）
 *   INP（Interaction to Next Paint）
 *   FCP（First Contentful Paint）
 *   TTFB（Time to First Byte）
 *
 * 默认上报到 Cloudflare Web Analytics / 自建 endpoint：
 *   - 通过 `<meta name="rum-endpoint" content="https://your-endpoint">` 配置
 *   - 未配置时仅打印到 console（开发用）
 *
 * 仅在生产域名（hengjitaipipeline.com）上报，避免本地预览污染数据。
 */

(function () {
    'use strict';

    var IS_PROD = location.hostname.endsWith('hengjitaipipeline.com');
    var endpointMeta = document.querySelector('meta[name="rum-endpoint"]');
    var ENDPOINT = endpointMeta ? endpointMeta.getAttribute('content') : '';

    function send(metric) {
        var payload = {
            name: metric.name,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            rating: metric.rating,
            id: metric.id,
            navigationType: metric.navigationType || 'unknown',
            url: location.pathname,
            lang: document.documentElement.lang || 'unknown',
            ua: navigator.userAgent.slice(0, 120)
        };
        if (!IS_PROD || !ENDPOINT) {
            // 开发模式：打 console 即可
            try { console.debug('[web-vitals]', payload); } catch (_) {}
            return;
        }
        try {
            var body = JSON.stringify(payload);
            // 优先 sendBeacon（页面卸载时也能发出）
            if (navigator.sendBeacon) {
                navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
            } else {
                fetch(ENDPOINT, {
                    method: 'POST',
                    body: body,
                    headers: { 'Content-Type': 'application/json' },
                    keepalive: true
                }).catch(function () {});
            }
        } catch (_) {}
    }

    function load(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    load('https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.iife.js')
        .then(function () {
            if (!window.webVitals) return;
            window.webVitals.onLCP(send);
            window.webVitals.onCLS(send);
            window.webVitals.onINP(send);
            window.webVitals.onFCP(send);
            window.webVitals.onTTFB(send);
        })
        .catch(function () {/* 静默：不上报不算事故 */});
})();
