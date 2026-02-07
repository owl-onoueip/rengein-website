// ==========================================
// 分院アコーディオン
// ==========================================

window.toggleBranch = function (branchId) {
    const body = document.getElementById(`${branchId}-body`);
    const icon = document.getElementById(`${branchId}-icon`);

    // アコーディオン切り替え
    body.classList.toggle('active');
    icon.classList.toggle('active');

    // 展開時に地図を初期化
    if (body.classList.contains('active')) {
        setTimeout(() => {
            if (typeof initLeafletMap === 'function') {
                initLeafletMap(branchId);
            }
        }, 400); // アニメーション完了後
    }
};
