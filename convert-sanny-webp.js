const sharp = require('sharp');
const fs = require('fs');

const input = 'redesign-v2/images/sanny_new.png';
const output = 'redesign-v2/images/sanny_new.webp';

async function convertImage() {
    try {
        console.log(`Converting ${input}...`);
        await sharp(input)
            .resize(800, null, { withoutEnlargement: true }) // Resize to reasonable width for a card image
            .webp({ quality: 85 })
            .toFile(output);

        const stats = fs.statSync(output);
        console.log(`  -> ${output} (${(stats.size / 1024).toFixed(0)} KB)`);
    } catch (err) {
        console.error(`Error converting ${input}:`, err.message);
    }
}

convertImage();
