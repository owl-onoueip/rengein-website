const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
    { input: 'images/topg003 (1).png', output: 'images/topg003_1.webp' },
    { input: 'images/tpg003 (2).png', output: 'images/topg003_2.webp' },
    { input: 'images/topg003 (3).png', output: 'images/topg003_3.webp' },
    { input: 'images/TOPG001.png', output: 'images/TOPG001.webp' }
];

async function convertImages() {
    for (const img of images) {
        try {
            console.log(`Converting ${img.input}...`);
            await sharp(img.input)
                .resize(1920, null, { withoutEnlargement: true })
                .webp({ quality: 85 })
                .toFile(img.output);

            const stats = fs.statSync(img.output);
            console.log(`  -> ${img.output} (${(stats.size / 1024).toFixed(0)} KB)`);
        } catch (err) {
            console.error(`Error converting ${img.input}:`, err.message);
        }
    }
    console.log('Done!');
}

convertImages();
