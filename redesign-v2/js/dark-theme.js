// ==========================================
// 蓮花院 ダークテーマ JavaScript
// 第3案：没入型ストーリーテリング（軽量版）
// ==========================================

(function () {
    'use strict';

    // ==========================================
    // ローディング画面
    // ==========================================
    // ==========================================
    // ローディング画面
    // ==========================================
    function hideLoader() {
        const loader = document.querySelector('.loader-wrapper');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }

    window.addEventListener('load', function () {
        setTimeout(hideLoader, 1500);
    });

    // Failsafe: 3秒経っても消えなければ強制的に消す
    setTimeout(hideLoader, 3000);

    // If already loaded
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 500);
    }

    // ==========================================
    // ナビゲーション - スクロール時の変化
    // ==========================================
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // スクロール進捗バー
        updateScrollProgress();
    });

    // ==========================================
    // スクロール進捗バー
    // ==========================================
    function updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress-bar');
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.height = progress + '%';
        }
    }

    // ==========================================
    // スムーズスクロール（ナビゲーションリンク）
    // ==========================================
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // アクティブリンクの更新
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // ==========================================
    // ヒーローセクション - スクロールインジケーター
    // ==========================================
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const firstSection = document.querySelector('.intro-section');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // Intersection Observer - スクロールアニメーション
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // アニメーション要素の監視
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // ==========================================
    // シンプルスライドショー
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showNextSlide() {
        // 現在のスライドを非表示
        slides[currentSlide].classList.remove('active');

        // 次のスライドへ
        currentSlide = (currentSlide + 1) % slides.length;

        // 次のスライドを表示
        slides[currentSlide].classList.add('active');
    }

    // 5秒ごとにスライドを切り替え
    if (slides.length > 0) {
        setInterval(showNextSlide, 5000);
    }

    // ==========================================
    // 分院カードのインタラクション
    // ==========================================
    // segaki-btn は別のハンドラで処理するため除外
    const branchButtons = document.querySelectorAll('.branch-button:not(#segaki-btn)');
    branchButtons.forEach(button => {
        button.addEventListener('click', function () {
            const branchName = this.getAttribute('data-branch');
            alert(`${branchName}の詳細ページへ遷移します（準備中）`);
            // 実際の実装時は、モーダルを開くか、詳細ページへ遷移
        });
    });

    // ==========================================
    // モバイルメニュートグル
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', function () {
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // ==========================================
    // キーボードアクセシビリティ
    // ==========================================
    document.addEventListener('keydown', function (e) {
        // Escキーでモバイルメニューを閉じる
        if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // ==========================================
    // パフォーマンス最適化：画像の遅延読み込み
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==========================================
    // デバッグ用：コンソールログ
    // ==========================================
    console.log('%c蓮花院 ウェブサイト', 'color: #d4af37; font-size: 24px; font-weight: bold;');
    console.log('%c第3案：没入型ストーリーテリング（軽量版）', 'color: #ff9f43; font-size: 14px;');
    console.log('%c設計：Antigravity AI', 'color: #8a8d96; font-size: 12px;');

})();

// ==========================================
// モーダル制御 (汎用化)
// ==========================================

// 汎用モーダルオープン関数
window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        console.log(`Modal Opened: ${modalId}`);
    } else {
        console.error(`Modal not found: ${modalId}`);
    }
};

// 各モーダル用ラッパー関数 (インライン呼び出し用)
window.openSegakiModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('segaki-modal');
};

window.openHistoryModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('history-modal');
};

window.openGreetingModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('greeting-modal');
};

window.openPrecinctsModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('precincts-modal');
};

document.addEventListener("DOMContentLoaded", function () {
    const closeModals = document.querySelectorAll(".close-modal");
    const modals = document.querySelectorAll(".modal");

    // 閉じるボタンの処理
    closeModals.forEach(btn => {
        btn.addEventListener("click", function () {
            const modal = btn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // モーダル背景クリックで閉じる処理
    window.addEventListener("click", function (e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    function closeModal(modal) {
        modal.classList.remove("active");
        modal.style.display = '';
        modal.style.opacity = '';
        modal.style.pointerEvents = '';
        document.body.style.overflow = "auto";
    }
});
