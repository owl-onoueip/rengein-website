const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
    { input: 'redesign-v2/images/intro_slide1.png', output: 'redesign-v2/images/intro_slide1.webp' },
    { input: 'redesign-v2/images/intro_slide2.jpg', output: 'redesign-v2/images/intro_slide2.webp' }
];

async function convertImages() {
    for (const img of images) {
        try {
            console.log(`Converting ${img.input}...`);
            await sharp(img.input)
                .resize(1200, null, { withoutEnlargement: true })
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
