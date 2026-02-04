// ==========================================
// 蓮花院 ダークテーマ JavaScript
// 第3案：没入型ストーリーテリング（軽量版）
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    'use strict';

    // デバッグログ
    console.log("DOM loaded. Initializing Dark Theme JS.");

    // ==========================================
    // モーダル制御 (汎用化)
    // ==========================================

    // モーダルを開く関数
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            // 強制的にリフローさせてtransitionを効かせる
            void modal.offsetWidth;
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
            console.log(`Modal Opened: ${modalId}`);
        } else {
            console.error(`Modal not found: ${modalId}`);
        }
    };

    // モーダルを閉じる関数
    function closeModal(modal) {
        if (!modal) return;
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';

        // トランジション終了後に非表示 (簡易的にtimeout)
        setTimeout(() => {
            modal.classList.remove("active");
            modal.style.display = 'none';
            document.body.style.overflow = "auto";
        }, 300);
    }

    // 閉じるボタンのイベントリスナー
    const closeModals = document.querySelectorAll(".close-modal");
    closeModals.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // モーダル背景クリックで閉じる処理
    window.addEventListener("click", function (e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // ==========================================
    // 分院ボタンのイベントリスナー
    // (HTML側のonclickで制御するため、JS側のイベントリスナーは削除済み)
    // ==========================================

    // ==========================================
    // ラッパー関数 (HTMLからの直接呼び出し用)
    // ==========================================
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

    window.openTaishidoModal = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openModal('taishido-modal');
    };

    window.openSannyuryoModal = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openModal('sannyuryo-modal');
    };

    window.openMitsuzoinModal = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openModal('mitsuzoin-modal');
    };

    window.openPrecinctsModal = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openModal('precincts-modal');
    };


    // ==========================================
    // その他機能 (ローディング、スクロールなど)
    // ==========================================

    // ローディング画面
    function hideLoader() {
        const loader = document.querySelector('.loader-wrapper');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3000); // Failsafe

    // ナビゲーション
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            if (nav) nav.classList.add('scrolled');
        } else {
            if (nav) nav.classList.remove('scrolled');
        }
        updateScrollProgress();
    });

    function updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress-bar');
        if (!scrollProgress) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        scrollProgress.style.height = progress + '%';
    }

    // スムーズスクロール
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // ページ内リンク（#で始まる）のみスムーズスクロールを適用
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();

                if (targetId === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                }

                // アクティブ状態の更新
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            // 外部ページや別ページへのリンクは何もしない（デフォルト動作）
        });
    });

    // ヒーローインジケーター
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const firstSection = document.querySelector('.intro-section');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Intersection Observer
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // スライドショー (シンプル)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // モバイルメニュー
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', function () {
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // 画像遅延読み込み
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    obs.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    console.log("Dark Theme JS initialization complete.");
});
