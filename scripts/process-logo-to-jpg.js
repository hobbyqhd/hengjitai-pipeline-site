/**
 * Flatten logo PNG onto white, replace light neutral background with pure white,
 * trim margins, write images/logo.jpg (mozjpeg).
 */
'use strict';

const sharp = require('sharp');
const path = require('path');

const root = path.join(__dirname, '..');
const input = path.join(root, 'images', 'logo.png');
const output = path.join(root, 'images', 'logo.jpg');

/** Treat low-chroma, lighter pixels as textured gray backdrop → white */
function isBackground(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const spread = max - min;
    const avg = (r + g + b) / 3;
    if (spread <= 42 && avg >= 148) return true;
    if (avg >= 238) return true;
    return false;
}

(async () => {
    const { data, info } = await sharp(input)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const buf = Buffer.from(data);
    for (let i = 0; i < buf.length; i += channels) {
        const r = buf[i];
        const g = buf[i + 1];
        const b = buf[i + 2];
        if (isBackground(r, g, b)) {
            buf[i] = 255;
            buf[i + 1] = 255;
            buf[i + 2] = 255;
        }
    }

    await sharp(buf, { raw: { width, height, channels } })
        .trim({ threshold: 14, background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: '4:4:4' })
        .toFile(output);

    const meta = await sharp(output).metadata();
    console.log(`Wrote ${path.relative(root, output)} ${meta.width}x${meta.height}`);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
