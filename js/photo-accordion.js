// ==========================================
// 施餓鬼写真ギャラリー - アコーディオン式
// ==========================================

// 写真データ設定
const SEGAKI_PHOTO_DATA = {
    2025: {
        count: 5,
        prefix: 'shakai',
        format: 'shakai2025_{num}.webp'  // shakai2025_01.webp
    },
    2024: {
        count: 8,
        prefix: 'shakaki',
        format: 'shakaki2024_{num}.webp'  // shakaki2024_01.webp
    },
    2023: {
        count: 6,
        prefix: 'img',
        format: 'img{num}.webp'  // img01.webp
    },
    2022: {
        count: 6,
        prefix: 'img',
        format: 'img{num}.webp'  // img01.webp
    }
};

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function () {
    console.log('施餓鬼写真アコーディオンを初期化中...');

    // 施餓鬼モーダルが存在するか確認
    const segakiModal = document.getElementById('segaki-modal');
    if (segakiModal) {
        // モーダルが開いたときに写真ギャラリーを追加
        segakiModal.addEventListener('shown', initPhotoAccordions);
    }
});

// 施餓鬼モーダルを開く関数を拡張
(function () {
    const originalOpenSegakiModal = window.openSegakiModal;

    window.openSegakiModal = function (event) {
        if (event) event.preventDefault();

        const modal = document.getElementById('segaki-modal');
        if (!modal) return;

        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';

        // 初回のみ写真アコーディオンを追加
        if (!modal.dataset.photosInitialized) {
            initPhotoAccordions();
            modal.dataset.photosInitialized = 'true';
        }

        console.log('施餓鬼モーダルを開きました');
    };
})();

// 写真アコーディオンを初期化
function initPhotoAccordions() {
    const archiveItems = document.querySelectorAll('#segaki-modal .archive-item');
    const years = Object.keys(SEGAKI_PHOTO_DATA).map(Number).sort((a, b) => b - a);

    console.log('写真アコーディオンを追加:', years);

    archiveItems.forEach((item, index) => {
        const year = years[index];
        if (!year || !SEGAKI_PHOTO_DATA[year]) return;

        const photoData = SEGAKI_PHOTO_DATA[year];

        // アコーディオンHTMLを生成
        const accordion = createPhotoAccordion(year, photoData);
        item.appendChild(accordion);
    });

    // Lightbox生成（モーダル内に1つだけ）
    createLightbox();
}

// アコーディオンHTML生成
function createPhotoAccordion(year, photoData) {
    const container = document.createElement('div');
    container.className = 'photo-accordion';

    // トグルボタン
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'photo-toggle-btn';
    toggleBtn.innerHTML = `<i class="fas fa-camera"></i> 写真を見る（${photoData.count}枚） <i class="fas fa-chevron-down"></i>`;
    toggleBtn.dataset.year = year;

    // 写真グリッドコンテナ
    const gridContainer = document.createElement('div');
    gridContainer.className = 'photo-grid-container';
    gridContainer.dataset.year = year;

    const grid = document.createElement('div');
    grid.className = 'photo-grid';

    // サムネイル生成
    for (let i = 1; i <= photoData.count; i++) {
        const num = String(i).padStart(2, '0');
        const filename = photoData.format.replace('{num}', num);
        const imgUrl = `/images/shakaki${year}/${filename}`;

        const thumbnail = document.createElement('div');
        thumbnail.className = 'photo-thumbnail';
        thumbnail.dataset.imgUrl = imgUrl;
        thumbnail.dataset.index = i - 1;
        thumbnail.dataset.year = year;

        thumbnail.innerHTML = `<img src="${imgUrl}" alt="${year}年施餓鬼法要 写真${i}" onerror="this.parentElement.style.display='none'">`;

        // クリックでLightbox開く
        thumbnail.addEventListener('click', function () {
            openLightbox(year, parseInt(this.dataset.index));
        });

        grid.appendChild(thumbnail);
    }

    gridContainer.appendChild(grid);

    // トグルボタンのクリックイベント
    toggleBtn.addEventListener('click', function () {
        const isActive = gridContainer.classList.contains('active');

        if (isActive) {
            gridContainer.classList.remove('active');
            this.innerHTML = `<i class="fas fa-camera"></i> 写真を見る（${photoData.count}枚） <i class="fas fa-chevron-down"></i>`;
        } else {
            gridContainer.classList.add('active');
            this.innerHTML = `<i class="fas fa-camera"></i> 写真を閉じる <i class="fas fa-chevron-up"></i>`;
        }
    });

    container.appendChild(toggleBtn);
    container.appendChild(gridContainer);

    return container;
}

// Lightbox生成
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'photo-lightbox';
    lightbox.className = 'photo-lightbox';

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img id="lightbox-img" class="lightbox-image" src="" alt="">
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
            <button class="lightbox-prev lightbox-nav"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-next lightbox-nav"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;

    document.body.appendChild(lightbox);

    // イベントリスナー
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

    // 背景クリックで閉じる
    lightbox.addEventListener('click', function (e) {
        if (e.target === this) closeLightbox();
    });

    // キーボード操作
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

let currentLightboxYear = null;
let currentLightboxIndex = 0;

// Lightboxを開く
function openLightbox(year, index) {
    const lightbox = document.getElementById('photo-lightbox');
    const img = document.getElementById('lightbox-img');
    const photoData = SEGAKI_PHOTO_DATA[year];

    currentLightboxYear = year;
    currentLightboxIndex = index;

    const num = String(index + 1).padStart(2, '0');
    const filename = photoData.format.replace('{num}', num);
    const imgUrl = `/images/shakaki${year}/${filename}`;

    img.src = imgUrl;
    img.alt = `${year}年施餓鬼法要 写真${index + 1}`;

    // 2025年の1〜3枚目（index 0, 1, 2）は回転させる
    if (year === 2025 && index < 3) {
        img.classList.add('rotate-180');
    } else {
        img.classList.remove('rotate-180');
    }

    // 2025年の1〜3枚目（index 0, 1, 2）は回転させる
    if (year === 2025 && index < 3) {
        img.classList.add('rotate-180');
    } else {
        img.classList.remove('rotate-180');
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Lightboxを閉じる
function closeLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Lightbox内で写真を移動
function navigateLightbox(direction) {
    if (!currentLightboxYear) return;

    const photoData = SEGAKI_PHOTO_DATA[currentLightboxYear];
    currentLightboxIndex = (currentLightboxIndex + direction + photoData.count) % photoData.count;

    openLightbox(currentLightboxYear, currentLightboxIndex);
}

console.log('施餓鬼写真アコーディオン機能を読み込みました');
