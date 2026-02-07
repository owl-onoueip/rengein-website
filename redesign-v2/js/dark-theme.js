// ==========================================
// 蓮花院 ダークテーマ JavaScript (Redesign-V2専用)
// ==========================================

(function () {
    'use strict';

    console.log("Redesign-V2 JS Loaded Successfully");

    // ローディング画面
    function hideLoader() {
        const loader = document.querySelector('.loader-wrapper');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }

    window.addEventListener('load', function () {
        setTimeout(hideLoader, 1000);
    });

    setTimeout(hideLoader, 3000);

    // ナビゲーション
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            if (nav) nav.classList.add('scrolled');
        } else {
            if (nav) nav.classList.remove('scrolled');
        }
    });

    // モバイルメニュー
    document.addEventListener('click', function (e) {
        const toggle = e.target.closest('.menu-toggle');
        if (toggle) {
            const navLinksContainer = document.querySelector('.nav-links');
            if (navLinksContainer) {
                navLinksContainer.classList.toggle('active');
                toggle.classList.toggle('active');
            }
        }
    });

    // スムーズスクロール
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
                // メニューを閉じる
                const navLinksContainer = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinksContainer) navLinksContainer.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            }
        });
    });

})();

// ==========================================
// モーダル制御
// ==========================================

window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // モーダルを表示
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.style.visibility = 'visible';
        modal.style.zIndex = '99999';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // 背景スクロールを完全に無効化
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        console.log(`Modal Opened: ${modalId}`);
    } else {
        console.error(`Modal not found: ${modalId}`);
    }
};

window.openNewsModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    console.log("Opening News Modal...");
    openModal('news-modal');
};

window.openSegakiModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('segaki-modal');
};

window.openGreetingModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('greeting-modal');
};

window.openPrecinctsModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('precincts-modal');
};

window.openHistoryModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('history-modal');
};

window.openTaishidoModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('taishido-modal');
    setTimeout(() => {
        if (typeof initLeafletMap === 'function') initLeafletMap('taishido');
    }, 300);
};

window.openSannyuryoModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('sannyuryo-modal');
    setTimeout(() => {
        if (typeof initLeafletMap === 'function') initLeafletMap('sannyuryo');
    }, 300);
};

window.openMitsuzoinModal = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    openModal('mitsuzoin-modal');
    setTimeout(() => {
        if (typeof initLeafletMap === 'function') initLeafletMap('mitsuzoin');
    }, 300);
};

document.addEventListener("DOMContentLoaded", function () {
    const closeModals = document.querySelectorAll(".close-modal");
    closeModals.forEach(btn => {
        btn.addEventListener("click", function () {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove("active");
                modal.style.display = 'none';

                // スクロール位置を復元
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        });
    });

    window.addEventListener("click", function (e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove("active");
            e.target.style.display = 'none';

            // スクロール位置を復元
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    });
});
