const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 施餓鬼写真フォルダのリスト
const SEGAKI_FOLDERS = [
    'images/shakaki2022',
    'images/shakaki2023',
    'images/shakaki2024',
    'images/shakaki2025'
];

// WebP変換設定
const WEBP_QUALITY = 85;

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputPath);

        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(outputPath).size;
        const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${reduction}% 削減)`);
        return { inputSize, outputSize };
    } catch (error) {
        console.error(`❌ エラー: ${inputPath}`, error.message);
        return null;
    }
}

async function convertSegakiPhotos() {
    console.log('🔄 施餓鬼写真のWebP変換を開始します...\n');

    let totalInput = 0;
    let totalOutput = 0;
    let convertedCount = 0;

    for (const folder of SEGAKI_FOLDERS) {
        const folderPath = path.join(__dirname, folder);

        if (!fs.existsSync(folderPath)) {
            console.warn(`⚠️ フォルダが見つかりません: ${folder}`);
            continue;
        }

        console.log(`\n📁 ${folder}`);

        const files = fs.readdirSync(folderPath);
        const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));

        for (const file of jpgFiles) {
            const inputPath = path.join(folderPath, file);
            const outputPath = inputPath.replace(/\.jpg$/i, '.webp');

            // すでにWebPファイルが存在する場合はスキップ
            if (fs.existsSync(outputPath)) {
                console.log(`⏭️  ${file} (既存)`);
                continue;
            }

            const result = await convertToWebP(inputPath, outputPath);

            if (result) {
                totalInput += result.inputSize;
                totalOutput += result.outputSize;
                convertedCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 変換結果サマリー');
    console.log('='.repeat(60));
    console.log(`変換枚数: ${convertedCount}枚`);
    console.log(`元のサイズ: ${(totalInput / 1024 / 1024).toFixed(2)} MB`);
    console.log(`変換後: ${(totalOutput / 1024 / 1024).toFixed(2)} MB`);
    console.log(`削減率: ${((1 - totalOutput / totalInput) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    console.log('\n✅ WebP変換が完了しました！');
    console.log('💡 次のステップ: photo-accordion.js のファイル拡張子を .webp に更新します');
}

convertSegakiPhotos().catch(console.error);
